"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  min: number;
  max: number;
  step?: number;
  label?: string;
  value?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
}

const Slider = React.memo(React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      min,
      max,
      step = 1,
      label,
      value,
      onValueChange,
      onValueCommit,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full pt-2 pb-8">
        <SliderPrimitive.Root
          ref={ref}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
          )}
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={onValueChange}
          onValueCommit={onValueCommit}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-black/10">
            <SliderPrimitive.Range className="absolute h-full bg-black" />
          </SliderPrimitive.Track>

          {/* Thumb 1 */}
          <SliderPrimitive.Thumb className="relative block h-5 w-5 rounded-full border-2 border-black bg-white shadow-sm transition-transform active:scale-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:cursor-grab active:cursor-grabbing">
            {value && value[0] !== undefined && (
              <div
                className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black text-white px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-sm after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-black"
              >
                {label}{value[0]}
              </div>
            )}
          </SliderPrimitive.Thumb>

          {/* Thumb 2 */}
          <SliderPrimitive.Thumb className="relative block h-5 w-5 rounded-full border-2 border-black bg-white shadow-sm transition-transform active:scale-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:cursor-grab active:cursor-grabbing">
            {value && value[1] !== undefined && (
              <div
                className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black text-white px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-sm after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-black"
              >
                {label}{value[1]}
              </div>
            )}
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
      </div>
    );
  }
));

Slider.displayName = "Slider";

export { Slider };
