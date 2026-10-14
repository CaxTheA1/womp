import { useState } from "react";
import { Check, Copy, ExternalLink, GitFork, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TIER_IDS } from "@/lib/tiers";

const REPO = "https://github.com/frolleks/rosemarydb";

const SNIPPET = `{
  "id": "my-app",
  "name": "My App",
  "description": "One sentence about what the app is.",
  "tier": "gold",
  "steamAppId": 123456
}`;

export function AddAppDialog() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked; the snippet stays selectable.
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-9 shrink-0">
          <Plus /> Add an app
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] grid-cols-[minmax(0,1fr)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add an app</DialogTitle>
          <DialogDescription>
            Entries are added by pull request on GitHub. You need a GitHub account.
          </DialogDescription>
        </DialogHeader>

        <ol className="list-decimal space-y-3 pl-5 text-sm marker:text-muted-foreground">
          <li>
            Fork{" "}
            <a href={REPO} target="_blank" rel="noopener" className="font-medium underline underline-offset-4">
              frolleks/rosemarydb
            </a>{" "}
            to your account.
          </li>
          <li>
            Add an entry to the end of <code className="rounded bg-muted px-1 py-0.5 text-xs">src/data/apps.json</code>.
            <div className="relative mt-2">
              <pre className="overflow-x-auto rounded-lg bg-muted p-3 pr-10 text-xs leading-relaxed">{SNIPPET}</pre>
              <Button
                variant="ghost"
                size="icon"
                onClick={copy}
                aria-label="Copy example entry"
                className="absolute top-1.5 right-1.5 size-7"
              >
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
            <p className="mt-2 text-muted-foreground">
              <code className="text-xs">tier</code> is one of {TIER_IDS.join(", ")}. <code className="text-xs">steamAppId</code>{" "}
              is the number in the Steam store URL. For apps that aren't on Steam, use{" "}
              <code className="text-xs">website</code> instead, and{" "}
              <code className="text-xs">commonsFile</code> for the name of a logo on Wikimedia Commons. Remember the
              comma after the previous entry.
            </p>
          </li>
          <li>
            Open a pull request. CI checks the entry. Once it's merged, CI creates the app's wiki page and downloads its image if you set steamAppId or commonsFile.
          </li>
        </ol>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" asChild>
            <a href={`${REPO}/edit/master/src/data/apps.json`} target="_blank" rel="noopener">
              Edit apps.json on GitHub <ExternalLink />
            </a>
          </Button>
          <Button asChild>
            <a href={`${REPO}/fork`} target="_blank" rel="noopener">
              <GitFork /> Fork on GitHub
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
