import { Badge } from "@/components/ui/badge";
import { TIERS, type TierId } from "@/lib/tiers";
import { cn } from "@/lib/utils";

export function TierBadge({ tier, className }: { tier: TierId; className?: string }) {
  const t = TIERS[tier];
  return (
    <Badge className={cn("ring-1 ring-inset", t.badge, className)} title={t.summary}>
      <span aria-hidden className={cn("size-1.5 rounded-full", t.swatch)} />
      {t.label}
    </Badge>
  );
}
