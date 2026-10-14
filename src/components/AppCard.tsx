import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TierBadge } from "@/components/TierBadge";
import { ExternalLink } from "lucide-react";
import { appLinks, type App } from "@/lib/apps";
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
  const links = appLinks(app);
  return (
    <Card className="group relative h-full gap-0 pt-0 transition duration-200 has-[a:hover]:-translate-y-0.5 has-[a:hover]:ring-foreground/20 has-[a:hover]:shadow-lg has-[a:hover]:shadow-black/5 dark:has-[a:hover]:shadow-black/40">
      <div className="relative aspect-[460/215] overflow-hidden border-b border-border/60">
        <AppArt app={app} className="transition duration-300 group-has-[a:hover]:scale-[1.03]" />
      </div>
      <CardHeader className="pt-4">
        <CardTitle className="text-base font-semibold">
          {/* The ::after box stretches this link over the whole card. */}
          <a
            href={`/apps/${app.id}/`}
            className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {app.name}
          </a>
        </CardTitle>
        <CardDescription className="leading-relaxed">{app.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between gap-3 pt-4">
        <TierBadge tier={app.tier} />
        {links.length > 0 && (
          <div className="relative z-10 flex items-center gap-3 text-xs">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {l.label} <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
