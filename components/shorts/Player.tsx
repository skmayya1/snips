"use client"
import { useShortEditor } from '@/contexts/ShortEditorContext';
import { formatTime } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react'
import MultiToggle from './MultiToggle';

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

    const isShorts = currentProject?.config.aspectRatio === '9:16';

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
                console.log('From value changed:', newValue);
            } else if (isDragging === 'to') {
                const minTo = currentShort?.from ? currentShort.from + 0.1 : 0.1;
                newValue = Math.max(newValue, minTo);

                // Update the currentShort with new to value
                if (setCurrentShort && currentShort) {
                    setCurrentShort({
                        ...currentShort,
                        to: newValue
                    });
                }
                console.log('To value changed:', newValue);
            } else if (isDragging === 'progress') {
                setCurrentTime(newValue);
                if (videoRef.current) {
                    videoRef.current.currentTime = newValue;
                }
                console.log('Progress value changed:', newValue);
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                console.log('Drag ended for:', isDragging);
            }
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
            console.log('Started dragging from handle, initial value:', currentShort?.from ?? 0);
        } else if (type === 'to') {
            setDragStartValue(currentShort?.to ?? duration);
            console.log('Started dragging to handle, initial value:', currentShort?.to ?? duration);
        } else if (type === 'progress') {
            setDragStartValue(currentTime);
            console.log('Started dragging progress handle, initial value:', currentTime);
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
        console.log('Timeline clicked, new time:', newTime);
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
    console.log(currentProject.config.aspectRatio);

    return (
        <div className="w-[70%] h-full overflow-hidden flex flex-col items-center justify-center gap-6">

            <div className={`relative w-full bg-black rounded-2xl ${isShorts
                ? 'h-[80vh] max-w-[45vh]'  // Vertical shorts
                : 'h-[45vh] max-w-[80vh]'  // Horizontal standard
                }`}>
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

            <div className="h-[10%] w-full flex flex-col items-center justify-center gap-2 py-1">
                <div className="w-full h-fit flex items-center justify-between relative">
                    <p className="text-white text-sm">{formatTime(currentTime)}</p>
                    <p className="text-white text-sm">{formatTime(duration)}</p>
                    <div
                        className="absolute top-0 left-0 h-full w-full flex items-center justify-end transition-all duration-200 ease-in-out rounded-l-2xl"
                        style={{
                            width: `${from}%`
                        }}
                    >
                        <div className="h-full w-full justify-end flex items-center text-xs text-zinc-400" >
                            {(from / 60).toFixed(2)}
                        </div>
                    </div>
                    <div
                        className="absolute top-0 right-0 h-full w-full flex items-center justify-end transition-all duration-200 ease-in-out "
                        style={{
                            width: `${100 - to}%`
                        }}
                    >
                    <div className="h-full w-full justify-start flex items-center text-xs text-zinc-400" >
                            {(to / 60).toFixed(2)}
                        </div>
                    </div>
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
    )
}

export default Player