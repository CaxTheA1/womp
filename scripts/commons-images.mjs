#!/usr/bin/env node
// For every entry in src/data/apps.json that has a commonsFile but no image,
// downloads that file from Wikimedia Commons, centers it on a 460x215 tile
// (the Steam header size the cards are laid out for), saves the tile to
// public/images/<id>.svg, sets "image" on the entry and credits the file in
// public/images/CREDITS.md.
//
//   node scripts/commons-images.mjs

import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const appsPath = join(root, "src/data/apps.json");
const creditsPath = join(root, "public/images/CREDITS.md");
const API = "https://commons.wikimedia.org/w/api.php";
// Wikimedia asks API clients to identify themselves.
const headers = { "User-Agent": "rosemarydb-ci/1.0 (https://github.com/frolleks/rosemarydb)" };

let apps;
try {
  apps = JSON.parse(readFileSync(appsPath, "utf8"));
  if (!Array.isArray(apps)) throw new Error("top level must be an array");
} catch {
  // scripts/wiki.mjs reports the parse error with details.
  console.log("Skipping Commons images: src/data/apps.json does not parse.");
  process.exit(0);
}

const pending = apps.filter(
  (app) =>
    !app?.image &&
    typeof app?.commonsFile === "string" &&
    app.commonsFile.trim() !== "" &&
    typeof app.id === "string" &&
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(app.id), // scripts/wiki.mjs reports bad ids
);
if (!pending.length) {
  console.log("No Commons images to add.");
  process.exit(0);
}

const errors = [];
const added = [];
const credits = [];

const title = (app) => `File:${app.commonsFile.replace(/^File:/, "").replaceAll("_", " ")}`;

// One request covers up to 50 files.
const info = new Map();
for (let i = 0; i < pending.length; i += 50) {
  const batch = pending.slice(i, i + 50);
  const params = new URLSearchParams({
    action: "query",
    titles: batch.map(title).join("|"),
    prop: "imageinfo",
    iiprop: "url|extmetadata",
    iiurlwidth: "300",
    format: "json",
    formatversion: "2",
  });
  let data;
  try {
    data = await (await fetchWithRetry(`${API}?${params}`)).json();
  } catch (err) {
    fail([`could not reach the Wikimedia Commons API (${err.message})`]);
  }
  // The API normalizes titles (for example the first letter's case).
  const normalized = new Map((data.query.normalized ?? []).map((n) => [n.from, n.to]));
  const pages = new Map(data.query.pages.map((p) => [p.title, p]));
  for (const app of batch) {
    const t = title(app);
    info.set(app.id, pages.get(normalized.get(t) ?? t));
  }
}

for (const app of pending) {
  const page = info.get(app.id);
  const ii = page?.imageinfo?.[0];
  if (!ii) {
    errors.push(`${app.id}: Wikimedia Commons has no file named "${app.commonsFile}"`);
    continue;
  }
  let png;
  try {
    png = Buffer.from(await (await fetchWithRetry(ii.thumburl)).arrayBuffer());
  } catch (err) {
    errors.push(`${app.id}: downloading ${page.title} failed (${err.message})`);
    continue;
  }

  const file = `images/${app.id}.svg`;
  writeFileSync(join(root, "public", file), tile(png));
  app.image = `/${file}`;

  const meta = ii.extmetadata ?? {};
  const artist = stripTags(meta.Artist?.value) || "unknown author";
  const license = stripTags(meta.LicenseShortName?.value) || "see file page";
  credits.push(`\`${app.id}.svg\` uses [${page.title}](${ii.descriptionurl}) by ${artist}, ${license}, from Wikimedia Commons.`);
  added.push(`Added /${file} for ${app.name} from ${page.title} (${license})`);
}

if (added.length) {
  writeFileSync(appsPath, JSON.stringify(apps, null, 2) + "\n");
  appendFileSync(creditsPath, credits.map((c) => `\n${c}\n`).join(""));
}

for (const line of added) console.log(line);
report(added, errors);
if (errors.length) fail(errors);

/** 460x215 tile with the image centered at 150px on a dark background. */
function tile(png) {
  const src = `data:image/png;base64,${png.toString("base64")}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="215" viewBox="0 0 460 215">
  <rect width="460" height="215" fill="#27272a"/>
  <image href="${src}" x="155" y="32.5" width="150" height="150" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;
}

function stripTags(html) {
  return (html ?? "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

/** Retries on HTTP 429 and 5xx, waiting as long as Retry-After asks. */
async function fetchWithRetry(url, attempts = 6) {
  for (let i = 1; ; i++) {
    const res = await fetch(url, { headers });
    if (res.ok) return res;
    if (i >= attempts || !(res.status === 429 || res.status >= 500)) throw new Error(`HTTP ${res.status}`);
    const wait = Number(res.headers.get("retry-after")) || 10 * i;
    console.log(`HTTP ${res.status} from ${new URL(url).host}, retrying in ${wait}s`);
    await new Promise((r) => setTimeout(r, wait * 1000));
  }
}

function report(added, errors) {
  if (!process.env.GITHUB_STEP_SUMMARY || !(added.length || errors.length)) return;
  const lines = [...added, ...errors.map((e) => `Error: ${e}`)].map((l) => `- ${l}`);
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, ["Commons images:", ...lines].join("\n") + "\n");
}

function fail(lines) {
  for (const line of lines) console.error(`error: ${line}`);
  process.exit(1);
}
