import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import Container from "./Container";
import { useNewProject } from "@/contexts/NewProjectContext";

interface VideoTrimProps {
  duration: number; // in seconds
}

export default function VideoTrimSlider({ duration }: VideoTrimProps) {
  const [range, setRange] = useState<[number, number]>([0, duration]);
  const { ProjectData, updateProjectData } = useNewProject();

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
          <input
            type="number"
            min={0}
            max={range[1]}
            value={range[0].toFixed(2)}
            onChange={(e) => updateRange(0, Number(e.target.value))}
            className="border-0 outline-0 bg-transparent w-14 text-center appearance-none 
              [&::-webkit-outer-spin-button]:appearance-none 
              [&::-webkit-inner-spin-button]:appearance-none 
              [&::-moz-appearance:textfield]"
          />
        </Container>
        <Container>
          <input
            type="number"
            min={range[0]}
            max={duration}
            value={range[1].toFixed(2)}
            onChange={(e) => updateRange(1, Number(e.target.value))}
            className="border-0 outline-0 bg-transparent w-14 text-center appearance-none 
              [&::-webkit-outer-spin-button]:appearance-none 
              [&::-webkit-inner-spin-button]:appearance-none 
              [&::-moz-appearance:textfield]"
          />
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
