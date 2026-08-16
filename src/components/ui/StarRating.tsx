"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const sizeClasses = {
  sm: "w-3.5 h-3.5",
  md: "w-4.5 h-4.5",
  lg: "w-6 h-6",
};

export default function StarRating({
  value,
  max = 5,
  size = "sm",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className={cn("flex gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = interactive ? i < (hovered || value) : i < value;
        return (
          <Star
            key={i}
            className={cn(
              sizeClasses[size],
              filled ? "text-amber-400 fill-amber-400" : "text-slate-600 fill-transparent",
              interactive && "cursor-pointer hover:scale-110 transition-transform"
            )}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange?.(i + 1)}
          />
        );
      })}
    </div>
  );
}

