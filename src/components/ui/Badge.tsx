import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "default" | "success" | "warning" | "danger" | "info" | "purple" | "cyan";

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-white/8 text-slate-300 border-white/10",
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  danger: "bg-red-500/15 text-red-400 border-red-500/25",
  info: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  purple: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
};

const dotClasses: Record<Variant, string> = {
  default: "bg-slate-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
  info: "bg-blue-400",
  purple: "bg-violet-400",
  cyan: "bg-cyan-400",
};

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium border rounded-full",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        variantClasses[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotClasses[variant])} />
      )}
      {children}
    </span>
  );
}

