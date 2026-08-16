import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "glass" | "border" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const variantClasses = {
  default: "bg-surface-2 border border-white/5",
  glass: "glass",
  border: "border-gradient bg-surface-2",
  elevated: "bg-surface-3 border border-white/8 shadow-xl shadow-black/30",
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function Card({
  children,
  variant = "default",
  padding = "md",
  hover = false,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-200",
        variantClasses[variant],
        paddingClasses[padding],
        hover && "hover:border-white/15 hover:bg-white/4 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
