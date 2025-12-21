import { cn } from "@/lib/utils";

interface RiskMeterProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export const RiskMeter = ({ score, size = "md" }: RiskMeterProps) => {
  const getColor = () => {
    if (score <= 30) return "text-safe";
    if (score <= 70) return "text-warning";
    return "text-fraud";
  };

  const getGradient = () => {
    if (score <= 30) return "from-safe to-safe/50";
    if (score <= 70) return "from-warning to-warning/50";
    return "from-fraud to-fraud/50";
  };

  const getLabel = () => {
    if (score <= 30) return "SAFE";
    if (score <= 70) return "SUSPICIOUS";
    return "FRAUD";
  };

  const getShadow = () => {
    if (score <= 30) return "shadow-safe/30";
    if (score <= 70) return "shadow-warning/30";
    return "shadow-fraud/30";
  };

  const sizes = {
    sm: { container: "h-24 w-24", text: "text-xl", label: "text-[10px]" },
    md: { container: "h-40 w-40", text: "text-4xl", label: "text-xs" },
    lg: { container: "h-56 w-56", text: "text-5xl", label: "text-sm" },
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center", sizes[size].container)}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-secondary"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={cn("stop-current", getColor())} />
            <stop offset="100%" className={cn("stop-current", getColor())} stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-mono font-bold", sizes[size].text, getColor())}>
          {score}
        </span>
        <span
          className={cn(
            "font-semibold tracking-widest mt-1 px-2 py-0.5 rounded-full",
            sizes[size].label,
            getColor(),
            score <= 30 && "bg-safe/10",
            score > 30 && score <= 70 && "bg-warning/10",
            score > 70 && "bg-fraud/10"
          )}
        >
          {getLabel()}
        </span>
      </div>

      {/* Glow effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-full blur-2xl opacity-20",
          `bg-gradient-to-br ${getGradient()}`
        )}
      />
    </div>
  );
};
