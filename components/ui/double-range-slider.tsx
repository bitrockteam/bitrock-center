"use client";

import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DoubleRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  step?: number;
  className?: string;
  label?: string;
}

export const DoubleRangeSlider = React.forwardRef<HTMLDivElement, DoubleRangeSliderProps>(
  ({ min, max, value, onValueChange, step = 1, className, label }, ref) => {
    const handleValueChange = (newValue: number[]) => {
      const [minVal, maxVal] = newValue;
      if (minVal < maxVal) {
        onValueChange([minVal, maxVal]);
      }
    };

    return (
      <div ref={ref} className={cn("w-full space-y-2", className)}>
        {label && <Label className="text-sm font-medium">{label}</Label>}
        <div className="space-y-4">
          <Slider
            value={value}
            onValueChange={handleValueChange}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{value[0]}%</span>
            <span>{value[1]}%</span>
          </div>
        </div>
      </div>
    );
  }
);

DoubleRangeSlider.displayName = "DoubleRangeSlider";
