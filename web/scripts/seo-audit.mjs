#!/usr/bin/env node
/**
 * Lightweight, dependency-free SEO audit for the Casa Paradiso Next.js App
 * Router site. Run with: `node scripts/seo-audit.mjs`
 *
 * It statically scans src/app for page.tsx files and reports:
 *  - routes discovered
 *  - pages missing a `metadata`/`generateMetadata` export
 *  - pages missing `alternates.canonical`
 *  - pages missing an <h1>
 *  - duplicate <title> values across pages
 *  - presence of JSON-LD (<script type="application/ld+json">)
 *  - any leftover references to old/staging domains
 *
 * This is a heuristic text scan, not a full crawler — it does not execute
 * React or resolve dynamic values. Treat findings as a starting checklist,
 * not a certified audit.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.join(__dirname, '..', 'src', 'app');
const OLD_DOMAINS = ['casaparadisohotel.in', 'localhost:3000', 'vercel.app', 'staging.'];

/** @type {{file: string, route: string}[]} */
const pageFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
    } else if (entry === 'page.tsx' || entry === 'page.ts') {
      const rel = path.relative(APP_DIR, dir).split(path.sep).filter(Boolean);
      const route = '/' + rel.join('/');
      pageFiles.push({ file: full, route: route === '/' ? '/' : route });
    }
  }
}

walk(APP_DIR);

const isAdminRoute = (route) => route.startsWith('/admin');

const results = [];
const titles = new Map();
let oldDomainHits = [];

for (const { file, route } of pageFiles) {
  const src = readFileSync(file, 'utf8');
  const hasMetadataExport = /export const metadata\s*[:=]/.test(src) || /export (async )?function generateMetadata/.test(src);
  const hasCanonical = /alternates:\s*{[^}]*canonical/.test(src) || /canonical:/.test(src);
  const hasH1 = /<h1[\s>]/.test(src);
  const hasJsonLd = /application\/ld\+json/.test(src);
  const titleMatch = src.match(/title:\s*(?:`([^`]+)`|'([^']+)'|"([^"]+)")/);
  const title = titleMatch ? (titleMatch[1] || titleMatch[2] || titleMatch[3]) : null;
  const robotsNoindex = /index:\s*false/.test(src);

  for (const domain of OLD_DOMAINS) {
    if (src.includes(domain)) {
      oldDomainHits.push({ file: path.relative(process.cwd(), file), domain });
    }
  }

  if (title) {
    const existing = titles.get(title) || [];
    existing.push(route);
    titles.set(title, existing);
  }

  results.push({
    route,
    file: path.relative(process.cwd(), file),
    isAdmin: isAdminRoute(route),
    hasMetadataExport,
    hasCanonical,
    hasH1,
    hasJsonLd,
    title,
    robotsNoindex,
  });
}

console.log('\n=== Casa Paradiso SEO Audit ===\n');
console.log(`Discovered ${results.length} page routes under src/app.\n`);

console.log('--- Routes ---');
for (const r of results) {
  console.log(`${r.route.padEnd(28)} ${r.isAdmin ? '[ADMIN — should be noindex]' : ''}`);
}

console.log('\n--- Missing metadata export (public pages only) ---');
const missingMeta = results.filter((r) => !r.isAdmin && !r.hasMetadataExport);
missingMeta.forEach((r) => console.log(`MISSING metadata: ${r.route} (${r.file})`));
if (missingMeta.length === 0) console.log('None — all public pages export metadata.');

console.log('\n--- Missing canonical (public pages only) ---');
const missingCanonical = results.filter((r) => !r.isAdmin && r.hasMetadataExport && !r.hasCanonical);
missingCanonical.forEach((r) => console.log(`MISSING canonical: ${r.route} (${r.file})`));
if (missingCanonical.length === 0) console.log('None.');

console.log('\n--- Missing <h1> (public pages only, heuristic — may miss H1s rendered by imported components) ---');
const missingH1 = results.filter((r) => !r.isAdmin && !r.hasH1);
missingH1.forEach((r) => console.log(`No literal <h1> found in: ${r.route} (${r.file})`));

console.log('\n--- Duplicate titles ---');
let dupFound = false;
for (const [title, routes] of titles.entries()) {
  if (routes.length > 1) {
    dupFound = true;
    console.log(`DUPLICATE title "${title}": ${routes.join(', ')}`);
  }
}
if (!dupFound) console.log('None.');

console.log('\n--- Admin routes without noindex ---');
const adminNotNoindexed = results.filter((r) => r.isAdmin && !r.robotsNoindex);
// Admin pages inherit noindex from src/app/admin/layout.tsx; flag only if a
// page.tsx overrides metadata locally without index:false.
adminNotNoindexed.forEach((r) => {
  if (r.hasMetadataExport) console.log(`CHECK: ${r.route} exports its own metadata — verify it does not override the inherited noindex.`);
});
console.log('(Admin noindex is enforced centrally in src/app/admin/layout.tsx.)');

console.log('\n--- JSON-LD presence ---');
results.filter((r) => !r.isAdmin).forEach((r) => {
  console.log(`${r.route.padEnd(28)} JSON-LD: ${r.hasJsonLd ? 'yes (page-level)' : 'no page-level block (may inherit root layout Hotel/Organization/WebSite graph)'}`);
});

console.log('\n--- Old/staging domain references ---');
if (oldDomainHits.length === 0) {
  console.log('None found.');
} else {
  oldDomainHits.forEach((h) => console.log(`${h.file}: contains "${h.domain}"`));
}

console.log('\nDone.\n');
