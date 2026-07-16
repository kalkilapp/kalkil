#!/usr/bin/env node
/**
 * Versión generalizada de 18-rename-es-guide-slugs.mjs / 27-rename-fr-guide-slugs.mjs
 * — acepta --lang=pt|fr|es para no seguir duplicando el mismo script por idioma.
 * Renombra los 40 archivos de /<lang>/guides/ a slugs SEO nativos
 * (audit-fixes/<lang>-slug-map.json).
 *
 * Cascada que actualiza:
 *   1. El propio archivo renombrado: canonical, hreflang, switcher (autorreferencia).
 *   2. Las 40 guías en INGLÉS: hreflang + botón del switcher → nuevo slug.
 *   3. Botón del switcher en los OTROS 2 idiomas traducidos (escaneado por
 *      CONTENIDO, no por nombre de archivo — los que ya fueron renombrados en una
 *      ronda anterior no matchean por nombre de archivo).
 *   4. Los "guide-cta" en <lang>/tools/*.html que linkean a la guía relacionada.
 *   5. <lang>/index.html y <lang>/guides.html — bug recurrente: podían apuntar a
 *      /guides/<slug-ingles>.html en vez de /<lang>/guides/<slug-nuevo>.html.
 *   6. Pasada final de seguridad sobre TODO /<lang>/.
 *
 * <lang>/guides.html (el hub) NUNCA se renombra — solo se corrigen sus links.
 *
 * Uso: node audit-fixes/30-rename-guide-slugs.mjs --lang=pt
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SITE = 'https://kalkilapp.com';
const argLang = process.argv.find((a) => a.startsWith('--lang='));
const LANG = argLang ? argLang.slice(7) : null;
if (!LANG) { console.error('Uso: node 30-rename-guide-slugs.mjs --lang=pt'); process.exit(1); }
const OTHER_LANGS = ['es', 'pt', 'fr'].filter((l) => l !== LANG);
const SLUG_MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', `${LANG}-slug-map.json`), 'utf8'));

// --- 1. Renombrar archivos en <lang>/guides/ + arreglar autorreferencias ---
let renamed = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const oldPath = path.join(ROOT, LANG, 'guides', `${oldSlug}.html`);
  const newPath = path.join(ROOT, LANG, 'guides', `${newSlug}.html`);
  if (!fs.existsSync(oldPath)) { console.log(`[SKIP] no existe ${oldPath}`); continue; }

  let html = fs.readFileSync(oldPath, 'utf8');
  const newUrl = `${SITE}/${LANG}/guides/${newSlug}.html`;
  const oldUrl = `${SITE}/${LANG}/guides/${oldSlug}.html`;
  const newRel = `/${LANG}/guides/${newSlug}.html`;
  const oldRel = `/${LANG}/guides/${oldSlug}.html`;

  html = html.split(oldUrl).join(newUrl);
  html = html.split(oldRel).join(newRel);

  fs.writeFileSync(newPath, html, 'utf8');
  fs.unlinkSync(oldPath);
  renamed++;
}
console.log(`${renamed}/${Object.keys(SLUG_MAP).length} archivos renombrados en ${LANG}/guides/`);

// --- 2. hreflang + switcher en las 40 guías en inglés ---
let enUpdated = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const abs = path.join(ROOT, 'guides', `${oldSlug}.html`);
  if (!fs.existsSync(abs)) continue;
  let html = fs.readFileSync(abs, 'utf8');
  const oldUrl = `${SITE}/${LANG}/guides/${oldSlug}.html`;
  const newUrl = `${SITE}/${LANG}/guides/${newSlug}.html`;
  const oldRel = `/${LANG}/guides/${oldSlug}.html`;
  const newRel = `/${LANG}/guides/${newSlug}.html`;
  if (html.includes(oldUrl) || html.includes(oldRel)) {
    html = html.split(oldUrl).join(newUrl);
    html = html.split(oldRel).join(newRel);
    fs.writeFileSync(abs, html, 'utf8');
    enUpdated++;
  }
}
console.log(`${enUpdated}/40 guías en inglés — hreflang + switcher "${LANG}" actualizado`);

// --- 2b. botón del switcher en los otros 2 idiomas traducidos (escaneo por contenido) ---
let otherUpdated = 0;
for (const langDir of OTHER_LANGS) {
  const dir = path.join(ROOT, langDir, 'guides');
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.html'))) {
    const abs = path.join(dir, f);
    let html = fs.readFileSync(abs, 'utf8');
    let changed = false;
    for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
      const oldRel = `/${LANG}/guides/${oldSlug}.html`;
      const newRel = `/${LANG}/guides/${newSlug}.html`;
      if (html.includes(oldRel)) {
        html = html.split(oldRel).join(newRel);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(abs, html, 'utf8');
      otherUpdated++;
    }
  }
}
console.log(`${otherUpdated} archivos ${OTHER_LANGS.join('/')} — botón del switcher actualizado`);

// --- 3. guide-cta en <lang>/tools/*.html ---
let toolsUpdated = 0;
const toolsDir = path.join(ROOT, LANG, 'tools');
if (fs.existsSync(toolsDir)) {
  for (const f of fs.readdirSync(toolsDir).filter((f) => f.endsWith('.html'))) {
    const abs = path.join(toolsDir, f);
    let html = fs.readFileSync(abs, 'utf8');
    let changed = false;
    for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
      const oldHref = `/${LANG}/guides/${oldSlug}.html`;
      const newHref = `/${LANG}/guides/${newSlug}.html`;
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
}
console.log(`${toolsUpdated} calculadoras en ${LANG}/tools/ — link a guía actualizado`);

// --- 4. <lang>/index.html + <lang>/guides.html ---
let hubsUpdated = 0;
for (const relFile of ['index.html', 'guides.html']) {
  const abs = path.join(ROOT, LANG, relFile);
  if (!fs.existsSync(abs)) continue;
  let html = fs.readFileSync(abs, 'utf8');
  let changed = false;
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const oldHrefEn = `href="/guides/${oldSlug}.html"`;
    const newHrefLang = `href="/${LANG}/guides/${newSlug}.html"`;
    const oldHrefLang = `href="/${LANG}/guides/${oldSlug}.html"`;
    if (html.includes(oldHrefEn)) { html = html.split(oldHrefEn).join(newHrefLang); changed = true; }
    if (html.includes(oldHrefLang)) { html = html.split(oldHrefLang).join(newHrefLang); changed = true; }
  }
  if (changed) {
    fs.writeFileSync(abs, html, 'utf8');
    hubsUpdated++;
    console.log(`[OK] ${LANG}/${relFile} — links a guías corregidos`);
  }
}
console.log(`${hubsUpdated} hubs actualizados`);

// --- 5. pasada final de seguridad sobre TODO /<lang>/ ---
let sweepCount = 0;
function walkAndFix(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) { walkAndFix(full); continue; }
    if (!f.endsWith('.html')) continue;
    let html = fs.readFileSync(full, 'utf8');
    let changed = false;
    for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
      const oldHref = `/${LANG}/guides/${oldSlug}.html`;
      const newHref = `/${LANG}/guides/${newSlug}.html`;
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
walkAndFix(path.join(ROOT, LANG));
console.log(`\n${sweepCount} archivos adicionales corregidos en la pasada final`);
