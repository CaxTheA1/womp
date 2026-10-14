import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AddAppDialog } from "@/components/AddAppDialog";
import { AppCard } from "@/components/AppCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { App } from "@/lib/apps";
import { TIER_IDS, TIERS, type TierId } from "@/lib/tiers";
import { cn } from "@/lib/utils";

type Filter = TierId | "all";

export function AppBrowser({ apps }: { apps: App[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c = Object.fromEntries(TIER_IDS.map((id) => [id, 0])) as Record<TierId, number>;
    for (const app of apps) c[app.tier]++;
    return c;
  }, [apps]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps.filter(
      (app) =>
        (filter === "all" || app.tier === filter) &&
        (q === "" || app.name.toLowerCase().includes(q) || app.description.toLowerCase().includes(q)),
    );
  }, [apps, filter, query]);

  return (
    <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)} className="gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <TabsList>
            <TabsTrigger value="all" className="px-3">
              All <Count n={apps.length} />
            </TabsTrigger>
            {TIER_IDS.map((id) => (
              <TabsTrigger key={id} value={id} className="px-3">
                <span aria-hidden className={cn("size-2 rounded-full", TIERS[id].swatch)} />
                {TIERS[id].label} <Count n={counts[id]} />
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-72 md:flex-none">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps"
              aria-label="Search apps"
              className="h-9 pl-8"
            />
          </div>
          <AddAppDialog />
        </div>
      </div>

      <TabsContent value={filter}>
        {filter !== "all" && (
          <p className="mb-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{TIERS[filter].label}:</span> {TIERS[filter].summary}
          </p>
        )}
        {visible.length > 0 ? (
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((app) => (
              <li key={app.id}>
                <AppCard app={app} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
            No apps match{query ? <> "{query}"</> : null}
            {filter !== "all" ? <> in {TIERS[filter].label}</> : null}.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

function Count({ n }: { n: number }) {
  return <span className="text-xs tabular-nums text-muted-foreground">{n}</span>;
}
