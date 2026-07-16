#!/usr/bin/env node
/**
 * Mismo proceso que 18-rename-es-guide-slugs.mjs pero para /fr/guides/ — 40 archivos
 * renombrados a slugs SEO en francés (audit-fixes/fr-slug-map.json).
 *
 * Cascada que actualiza:
 *   1. El propio archivo renombrado: canonical, hreflang "fr", switcher "FR"
 *      (autorreferencia, path relativo).
 *   2. Las 40 guías en INGLÉS: hreflang "fr" + botón "FR" del switcher → nuevo slug.
 *   3. Botón "FR" del switcher en es/guides/ y pt/guides/ (40×2 = 80 archivos).
 *   4. Los "guide-cta" en fr/tools/*.html que linkean a la guía relacionada.
 *   5. fr/index.html y fr/guides.html — mismo bug que se encontró en la ronda ES:
 *      linkeaban a /guides/<slug-ingles>.html en vez de /fr/guides/<slug-nuevo>.html.
 *   6. Pasada final de seguridad sobre TODO /fr/ (about.html no se enumera a mano —
 *      lección de 19-rename-es-tool-slugs.mjs, mejor barrer todo el árbol una vez más).
 *
 * fr/guides.html (el hub) NO se renombra — solo se corrigen sus links internos, tal
 * como pidió el usuario explícitamente para este idioma.
 *
 * Uso: node audit-fixes/27-rename-fr-guide-slugs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SITE = 'https://kalkilapp.com';
const SLUG_MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', 'fr-slug-map.json'), 'utf8'));

// --- 1. Renombrar archivos en fr/guides/ + arreglar autorreferencias + <html lang> ---
let renamed = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const oldPath = path.join(ROOT, 'fr', 'guides', `${oldSlug}.html`);
  const newPath = path.join(ROOT, 'fr', 'guides', `${newSlug}.html`);
  if (!fs.existsSync(oldPath)) { console.log(`[SKIP] no existe ${oldPath}`); continue; }

  let html = fs.readFileSync(oldPath, 'utf8');
  const newUrl = `${SITE}/fr/guides/${newSlug}.html`;
  const oldUrl = `${SITE}/fr/guides/${oldSlug}.html`;
  const newRel = `/fr/guides/${newSlug}.html`;
  const oldRel = `/fr/guides/${oldSlug}.html`;

  html = html.split(oldUrl).join(newUrl); // canonical + hreflang "fr" (URL completa)
  html = html.split(oldRel).join(newRel); // switcher "FR" (path relativo)

  fs.writeFileSync(newPath, html, 'utf8');
  fs.unlinkSync(oldPath);
  renamed++;
}
console.log(`${renamed}/${Object.keys(SLUG_MAP).length} archivos renombrados en fr/guides/`);

// --- 2. hreflang "fr" + switcher "FR" en las 40 guías en inglés ---
let enUpdated = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const abs = path.join(ROOT, 'guides', `${oldSlug}.html`);
  if (!fs.existsSync(abs)) continue;
  let html = fs.readFileSync(abs, 'utf8');
  const oldFrUrl = `${SITE}/fr/guides/${oldSlug}.html`;
  const newFrUrl = `${SITE}/fr/guides/${newSlug}.html`;
  const oldFrRel = `/fr/guides/${oldSlug}.html`;
  const newFrRel = `/fr/guides/${newSlug}.html`;
  if (html.includes(oldFrUrl) || html.includes(oldFrRel)) {
    html = html.split(oldFrUrl).join(newFrUrl);
    html = html.split(oldFrRel).join(newFrRel);
    fs.writeFileSync(abs, html, 'utf8');
    enUpdated++;
  }
}
console.log(`${enUpdated}/40 guías en inglés — hreflang + switcher "fr" actualizado`);

// --- 2b. botón "FR" del switcher en es/guides/ y pt/guides/ — se escanea por
// CONTENIDO, no por nombre de archivo: los de es/ ya están renombrados a slugs en
// español (ronda anterior), así que buscar "${oldSlug}.html" como nombre de archivo
// nunca los encuentra. pt/ todavía usa el nombre en inglés, pero el mismo escaneo por
// contenido funciona para los dos sin distinguir casos. ---
let esPtUpdated = 0;
for (const langDir of ['es', 'pt']) {
  const dir = path.join(ROOT, langDir, 'guides');
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.html'))) {
    const abs = path.join(dir, f);
    let html = fs.readFileSync(abs, 'utf8');
    let changed = false;
    for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
      const oldFrRel = `/fr/guides/${oldSlug}.html`;
      const newFrRel = `/fr/guides/${newSlug}.html`;
      if (html.includes(oldFrRel)) {
        html = html.split(oldFrRel).join(newFrRel);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(abs, html, 'utf8');
      esPtUpdated++;
    }
  }
}
console.log(`${esPtUpdated} archivos es/pt — botón FR del switcher actualizado`);

// --- 3. guide-cta en fr/tools/*.html ---
let toolsUpdated = 0;
for (const f of fs.readdirSync(path.join(ROOT, 'fr', 'tools')).filter((f) => f.endsWith('.html'))) {
  const abs = path.join(ROOT, 'fr', 'tools', f);
  let html = fs.readFileSync(abs, 'utf8');
  let changed = false;
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const oldHref = `/fr/guides/${oldSlug}.html`;
    const newHref = `/fr/guides/${newSlug}.html`;
    if (html.includes(oldHref)) {
      html = html.split(oldHref).join(newHref);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(abs, html, 'utf8');
    toolsUpdated++;
  }
}
console.log(`${toolsUpdated} calculadoras en fr/tools/ — link a guía actualizado`);

// --- 4. fr/index.html + fr/guides.html: apuntaban a /guides/<slug-ingles>.html ---
let hubsUpdated = 0;
for (const relFile of ['index.html', 'guides.html']) {
  const abs = path.join(ROOT, 'fr', relFile);
  if (!fs.existsSync(abs)) continue;
  let html = fs.readFileSync(abs, 'utf8');
  let changed = false;
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const oldHref = `href="/guides/${oldSlug}.html"`;
    const newHref = `href="/fr/guides/${newSlug}.html"`;
    if (html.includes(oldHref)) {
      html = html.split(oldHref).join(newHref);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(abs, html, 'utf8');
    hubsUpdated++;
    console.log(`[OK] fr/${relFile} — links a guías corregidos (apuntan a /fr/guides/ ahora)`);
  }
}
console.log(`${hubsUpdated} hubs actualizados`);

// --- 5. pasada final de seguridad sobre TODO /fr/ (about.html, cross-links que los
// pasos anteriores no cubrían por enumerar archivos específicos a mano) ---
let sweepCount = 0;
function walkAndFix(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) { walkAndFix(full); continue; }
    if (!f.endsWith('.html')) continue;
    let html = fs.readFileSync(full, 'utf8');
    let changed = false;
    for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
      const oldHref = `/fr/guides/${oldSlug}.html`;
      const newHref = `/fr/guides/${newSlug}.html`;
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
walkAndFix(path.join(ROOT, 'fr'));
console.log(`\n${sweepCount} archivos adicionales corregidos en la pasada final`);
