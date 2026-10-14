#!/usr/bin/env node
// For every entry in src/data/apps.json that has a steamAppId but no image,
// downloads the app's Steam header image to public/images/<id>.jpg and sets
// "image" on the entry.
//
//   node scripts/steam-images.mjs

import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const appsPath = join(root, "src/data/apps.json");

let apps;
try {
  apps = JSON.parse(readFileSync(appsPath, "utf8"));
  if (!Array.isArray(apps)) throw new Error("top level must be an array");
} catch {
  // scripts/wiki.mjs reports the parse error with details.
  console.log("Skipping Steam images: src/data/apps.json does not parse.");
  process.exit(0);
}

const errors = [];
const added = [];

for (const app of apps) {
  if (app?.image || !Number.isInteger(app?.steamAppId) || app.steamAppId <= 0 || typeof app.id !== "string") continue;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(app.id)) continue; // scripts/wiki.mjs reports bad ids

  const file = `images/${app.id}.jpg`;
  if (!existsSync(join(root, "public", file))) {
    let details;
    try {
      const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${app.steamAppId}&filters=basic`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      details = (await res.json())[app.steamAppId];
    } catch (err) {
      errors.push(`${app.id}: could not reach the Steam store API (${err.message})`);
      continue;
    }
    if (!details?.success || !details.data?.header_image) {
      errors.push(`${app.id}: Steam has no app with id ${app.steamAppId}`);
      continue;
    }
    const img = await fetch(details.data.header_image);
    if (!img.ok) {
      errors.push(`${app.id}: header image download failed (HTTP ${img.status})`);
      continue;
    }
    writeFileSync(join(root, "public", file), Buffer.from(await img.arrayBuffer()));
  }
  app.image = `/${file}`;
  added.push(`Added /${file} for ${app.name} (Steam app ${app.steamAppId})`);
}

if (added.length) writeFileSync(appsPath, JSON.stringify(apps, null, 2) + "\n");

for (const line of added) console.log(line);
for (const line of errors) console.error(`error: ${line}`);
if (!added.length && !errors.length) console.log("No Steam images to add.");

if (process.env.GITHUB_STEP_SUMMARY && (added.length || errors.length)) {
  const lines = [...added, ...errors.map((e) => `Error: ${e}`)].map((l) => `- ${l}`);
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, ["Steam images:", ...lines].join("\n") + "\n");
}
if (errors.length) process.exit(1);
