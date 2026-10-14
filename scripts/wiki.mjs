#!/usr/bin/env node
// Validates src/data/apps.json and makes sure every app has a wiki page in
// src/content/wiki/<id>.mdx. Missing pages are created from a template.
//
//   node scripts/wiki.mjs           validate and create missing pages
//   node scripts/wiki.mjs --check   validate and fail if any page is missing

import { appendFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const appsPath = join(root, "src/data/apps.json");
const wikiDir = join(root, "src/content/wiki");
const check = process.argv.includes("--check");

const errors = [];
const summary = [];

const tierSource = readFileSync(join(root, "src/lib/tiers.ts"), "utf8");
const tiers = [...tierSource.match(/TIER_IDS = \[([^\]]+)\]/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

let apps = [];
try {
  apps = JSON.parse(readFileSync(appsPath, "utf8"));
  if (!Array.isArray(apps)) throw new Error("top level must be an array");
} catch (err) {
  fail([`src/data/apps.json is not valid JSON: ${err.message}`]);
}

const seen = new Set();
apps.forEach((app, i) => {
  const at = `entry ${i + 1}${typeof app?.id === "string" ? ` ("${app.id}")` : ""}`;
  for (const field of ["id", "name", "description", "tier"]) {
    if (typeof app?.[field] !== "string" || app[field].trim() === "") errors.push(`${at}: "${field}" is missing or empty`);
  }
  if (typeof app?.id === "string") {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(app.id)) {
      errors.push(`${at}: "id" may only contain lowercase letters, digits and single hyphens`);
    }
    if (seen.has(app.id)) errors.push(`${at}: duplicate id`);
    seen.add(app.id);
  }
  if (typeof app?.tier === "string" && !tiers.includes(app.tier)) {
    errors.push(`${at}: unknown tier "${app.tier}" (expected one of ${tiers.join(", ")})`);
  }
  if (app?.steamAppId !== undefined && !(Number.isInteger(app.steamAppId) && app.steamAppId > 0)) {
    errors.push(`${at}: "steamAppId" must be a positive whole number`);
  }
  if (app?.website !== undefined && !(typeof app.website === "string" && /^https?:\/\/\S+$/.test(app.website))) {
    errors.push(`${at}: "website" must be a full http(s) URL`);
  }
  if (app?.commonsFile !== undefined && !(typeof app.commonsFile === "string" && app.commonsFile.trim() !== "")) {
    errors.push(`${at}: "commonsFile" must be a file name such as "Firefox logo, 2019.svg"`);
  }
  if (typeof app?.image === "string" && app.image.startsWith("/") && !existsSync(join(root, "public", app.image))) {
    errors.push(`${at}: image ${app.image} does not exist in public/`);
  }
});
if (errors.length) fail(errors);

const pages = new Set(
  readdirSync(wikiDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.slice(0, -4)),
);
for (const page of pages) {
  if (!seen.has(page)) errors.push(`src/content/wiki/${page}.mdx has no matching entry in apps.json`);
}

const missing = apps.filter((app) => !pages.has(app.id));
if (check) {
  for (const app of missing) errors.push(`${app.id}: no wiki page (run npm run wiki to create one)`);
} else {
  for (const app of missing) {
    writeFileSync(join(wikiDir, `${app.id}.mdx`), template(app));
    summary.push(`Created src/content/wiki/${app.id}.mdx for ${app.name}`);
  }
}
if (errors.length) fail(errors);

console.log(`${apps.length} apps OK.`);
for (const line of summary) console.log(line);
report([`${apps.length} apps passed validation.`, ...summary.map((s) => `- ${s}`)]);

function template(app) {
  return `---
# Optional facts shown at the top of the page:
# developer: ""
# builtWith: ""
---

{/* Wiki page for ${app.name}. List each tweak or bug as a bullet. */}

## Known tweaks

No tweaks documented yet.

## Known bugs

No bugs documented yet.
`;
}

function fail(lines) {
  for (const line of lines) console.error(`error: ${line}`);
  report(["Validation failed:", ...lines.map((l) => `- ${l}`)]);
  process.exit(1);
}

function report(lines) {
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
}
