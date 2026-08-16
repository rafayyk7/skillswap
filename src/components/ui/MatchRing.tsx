import { cn } from "@/lib/utils";

interface MatchRingProps {
  percentage: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { outer: 48, stroke: 4, textSize: "text-xs" },
  md: { outer: 64, stroke: 5, textSize: "text-sm" },
  lg: { outer: 80, stroke: 6, textSize: "text-base" },
};

export default function MatchRing({ percentage, size = "md", className }: MatchRingProps) {
  const { outer, stroke, textSize } = sizeMap[size];
  const radius = (outer - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (pct: number) => {
    if (pct >= 90) return "#6366f1";
    if (pct >= 75) return "#8b5cf6";
    if (pct >= 60) return "#06b6d4";
    return "#10b981";
  };

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: outer, height: outer }}
    >
      <svg
        width={outer}
        height={outer}
        viewBox={`0 0 ${outer} ${outer}`}
        className="-rotate-90 absolute inset-0"
      >
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          fill="none"
          stroke={getColor(percentage)}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <span className={cn("font-bold text-white z-10", textSize)}>
        {percentage}%
      </span>
    </div>
  );
}

