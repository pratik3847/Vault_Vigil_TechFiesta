import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

export const FeatureCard = ({
  title,
  description,
  icon: Icon,
  delay = 0,
}: FeatureCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 transition-all duration-500 hover:border-primary/50 hover:bg-card opacity-0 animate-fade-in-up",
        delay === 100 && "animation-delay-100",
        delay === 200 && "animation-delay-200",
        delay === 300 && "animation-delay-300",
        delay === 400 && "animation-delay-400"
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Icon */}
      <div className="relative mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
        <Icon className="h-6 w-6 text-primary" />
      </div>

      {/* Content */}
      <h3 className="relative mb-2 text-lg font-semibold text-foreground">
        {title}
      </h3>
      <p className="relative text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Corner decoration */}
      <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-primary/5 blur-2xl transition-all duration-500 group-hover:bg-primary/10 group-hover:scale-150" />
    </div>
  );
};
