"use client"
import { useShortEditor } from '@/contexts/ShortEditorContext';
import { formatTime } from '@/lib/utils';
import React, { useEffect, useRef, useState } from 'react'

const Player = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { currentProject, currentShort } = useShortEditor();

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [duration, setDuration] = useState(0);

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
            setCurrentTime(video.currentTime);
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
    }, [currentProject, currentShort]);

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

    return (
        <div className="w-full h-full overflow-hidden flex flex-col items-center justify-center gap-10">
            <div className="relative inset-0 h-[60%] w-full bg-black p-1 rounded-2xl">
                <video 
                    ref={videoRef} 
                    className="w-full h-full"
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
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            <div className="h-[10%] w-full flex flex-col items-center justify-center gap-2">
                <div className="w-full h-fit flex items-center justify-between">
                    <p className="text-white text-sm">{formatTime(currentTime)}</p>
                    <p className="text-white text-sm">{formatTime(duration)}</p>
                </div>
                <div className="h-10 bg-silver/20 w-full rounded-2xl overflow-hidden relative">
                    <div 
                        className="absolute top-0 left-0 h-full w-full flex items-center justify-end transition-all duration-200 ease-in-out"
                        style={{
                            width: `${from}%`
                        }}
                    >
                        <div className="h-full w-full bg-[#FF9505]/20"/>
                    </div>
                    <div 
                        className="absolute top-0 left-0 h-full w-1 flex items-center justify-end transition-all duration-200 ease-in-out"
                        style={{
                            width: `${progress}%`
                        }}
                    >
                        <div className="h-full w-1 bg-[#FF9505]"/>
                    </div>
                    <div 
                        className="absolute top-0 right-0 h-full w-full flex items-center justify-end transition-all duration-200 ease-in-out"
                        style={{
                            width: `${100 - to}%`
                        }}
                    >
                        <div className="h-full w-full bg-[#FF9505]/20"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Player