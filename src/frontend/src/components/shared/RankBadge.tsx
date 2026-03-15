import { cn } from "@/lib/utils";
import { Rank } from "../../backend";
import { rankLabel } from "../../lib/formatters";

const rankIcons: Record<Rank, string> = {
  [Rank.starter]: "○",
  [Rank.bronze]: "🥉",
  [Rank.silver]: "⭐",
  [Rank.gold]: "⭐",
  [Rank.platinum]: "💠",
  [Rank.diamond]: "💎",
};

interface RankBadgeProps {
  rank: Rank;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RankBadge({ rank, size = "md", className }: RankBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const rankClasses: Record<Rank, string> = {
    [Rank.starter]: "bg-muted text-muted-foreground",
    [Rank.bronze]: "bg-[oklch(35%_0.10_55)] text-[oklch(88%_0.08_55)]",
    [Rank.silver]: "bg-[oklch(55%_0.02_240)] text-[oklch(15%_0.02_240)]",
    [Rank.gold]: "bg-primary text-primary-foreground",
    [Rank.platinum]: "bg-[oklch(70%_0.03_220)] text-[oklch(15%_0.03_220)]",
    [Rank.diamond]:
      "bg-gradient-to-r from-[oklch(60%_0.18_250)] to-[oklch(70%_0.15_290)] text-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-body font-semibold tracking-wide",
        sizeClasses[size],
        rankClasses[rank],
        className,
      )}
    >
      <span className="text-xs">{rankIcons[rank]}</span>
      {rankLabel(rank)}
    </span>
  );
}
