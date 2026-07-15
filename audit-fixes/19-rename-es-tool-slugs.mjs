#!/usr/bin/env node
/**
 * Mismo proceso que 18-rename-es-guide-slugs.mjs pero para /es/tools/ — la carpeta
 * contenedora se llama igual (tools) para no romper rutas de scripts/CSS compartidos
 * (calc-style.css, currency.js), solo se renombran los 14 archivos .html internos.
 *
 * Cascada que actualiza:
 *   1. El propio archivo renombrado: canonical, hreflang "es", switcher "ES".
 *   2. Las 14 calculadoras en INGLÉS: hreflang "es" + switcher "ES" → nuevo slug.
 *   3. Botón "ES" del switcher en pt/tools/ y fr/tools/ (14×2 = 28 archivos).
 *   4. Los "guide-cta" en es/guides/*.html que linkean a la calculadora relacionada
 *      (38 de las 40 guías tienen uno).
 *   5. es/tools.html (el hub/listado) — ya apuntaba a /es/tools/, solo cambian los slugs.
 *
 * Uso: node audit-fixes/19-rename-es-tool-slugs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SITE = 'https://kalkilapp.com';
const SLUG_MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', 'es-tools-slug-map.json'), 'utf8'));

// --- 1. Renombrar archivos en es/tools/ + arreglar autorreferencias ---
let renamed = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const oldPath = path.join(ROOT, 'es', 'tools', `${oldSlug}.html`);
  const newPath = path.join(ROOT, 'es', 'tools', `${newSlug}.html`);
  if (!fs.existsSync(oldPath)) { console.log(`[SKIP] no existe ${oldPath}`); continue; }

  let html = fs.readFileSync(oldPath, 'utf8');
  const newUrl = `${SITE}/es/tools/${newSlug}.html`;
  const oldUrl = `${SITE}/es/tools/${oldSlug}.html`;
  const newRel = `/es/tools/${newSlug}.html`;
  const oldRel = `/es/tools/${oldSlug}.html`;

  html = html.split(oldUrl).join(newUrl); // canonical + hreflang "es" (URL completa)
  html = html.split(oldRel).join(newRel); // switcher "ES" (path relativo)

  fs.writeFileSync(newPath, html, 'utf8');
  fs.unlinkSync(oldPath);
  renamed++;
}
console.log(`${renamed}/${Object.keys(SLUG_MAP).length} archivos renombrados en es/tools/`);

// --- 2. hreflang "es" + switcher "ES" en las 14 calculadoras en inglés ---
let enUpdated = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const abs = path.join(ROOT, 'tools', `${oldSlug}.html`);
  if (!fs.existsSync(abs)) continue;
  let html = fs.readFileSync(abs, 'utf8');
  const oldEsUrl = `${SITE}/es/tools/${oldSlug}.html`;
  const newEsUrl = `${SITE}/es/tools/${newSlug}.html`;
  const oldEsRel = `/es/tools/${oldSlug}.html`;
  const newEsRel = `/es/tools/${newSlug}.html`;
  if (html.includes(oldEsUrl) || html.includes(oldEsRel)) {
    html = html.split(oldEsUrl).join(newEsUrl);
    html = html.split(oldEsRel).join(newEsRel);
    fs.writeFileSync(abs, html, 'utf8');
    enUpdated++;
  }
}
console.log(`${enUpdated}/14 calculadoras en inglés — hreflang + switcher "es" actualizado`);

// --- 3. botón "ES" del switcher en pt/tools/ y fr/tools/ ---
let ptFrUpdated = 0;
for (const langDir of ['pt', 'fr']) {
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const abs = path.join(ROOT, langDir, 'tools', `${oldSlug}.html`);
    if (!fs.existsSync(abs)) continue;
    let html = fs.readFileSync(abs, 'utf8');
    const oldEsRel = `/es/tools/${oldSlug}.html`;
    const newEsRel = `/es/tools/${newSlug}.html`;
    if (html.includes(oldEsRel)) {
      html = html.split(oldEsRel).join(newEsRel);
      fs.writeFileSync(abs, html, 'utf8');
      ptFrUpdated++;
    }
  }
}
console.log(`${ptFrUpdated} archivos pt/fr — botón ES del switcher actualizado`);

// --- 4. guide-cta en es/guides/*.html (link a la calculadora relacionada) ---
let guidesUpdated = 0;
for (const f of fs.readdirSync(path.join(ROOT, 'es', 'guides')).filter((f) => f.endsWith('.html'))) {
  const abs = path.join(ROOT, 'es', 'guides', f);
  let html = fs.readFileSync(abs, 'utf8');
  let changed = false;
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const oldHref = `/es/tools/${oldSlug}.html`;
    const newHref = `/es/tools/${newSlug}.html`;
    if (html.includes(oldHref)) {
      html = html.split(oldHref).join(newHref);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(abs, html, 'utf8');
    guidesUpdated++;
  }
}
console.log(`${guidesUpdated} guías en es/guides/ — link a calculadora actualizado`);

// --- 5. es/tools.html (hub) ---
let hubUpdated = 0;
const hubPath = path.join(ROOT, 'es', 'tools.html');
if (fs.existsSync(hubPath)) {
  let html = fs.readFileSync(hubPath, 'utf8');
  let changed = false;
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const oldHref = `/es/tools/${oldSlug}.html`;
    const newHref = `/es/tools/${newSlug}.html`;
    if (html.includes(oldHref)) {
      html = html.split(oldHref).join(newHref);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(hubPath, html, 'utf8');
    hubUpdated = 1;
    console.log('[OK] es/tools.html — links a calculadoras actualizados');
  }
}
console.log(`${hubUpdated} hub actualizado`);

// --- 6. es/index.html también puede tener links directos a tools ---
let indexUpdated = 0;
const indexPath = path.join(ROOT, 'es', 'index.html');
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  let changed = false;
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const oldHref = `/es/tools/${oldSlug}.html`;
    const newHref = `/es/tools/${newSlug}.html`;
    if (html.includes(oldHref)) {
      html = html.split(oldHref).join(newHref);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(indexPath, html, 'utf8');
    indexUpdated = 1;
    console.log('[OK] es/index.html — links a calculadoras actualizados');
  }
}
console.log(`${indexUpdated} home actualizado`);

// --- 7. pasada final de seguridad: recorre TODO /es/ (about.html, y cross-links
// tool-a-tool dentro de las propias calculadoras — "calculadoras relacionadas" — que
// los pasos anteriores no cubrían por enumerar archivos específicos a mano) ---
let sweepCount = 0;
function walkAndFix(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) { walkAndFix(full); continue; }
    if (!f.endsWith('.html')) continue;
    let html = fs.readFileSync(full, 'utf8');
    let changed = false;
    for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
      const oldHref = `/es/tools/${oldSlug}.html`;
      const newHref = `/es/tools/${newSlug}.html`;
      if (html.includes(oldHref)) {
        html = html.split(oldHref).join(newHref);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(full, html, 'utf8');
      sweepCount++;
      console.log(`[SWEEP] ${path.relative(ROOT, full)}`);
    }
  }
}
walkAndFix(path.join(ROOT, 'es'));
console.log(`\n${sweepCount} archivos adicionales corregidos en la pasada final`);
