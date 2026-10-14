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

`id` must be unique. `image` is optional: put the file in `public/images/` and reference it as `/images/<file>`, or use a full URL. Cards without an image show the app's initial on a background tinted by its tier.

`tier` must be one of `platinum`, `gold`, `silver`, `bronze` or `borked`. The build fails if an entry has an unknown tier or is missing a required field. Tier labels, descriptions and colors are defined in `src/lib/tiers.ts`.
