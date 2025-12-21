import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "safe" | "warning" | "fraud";
}

const variantStyles = {
  default: "border-border/50 bg-card",
  safe: "border-safe/30 bg-safe/5",
  warning: "border-warning/30 bg-warning/5",
  fraud: "border-fraud/30 bg-fraud/5",
};

const iconStyles = {
  default: "text-primary bg-primary/10",
  safe: "text-safe bg-safe/10",
  warning: "text-warning bg-warning/10",
  fraud: "text-fraud bg-fraud/10",
};

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:scale-[1.02]",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight font-mono">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-safe" : "text-fraud"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div
          className={cn(
            "rounded-lg p-3 transition-transform duration-300 hover:scale-110",
            iconStyles[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Subtle glow effect */}
      <div
        className={cn(
          "absolute -bottom-10 -right-10 h-32 w-32 rounded-full blur-3xl opacity-20",
          variant === "safe" && "bg-safe",
          variant === "warning" && "bg-warning",
          variant === "fraud" && "bg-fraud",
          variant === "default" && "bg-primary"
        )}
      />
    </div>
  );
};
