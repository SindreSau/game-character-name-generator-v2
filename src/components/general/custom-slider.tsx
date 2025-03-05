'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

const CustomSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {props.defaultValue?.map((_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        className="h-8 w-8 rounded-full border-2 border-primary bg-background shadow-md hover:border-primary/80 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transition-colors duration-200 flex items-center justify-center cursor-grabbing"
      >
        <GripVertical size={18} className="text-muted-foreground" />
      </SliderPrimitive.Thumb>
    ))}
  </SliderPrimitive.Root>
));
CustomSlider.displayName = SliderPrimitive.Root.displayName;

export { CustomSlider };
