# rosemarydb

A list of apps that run on the rosemary compatibility layer, with a rating tier for each one. Built with Astro, React, Tailwind CSS v4 and shadcn/ui.

## Development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run check    # type-check
npm run deploy   # build and deploy to Cloudflare Workers (needs CLOUDFLARE_API_TOKEN)
```

The site is served as static assets from a Cloudflare Worker named `rosemarydb`, configured in `wrangler.jsonc`.

## Adding an app

Entries live in `src/data/apps.json`. Each entry looks like this:

```json
{
  "id": "roblox",
  "name": "Roblox",
  "description": "Online game platform for playing games made by other users.",
  "image": "/images/roblox.png",
  "tier": "silver"
}
```

`steamAppId` and `website` are optional. `steamAppId` is the number in the app's Steam store URL (`store.steampowered.com/app/<steamAppId>/`); `website` is a full URL, for apps that aren't on Steam or that mainly distribute from their own site. Both are linked from the app's wiki page.

`id` must be unique. `image` is optional: put the file in `public/images/` and reference it as `/images/<file>`, or use a full URL. If an entry has a `steamAppId` and no `image`, `npm run images` downloads the app's Steam header image to `public/images/<id>.jpg` and fills in `image`; CI runs it on every push. For apps that aren't on Steam, set `commonsFile` to the name of a file on Wikimedia Commons (for example `"Firefox logo, 2019.svg"`, without the `File:` prefix); `npm run images` downloads it, centers it on a tile at `public/images/<id>.svg`, fills in `image` and adds the file's author and license to `public/images/CREDITS.md`. Cards without an image show the app's initial on a background tinted by its tier.

`tier` must be one of `platinum`, `gold`, `silver`, `bronze` or `borked`. The build fails if an entry has an unknown tier or is missing a required field. Tier labels, descriptions and colors are defined in `src/lib/tiers.ts`.

## Wiki pages

Every app has a wiki page at `/apps/<id>`, written in `src/content/wiki/<id>.mdx`. A page has two optional frontmatter fields, `developer` and `builtWith`, shown at the top, and two sections, "Known tweaks" and "Known bugs", for anything testers have found.

`npm run wiki` validates `apps.json` and creates a page from a template for every entry that doesn't have one. `npm run wiki:check` runs the same validation but fails instead of creating pages.

CI (`.github/workflows/ci.yml`) runs `npm run images` (Steam and Commons), `npm run wiki` and a build on every pull request and every push to `master`. On `master` it commits any new wiki pages and images back to the branch, so adding an entry to `apps.json` is enough to get its page and, with `steamAppId` or `commonsFile`, its image.
