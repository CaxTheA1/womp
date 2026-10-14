import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TierBadge } from "@/components/TierBadge";
import type { App } from "@/lib/apps";
import { TIERS } from "@/lib/tiers";
import { cn } from "@/lib/utils";

/** The app's image, or its initial on a background tinted by its tier. */
export function AppArt({ app, className }: { app: App; className?: string }) {
  return app.image ? (
    <img src={app.image} alt="" loading="lazy" decoding="async" className={cn("size-full object-cover", className)} />
  ) : (
    <div
      aria-hidden
      className={cn("flex size-full items-center justify-center bg-gradient-to-br bg-muted/40", TIERS[app.tier].placeholder)}
    >
      <span className="font-heading text-5xl font-semibold tracking-tight text-foreground/25 select-none">
        {app.name.slice(0, 1)}
      </span>
    </div>
  );
}

export function AppCard({ app }: { app: App }) {
  return (
    <a href={`/apps/${app.id}/`} className="block h-full rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
      <Card className="group h-full gap-0 pt-0 transition duration-200 hover:-translate-y-0.5 hover:ring-foreground/20 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/40">
        <div className="relative aspect-[460/215] overflow-hidden border-b border-border/60">
          <AppArt app={app} className="transition duration-300 group-hover:scale-[1.03]" />
        </div>
        <CardHeader className="pt-4">
          <CardTitle className="text-base font-semibold">{app.name}</CardTitle>
          <CardDescription className="leading-relaxed">{app.description}</CardDescription>
        </CardHeader>
        <CardContent className="mt-auto pt-4">
          <TierBadge tier={app.tier} />
        </CardContent>
      </Card>
    </a>
  );
}
