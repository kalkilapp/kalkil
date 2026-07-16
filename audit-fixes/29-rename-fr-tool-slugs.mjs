#!/usr/bin/env node
/**
 * Mismo proceso que 19-rename-es-tool-slugs.mjs (ES) y 27-rename-fr-guide-slugs.mjs
 * (guías FR), esta vez para /fr/tools/ — la carpeta contenedora se llama igual
 * (tools) para no romper rutas de scripts/CSS compartidos, solo se renombran los 14
 * archivos .html internos a slugs SEO en francés (audit-fixes/fr-tools-slug-map.json).
 *
 * Cascada que actualiza:
 *   1. El propio archivo renombrado: canonical, hreflang "fr", switcher "FR".
 *   2. Las 14 calculadoras en INGLÉS: hreflang "fr" + switcher "FR" → nuevo slug.
 *   3. Botón "FR" del switcher en es/tools/ y pt/tools/ (14×2 = 28 archivos,
 *      escaneado por CONTENIDO — mismo motivo que en 27: los de es/ ya tienen slugs
 *      propios, buscar por nombre de archivo viejo nunca los encuentra).
 *   4. Los "guide-cta" en fr/guides/*.html que linkean a la calculadora relacionada.
 *   5. fr/tools.html (el hub) y fr/index.html — mismo bug encontrado en las rondas
 *      anteriores: podían apuntar a la versión en inglés en vez de a /fr/tools/.
 *   6. sitemap.xml regenerado.
 *   7. Pasada final de seguridad sobre TODO /fr/.
 *
 * Uso: node audit-fixes/29-rename-fr-tool-slugs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SITE = 'https://kalkilapp.com';
const SLUG_MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', 'fr-tools-slug-map.json'), 'utf8'));

// --- 1. Renombrar archivos en fr/tools/ + arreglar autorreferencias ---
let renamed = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const oldPath = path.join(ROOT, 'fr', 'tools', `${oldSlug}.html`);
  const newPath = path.join(ROOT, 'fr', 'tools', `${newSlug}.html`);
  if (!fs.existsSync(oldPath)) { console.log(`[SKIP] no existe ${oldPath}`); continue; }

  let html = fs.readFileSync(oldPath, 'utf8');
  const newUrl = `${SITE}/fr/tools/${newSlug}.html`;
  const oldUrl = `${SITE}/fr/tools/${oldSlug}.html`;
  const newRel = `/fr/tools/${newSlug}.html`;
  const oldRel = `/fr/tools/${oldSlug}.html`;

  html = html.split(oldUrl).join(newUrl); // canonical + hreflang "fr" (URL completa)
  html = html.split(oldRel).join(newRel); // switcher "FR" (path relativo)

  fs.writeFileSync(newPath, html, 'utf8');
  fs.unlinkSync(oldPath);
  renamed++;
}
console.log(`${renamed}/${Object.keys(SLUG_MAP).length} archivos renombrados en fr/tools/`);

// --- 2. hreflang "fr" + switcher "FR" en las 14 calculadoras en inglés ---
let enUpdated = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const abs = path.join(ROOT, 'tools', `${oldSlug}.html`);
  if (!fs.existsSync(abs)) continue;
  let html = fs.readFileSync(abs, 'utf8');
  const oldFrUrl = `${SITE}/fr/tools/${oldSlug}.html`;
  const newFrUrl = `${SITE}/fr/tools/${newSlug}.html`;
  const oldFrRel = `/fr/tools/${oldSlug}.html`;
  const newFrRel = `/fr/tools/${newSlug}.html`;
  if (html.includes(oldFrUrl) || html.includes(oldFrRel)) {
    html = html.split(oldFrUrl).join(newFrUrl);
    html = html.split(oldFrRel).join(newFrRel);
    fs.writeFileSync(abs, html, 'utf8');
    enUpdated++;
  }
}
console.log(`${enUpdated}/14 calculadoras en inglés — hreflang + switcher "fr" actualizado`);

// --- 2b. botón "FR" del switcher en es/tools/ y pt/tools/ (escaneo por contenido) ---
let esPtUpdated = 0;
for (const langDir of ['es', 'pt']) {
  const dir = path.join(ROOT, langDir, 'tools');
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.html'))) {
    const abs = path.join(dir, f);
    let html = fs.readFileSync(abs, 'utf8');
    let changed = false;
    for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
      const oldFrRel = `/fr/tools/${oldSlug}.html`;
      const newFrRel = `/fr/tools/${newSlug}.html`;
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

// --- 3. guide-cta en fr/guides/*.html (link a la calculadora relacionada) ---
let guidesUpdated = 0;
for (const f of fs.readdirSync(path.join(ROOT, 'fr', 'guides')).filter((f) => f.endsWith('.html'))) {
  const abs = path.join(ROOT, 'fr', 'guides', f);
  let html = fs.readFileSync(abs, 'utf8');
  let changed = false;
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const oldHref = `/fr/tools/${oldSlug}.html`;
    const newHref = `/fr/tools/${newSlug}.html`;
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
console.log(`${guidesUpdated} guías en fr/guides/ — link a calculadora actualizado`);

// --- 4. fr/tools.html (hub) + fr/index.html: podían apuntar a /tools/<slug-en>.html
// en vez de /fr/tools/<slug-nuevo>.html ---
let hubsUpdated = 0;
for (const relFile of ['tools.html', 'index.html']) {
  const abs = path.join(ROOT, 'fr', relFile);
  if (!fs.existsSync(abs)) continue;
  let html = fs.readFileSync(abs, 'utf8');
  let changed = false;
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const oldHrefEn = `href="/tools/${oldSlug}.html"`;
    const newHrefFr = `href="/fr/tools/${newSlug}.html"`;
    const oldHrefFr = `href="/fr/tools/${oldSlug}.html"`;
    if (html.includes(oldHrefEn)) { html = html.split(oldHrefEn).join(newHrefFr); changed = true; }
    if (html.includes(oldHrefFr)) { html = html.split(oldHrefFr).join(newHrefFr); changed = true; }
  }
  if (changed) {
    fs.writeFileSync(abs, html, 'utf8');
    hubsUpdated++;
    console.log(`[OK] fr/${relFile} — links a calculadoras corregidos`);
  }
}
console.log(`${hubsUpdated} hubs actualizados`);

// --- 5. pasada final de seguridad sobre TODO /fr/ ---
let sweepCount = 0;
function walkAndFix(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) { walkAndFix(full); continue; }
    if (!f.endsWith('.html')) continue;
    let html = fs.readFileSync(full, 'utf8');
    let changed = false;
    for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
      const oldHref = `/fr/tools/${oldSlug}.html`;
      const newHref = `/fr/tools/${newSlug}.html`;
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
