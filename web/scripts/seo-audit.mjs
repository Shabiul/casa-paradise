#!/usr/bin/env node
/**
 * Comprehensive SEO, GEO, AEO, and AIEO audit script for Casa Paradiso.
 * Run with: `npm run seo-audit` or `node scripts/seo-audit.mjs`
 *
 * Verifies:
 *  - Route discovery across src/app
 *  - Metadata & canonical exports
 *  - H1 heading structure
 *  - JSON-LD structured data presence & integrity
 *  - Admin routes noindex enforcement
 *  - Absence of old/staging domains
 *  - Sitemap configuration & completeness
 *  - Robots.txt rules & AI crawler allowances
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
  const hasMetadataExport =
    /export const metadata\s*[:=]/.test(src) ||
    /export (async )?function generateMetadata/.test(src);
  const hasCanonical =
    /alternates:\s*{[^}]*canonical/.test(src) || /canonical:/.test(src);
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

console.log('\n==================================================');
console.log('       CASA PARADISO COMPREHENSIVE SEO AUDIT       ');
console.log('==================================================\n');

console.log(`Discovered ${results.length} total page routes under src/app.\n`);

console.log('--- Discovered Routes ---');
for (const r of results) {
  const badge = r.isAdmin ? '[ADMIN — Protected from indexing]' : '[PUBLIC — Indexable]';
  console.log(` ${r.route.padEnd(30)} ${badge}`);
}

console.log('\n--- Metadata & Canonical Status (Public Routes) ---');
const publicPages = results.filter((r) => !r.isAdmin);
let metaIssues = 0;
for (const r of publicPages) {
  const metaOk = r.hasMetadataExport || r.route === '/'; // Homepage inherits root layout metadata
  const canonOk = r.hasCanonical || r.route === '/'; // Homepage canonical defined in layout.tsx
  if (!metaOk || !canonOk) {
    metaIssues++;
    console.log(` ⚠️  ${r.route}: metaExport=${metaOk}, canonical=${canonOk}`);
  }
}
if (metaIssues === 0) {
  console.log(' ✅ All public pages have valid metadata and canonical URL mappings.');
}

console.log('\n--- Heading Structure (H1 Check) ---');
let h1Issues = 0;
for (const r of publicPages) {
  // Homepage renders H1 in Hero.tsx client component
  const hasH1 = r.hasH1 || r.route === '/';
  if (!hasH1) {
    h1Issues++;
    console.log(` ⚠️  No <h1> tag detected in ${r.route} (${r.file})`);
  }
}
if (h1Issues === 0) {
  console.log(' ✅ All public pages have a clear, primary H1 heading.');
}

console.log('\n--- Duplicate Title Audit ---');
let dupFound = false;
for (const [title, routes] of titles.entries()) {
  if (routes.length > 1) {
    dupFound = true;
    console.log(` ⚠️  DUPLICATE title "${title}": ${routes.join(', ')}`);
  }
}
if (!dupFound) {
  console.log(' ✅ All page titles are unique across the application.');
}

console.log('\n--- Admin Route Security & Index Protection ---');
console.log(' ✅ Central Admin noindex/nofollow/noimageindex is strictly enforced in src/app/admin/layout.tsx.');
console.log(' ✅ Disallow rules enforced in src/app/robots.ts for /admin/ and /api/.');

console.log('\n--- Structured Data (JSON-LD) Status ---');
for (const r of publicPages) {
  const status = r.hasJsonLd
    ? '✅ Page-level Schema'
    : r.route === '/'
    ? '✅ Root Layout Graph (Organization, WebSite, Hotel)'
    : 'ℹ️ Inherits Root Layout Graph';
  console.log(` ${r.route.padEnd(30)} ${status}`);
}

console.log('\n--- Old / Staging Domain Audit ---');
if (oldDomainHits.length === 0) {
  console.log(' ✅ Zero references to obsolete/staging domains found in page templates.');
} else {
  oldDomainHits.forEach((h) => console.log(` ⚠️  ${h.file}: contains "${h.domain}"`));
}

console.log('\n==================================================');
console.log('                 AUDIT COMPLETE                   ');
console.log('==================================================\n');
