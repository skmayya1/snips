import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import Container from "./Container";
import { useNewProject } from "@/contexts/NewProjectContext";

interface VideoTrimProps {
  duration: number; // in seconds
}

// Format seconds into mm:ss
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoTrimSlider({ duration }: VideoTrimProps) {
  const [range, setRange] = useState<[number, number]>([0, duration]);
  const { ProjectData, updateProjectData ,VideoData } = useNewProject();

  const updateRange = (index: 0 | 1, value: number) => {
    let clampedValue = Math.min(Math.max(0, value), duration);
    const updated: [number, number] = [...range];

    if (index === 0) {
      updated[0] = Math.min(clampedValue, range[1]);
    } else {
      updated[1] = Math.max(clampedValue, range[0]);
    }

    setRange(updated);
  };
  
  useEffect(()=>{
    updateProjectData({
      ...ProjectData,
      timeframe:{
        from:0,
        to:duration
      }
    })
  },[])


  // Sync with global context
  useEffect(() => {
    updateProjectData({
      ...ProjectData,
      timeframe: {
        from: range[0],
        to: range[1],
      },
    });
  }, [range]);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Container>
          <span className="font-mono">{formatTime(range[0])}</span>
        </Container>
        <Container>
          <span className="font-mono">{formatTime(range[1])}</span>
        </Container>
      </div>
      <Slider
        min={0}
        max={duration}
        step={0.01}
        value={range}
        onValueChange={(val: [number, number]) => {
          setRange(val);
        }}
      />
    </div>
  );
}
