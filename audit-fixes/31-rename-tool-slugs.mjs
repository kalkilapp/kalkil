#!/usr/bin/env node
/**
 * Versión generalizada de 19-rename-es-tool-slugs.mjs / 29-rename-fr-tool-slugs.mjs
 * — acepta --lang=pt|fr|es. Renombra los 14 archivos de /<lang>/tools/ a slugs SEO
 * nativos (audit-fixes/<lang>-tools-slug-map.json). La carpeta contenedora "tools"
 * NUNCA se renombra (rutas de scripts/CSS compartidos).
 *
 * Misma cascada que 30-rename-guide-slugs.mjs pero para calculadoras: canonical +
 * hreflang + switcher (autorreferencia), las 14 calculadoras en inglés, el botón del
 * switcher en los otros 2 idiomas (por contenido), guide-cta en <lang>/guides/*.html,
 * <lang>/tools.html + <lang>/index.html, y una pasada final de seguridad (donde
 * suelen aparecer cross-links "calculadoras relacionadas" entre las propias
 * calculadoras y en about.html).
 *
 * Uso: node audit-fixes/31-rename-tool-slugs.mjs --lang=pt
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SITE = 'https://kalkilapp.com';
const argLang = process.argv.find((a) => a.startsWith('--lang='));
const LANG = argLang ? argLang.slice(7) : null;
if (!LANG) { console.error('Uso: node 31-rename-tool-slugs.mjs --lang=pt'); process.exit(1); }
const OTHER_LANGS = ['es', 'pt', 'fr'].filter((l) => l !== LANG);
const SLUG_MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', `${LANG}-tools-slug-map.json`), 'utf8'));

// --- 1. Renombrar archivos en <lang>/tools/ + arreglar autorreferencias ---
let renamed = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const oldPath = path.join(ROOT, LANG, 'tools', `${oldSlug}.html`);
  const newPath = path.join(ROOT, LANG, 'tools', `${newSlug}.html`);
  if (!fs.existsSync(oldPath)) { console.log(`[SKIP] no existe ${oldPath}`); continue; }

  let html = fs.readFileSync(oldPath, 'utf8');
  const newUrl = `${SITE}/${LANG}/tools/${newSlug}.html`;
  const oldUrl = `${SITE}/${LANG}/tools/${oldSlug}.html`;
  const newRel = `/${LANG}/tools/${newSlug}.html`;
  const oldRel = `/${LANG}/tools/${oldSlug}.html`;

  html = html.split(oldUrl).join(newUrl);
  html = html.split(oldRel).join(newRel);

  fs.writeFileSync(newPath, html, 'utf8');
  fs.unlinkSync(oldPath);
  renamed++;
}
console.log(`${renamed}/${Object.keys(SLUG_MAP).length} archivos renombrados en ${LANG}/tools/`);

// --- 2. hreflang + switcher en las 14 calculadoras en inglés ---
let enUpdated = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const abs = path.join(ROOT, 'tools', `${oldSlug}.html`);
  if (!fs.existsSync(abs)) continue;
  let html = fs.readFileSync(abs, 'utf8');
  const oldUrl = `${SITE}/${LANG}/tools/${oldSlug}.html`;
  const newUrl = `${SITE}/${LANG}/tools/${newSlug}.html`;
  const oldRel = `/${LANG}/tools/${oldSlug}.html`;
  const newRel = `/${LANG}/tools/${newSlug}.html`;
  if (html.includes(oldUrl) || html.includes(oldRel)) {
    html = html.split(oldUrl).join(newUrl);
    html = html.split(oldRel).join(newRel);
    fs.writeFileSync(abs, html, 'utf8');
    enUpdated++;
  }
}
console.log(`${enUpdated}/14 calculadoras en inglés — hreflang + switcher "${LANG}" actualizado`);

// --- 2b. botón del switcher en los otros 2 idiomas (escaneo por contenido) ---
let otherUpdated = 0;
for (const langDir of OTHER_LANGS) {
  const dir = path.join(ROOT, langDir, 'tools');
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.html'))) {
    const abs = path.join(dir, f);
    let html = fs.readFileSync(abs, 'utf8');
    let changed = false;
    for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
      const oldRel = `/${LANG}/tools/${oldSlug}.html`;
      const newRel = `/${LANG}/tools/${newSlug}.html`;
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

// --- 3. guide-cta en <lang>/guides/*.html ---
let guidesUpdated = 0;
const guidesDir = path.join(ROOT, LANG, 'guides');
if (fs.existsSync(guidesDir)) {
  for (const f of fs.readdirSync(guidesDir).filter((f) => f.endsWith('.html'))) {
    const abs = path.join(guidesDir, f);
    let html = fs.readFileSync(abs, 'utf8');
    let changed = false;
    for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
      const oldHref = `/${LANG}/tools/${oldSlug}.html`;
      const newHref = `/${LANG}/tools/${newSlug}.html`;
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
}
console.log(`${guidesUpdated} guías en ${LANG}/guides/ — link a calculadora actualizado`);

// --- 4. <lang>/tools.html (hub) + <lang>/index.html ---
let hubsUpdated = 0;
for (const relFile of ['tools.html', 'index.html']) {
  const abs = path.join(ROOT, LANG, relFile);
  if (!fs.existsSync(abs)) continue;
  let html = fs.readFileSync(abs, 'utf8');
  let changed = false;
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const oldHrefEn = `href="/tools/${oldSlug}.html"`;
    const newHrefLang = `href="/${LANG}/tools/${newSlug}.html"`;
    const oldHrefLang = `href="/${LANG}/tools/${oldSlug}.html"`;
    if (html.includes(oldHrefEn)) { html = html.split(oldHrefEn).join(newHrefLang); changed = true; }
    if (html.includes(oldHrefLang)) { html = html.split(oldHrefLang).join(newHrefLang); changed = true; }
  }
  if (changed) {
    fs.writeFileSync(abs, html, 'utf8');
    hubsUpdated++;
    console.log(`[OK] ${LANG}/${relFile} — links a calculadoras corregidos`);
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
      const oldHref = `/${LANG}/tools/${oldSlug}.html`;
      const newHref = `/${LANG}/tools/${newSlug}.html`;
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
