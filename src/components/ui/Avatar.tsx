import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  isOnline?: boolean;
  className?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
  "2xl": "w-24 h-24 text-3xl",
};

const onlineDotSize = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-3.5 h-3.5",
  "2xl": "w-4 h-4",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromName(name: string) {
  const colors = [
    "from-indigo-500 to-violet-500",
    "from-cyan-500 to-blue-500",
    "from-emerald-500 to-teal-500",
    "from-rose-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-purple-500 to-indigo-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export default function Avatar({ src, name, size = "md", isOnline, className }: AvatarProps) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <div
        className={cn(
          "rounded-full overflow-hidden ring-2 ring-black/10 dark:ring-white/10",
          sizeClasses[size]
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center font-semibold text-white bg-gradient-to-br",
              getColorFromName(name)
            )}
          >
            {getInitials(name)}
          </div>
        )}
      </div>
      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-surface-0 dark:ring-slate-900",
            onlineDotSize[size],
            isOnline ? "bg-emerald-400" : "bg-slate-500"
          )}
        />
      )}
    </div>
  );
}
