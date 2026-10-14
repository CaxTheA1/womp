import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TierBadge } from "@/components/TierBadge";
import type { App } from "@/lib/apps";
import { TIERS } from "@/lib/tiers";
import { cn } from "@/lib/utils";

export function AppCard({ app }: { app: App }) {
  return (
    <Card className="group h-full gap-0 pt-0 transition duration-200 hover:-translate-y-0.5 hover:ring-foreground/20 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/40">
      <div className="relative aspect-video overflow-hidden border-b border-border/60">
        {app.image ? (
          <img
            src={app.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            aria-hidden
            className={cn(
              "flex size-full items-center justify-center bg-gradient-to-br bg-muted/40",
              TIERS[app.tier].placeholder,
            )}
          >
            <span className="font-heading text-5xl font-semibold tracking-tight text-foreground/25 select-none">
              {app.name.slice(0, 1)}
            </span>
          </div>
        )}
      </div>
      <CardHeader className="pt-4">
        <CardTitle className="text-base font-semibold">{app.name}</CardTitle>
        <CardDescription className="leading-relaxed">{app.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-4">
        <TierBadge tier={app.tier} />
      </CardContent>
    </Card>
  );
}
