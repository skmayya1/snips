"use client"
import { useShortEditor } from '@/contexts/ShortEditorContext';
import { formatTime } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react'

import { RiSave3Line, RiArrowGoBackLine } from 'react-icons/ri';
import Container from '../Container';
import ToolTip from '../ToolTip';
import SelectInput from '../DropDown';

const aspectOptions = [
  { value: "16:9", label: "16:9" },
  { value: "1:1", label: "1:1" },
  { value: "9:16", label: "9:16" },
];

interface ShortHistory {
    from: number;
    to: number;
    aspectRatio: string;
}

const Player = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement | null>(null);
    const { currentProject, currentShort, toggleValue, setCurrentShort } = useShortEditor();

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isDragging, setIsDragging] = useState<'from' | 'to' | 'progress' | null>(null);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragStartValue, setDragStartValue] = useState(0);
    
    const [selectedAspectRatio, setSelectedAspectRatio] = useState(currentProject?.config.aspectRatio || "16:9");
    const [history, setHistory] = useState<ShortHistory[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const isShorts = selectedAspectRatio === '9:16';
    const isSquare = selectedAspectRatio === '1:1';

    useEffect(() => {
        if (currentShort && history.length === 0) {
            setHistory([{
                from: currentShort.from,
                to: currentShort.to,
                aspectRatio: selectedAspectRatio,
            }]);
        }
    }, [currentShort]);

    useEffect(() => {
        if (currentShort && history.length > 0) {
            const original = history[0];
            const hasChanges = 
                currentShort.from !== original.from ||
                currentShort.to !== original.to ||
                selectedAspectRatio !== original.aspectRatio;
            setHasUnsavedChanges(hasChanges);
        }
    }, [currentShort, selectedAspectRatio, history]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !currentProject?.url) return;

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            video.currentTime = currentShort?.from ?? 0;
            setCurrentTime(currentShort?.from ?? 0);
            setIsLoaded(true);
        };

        const handleTimeUpdate = () => {
            if (!isDragging) {
                setCurrentTime(video.currentTime);
            }
            if (video.currentTime >= video.duration) {
                video.pause();
                setIsPlaying(false);
            }
        };

        const handleError = (e: Event) => {
            console.error('Video error:', e);
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("error", handleError);

        video.src = currentProject.url;
        video.load();

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("error", handleError);
        };
    }, [currentProject, currentShort, isDragging]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging || !progressBarRef.current || duration === 0) return;

            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const rect = progressBarRef.current.getBoundingClientRect();
            const deltaX = clientX - dragStartX;
            const deltaPercent = (deltaX / rect.width) * 100;
            const deltaTime = (deltaPercent / 100) * duration;

            let newValue = dragStartValue + deltaTime;
            newValue = Math.max(0, Math.min(duration, newValue));

            if (isDragging === 'from') {
                const maxFrom = currentShort?.to ? currentShort.to - 0.1 : duration - 0.1;
                newValue = Math.min(newValue, maxFrom);
                
                if (setCurrentShort && currentShort) {
                    setCurrentShort({
                        ...currentShort,
                        from: newValue
                    });
                }
            } else if (isDragging === 'to') {
                const minTo = currentShort?.from ? currentShort.from + 0.1 : 0.1;
                newValue = Math.max(newValue, minTo);
                
                if (setCurrentShort && currentShort) {
                    setCurrentShort({
                        ...currentShort,
                        to: newValue
                    });
                }
            } else if (isDragging === 'progress') {
                setCurrentTime(newValue);
                if (videoRef.current) {
                    videoRef.current.currentTime = newValue;
                }
            }
        };

        const handleMouseUp = () => {
            setIsDragging(null);
            setDragStartX(0);
            setDragStartValue(0);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleMouseMove);
            document.addEventListener('touchend', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDragging, dragStartX, dragStartValue, duration, currentShort]);

    const handleDragStart = (type: 'from' | 'to' | 'progress', e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setDragStartX(clientX);
        setIsDragging(type);

        if (type === 'from') {
            setDragStartValue(currentShort?.from ?? 0);
        } else if (type === 'to') {
            setDragStartValue(currentShort?.to ?? duration);
        } else if (type === 'progress') {
            setDragStartValue(currentTime);
        }
    };

    const handleProgressBarClick = (e: React.MouseEvent) => {
        if (!progressBarRef.current || duration === 0 || isDragging) return;

        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickPercent = (clickX / rect.width) * 100;
        const newTime = (clickPercent / 100) * duration;

        setCurrentTime(newTime);
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    const togglePlay = () => {
        if (!videoRef.current || !isLoaded) return;

        if (isPlaying) {
            videoRef.current.pause();
        } else {
            if (videoRef.current.currentTime >= videoRef.current.duration) {
                videoRef.current.currentTime = currentShort?.from ?? 0;
            }
            videoRef.current.play().catch(error => {
                console.error('Error playing video:', error);
            });
        }
        setIsPlaying(!isPlaying);
    };

    const handleAspectRatioChange = (value:string) => {
        setSelectedAspectRatio(value as "16:9" | "1:1" | "9:16");
    };

    const handleSave = () => {
        if (currentShort) {
            // Add current state to history for undo
            setHistory(prev => [...prev, {
                from: currentShort.from,
                to: currentShort.to,
                aspectRatio: selectedAspectRatio,
            }]);
            
            // Here you would typically save to your backend
            // await saveShortChanges(currentShort.id, { from, to, aspectRatio });
            
            setHasUnsavedChanges(false);
            console.log('Saved changes:', {
                from: currentShort.from,
                to: currentShort.to,
                aspectRatio: selectedAspectRatio,
            });
        }
    };

    const handleUndo = () => {
        if (history.length > 1 && currentShort && setCurrentShort) {
            const previousState = history[history.length - 2];
            
            setCurrentShort({
                ...currentShort,
                from: previousState.from,
                to: previousState.to
            });
            
            setSelectedAspectRatio(previousState.aspectRatio as "16:9" | "1:1" | "9:16");
            
            setHistory(prev => prev.slice(0, -1));
        }
    };

    const getVideoContainerStyle = () => {
        if (isShorts) {
            return 'aspect-[9/16] max-h-[70vh] w-auto max-w-[40vh]';
        } else if (isSquare) {
            return 'aspect-square max-h-[60vh] max-w-[60vh]';
        } else {
            return 'aspect-video max-h-[50vh] w-full max-w-[80vh]';
        }
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    const from = (currentShort?.from ?? 0) / duration * 100;
    const to = (currentShort?.to ?? duration) / duration * 100;

    if (!currentProject?.url) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black rounded-2xl">
                <p className="text-white">No video available</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex gap-4 items-center justify-center">
            {/* Video Player - Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="">
                    <h1>{currentShort?.title}</h1>
                </div>
                <div className={`relative bg-black rounded-2xl overflow-hidden ${getVideoContainerStyle()}`}>
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        controls={false}
                        playsInline
                        preload="metadata"
                    >
                        <source src={currentProject.url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    <div
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={togglePlay}
                    >
                        {!isPlaying && (
                            <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-12 h-12 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timeline Controls */}
                <div className="w-full max-w-3xl flex flex-col gap-2">
                    <div className="flex justify-between text-sm text-white">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div 
                        ref={progressBarRef}
                        className="h-10 bg-silver/20 w-full rounded-2xl relative cursor-pointer"
                        onClick={handleProgressBarClick}
                    >
                        <div
                            className="absolute top-0 left-0 h-full w-full flex items-center justify-end transition-all duration-200 ease-in-out rounded-l-2xl"
                            style={{
                                width: `${from}%`
                            }}
                        >
                            <div 
                                className="h-12 w-1 border border-silver/60 px-1 bg-zinc-900 absolute -right-0.5 cursor-ew-resize hover:bg-zinc-700 z-10"
                                onMouseDown={(e) => handleDragStart('from', e)}
                                onTouchStart={(e) => handleDragStart('from', e)}
                                title="Drag to adjust start time"
                            />
                            <div className="h-full w-full rounded-l-2xl bg-[#FF9505]/20" />
                        </div>
                        <div
                            className="absolute top-0 left-0 h-full w-1 flex items-center justify-end transition-all duration-200 ease-in-out"
                            style={{
                                width: `${progress}%`
                            }}
                        >
                            <div 
                                className="h-full w-1 bg-[#FF9505] z-100 cursor-grab active:cursor-grabbing"
                                onMouseDown={(e) => handleDragStart('progress', e)}
                                onTouchStart={(e) => handleDragStart('progress', e)}
                                title="Drag to scrub video"
                            />
                        </div>
                        <div
                            className="absolute top-0 right-0 h-full w-full flex items-center justify-end transition-all duration-200 ease-in-out "
                            style={{
                                width: `${100 - to}%`
                            }}
                        >
                            <div 
                                className="h-12 w-1 z-0 border border-silver/60 px-1 bg-zinc-900 absolute -left-0.5 cursor-ew-resize hover:bg-zinc-700"
                                onMouseDown={(e) => handleDragStart('to', e)}
                                onTouchStart={(e) => handleDragStart('to', e)}
                                title="Drag to adjust end time"
                            />
                            <div className="h-full w-full bg-[#FF9505]/20 rounded-r-2xl" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-[25%] h-fit flex flex-col items-center justify-center">
                <Container background={false} border className="p-4 py-6 rounded-lg w-full flex flex-col gap-6 h-fit ">
                    {/* Aspect Ratio Controls */}
                    <div className="flex flex-col gap-3">
                        <label className="text-silver font-medium flex items-center gap-2">
                            Aspect Ratio
                            <ToolTip tooltipContent="Choose format: 16:9 (landscape), 1:1 (square), or 9:16 (vertical)">
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-eerie-black text-xs text-silver">
                                    ?
                                </span>
                            </ToolTip>
                        </label>
                        <SelectInput
                            label=""
                            placeholder="Select aspect ratio"
                            options={aspectOptions}
                            value={selectedAspectRatio}
                            onChange={handleAspectRatioChange}
                        />
                    </div>


                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                        {hasUnsavedChanges && (
                            <div className="text-xs text-[#FF9505] flex items-center gap-2 px-3 py-2 bg-[#FF9505]/10 rounded-lg">
                                <div className="w-2 h-2 bg-[#FF9505] rounded-full" />
                                Unsaved changes
                            </div>
                        )}
                        <button
                            onClick={handleUndo}
                            disabled={history.length <= 1}
                            className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
                                history.length > 1
                                    ? 'bg-silver/10 text-silver hover:bg-silver/20 cursor-pointer'
                                    : 'bg-silver/5 text-silver/50 cursor-not-allowed'
                            }`}
                        >
                            <RiArrowGoBackLine />
                            Undo Changes
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasUnsavedChanges}
                            className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${
                                hasUnsavedChanges
                                    ? 'bg-[#FF9505]/90 text-night hover:bg-[#FF9505] cursor-pointer'
                                    : 'bg-silver/20 text-silver/50 cursor-not-allowed'
                            }`}
                        >
                            <RiSave3Line />
                            Save Changes
                        </button>
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default Player