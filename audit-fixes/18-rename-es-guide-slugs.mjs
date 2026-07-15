#!/usr/bin/env node
/**
 * Renombra los 40 archivos de /es/guides/ a slugs SEO en español (audit-fixes/es-slug-map.json),
 * y actualiza todo lo que depende del nombre viejo:
 *
 *   1. El propio archivo renombrado: canonical, hreflang "es" (autorreferencia),
 *      switcher "ES" (autorreferencia) → nueva URL.
 *   2. Las 40 guías en INGLÉS: su hreflang "es" apuntaba a la URL vieja, se actualiza
 *      a la nueva.
 *   3. Las 14 calculadoras en /es/tools/: el link "guide-cta" a la guía relacionada
 *      apuntaba al slug viejo, se actualiza.
 *   4. es/index.html y es/guides.html: BUG previo encontrado de paso — estos hubs ya
 *      traducidos linkeaban a /guides/<slug-ingles>.html (las guías en inglés) en vez
 *      de /es/guides/<slug-nuevo>.html (las guías en español que ya existen). Se
 *      corrige en la misma pasada, no tiene sentido arreglar el slug sin arreglar
 *      también que el hub apunte a la versión correcta.
 *
 * NO toca pt/ ni fr/ — eso queda para una pasada posterior si se decide aplicar el
 * mismo criterio ahí.
 *
 * Uso: node audit-fixes/18-rename-es-guide-slugs.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SITE = 'https://kalkilapp.com';
const SLUG_MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', 'es-slug-map.json'), 'utf8'));

// --- 1. Renombrar archivos en es/guides/ + arreglar autorreferencias ---
let renamed = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const oldPath = path.join(ROOT, 'es', 'guides', `${oldSlug}.html`);
  const newPath = path.join(ROOT, 'es', 'guides', `${newSlug}.html`);
  if (!fs.existsSync(oldPath)) { console.log(`[SKIP] no existe ${oldPath}`); continue; }

  let html = fs.readFileSync(oldPath, 'utf8');
  const newUrl = `${SITE}/es/guides/${newSlug}.html`;
  const oldUrl = `${SITE}/es/guides/${oldSlug}.html`;
  const newRel = `/es/guides/${newSlug}.html`;
  const oldRel = `/es/guides/${oldSlug}.html`;

  html = html.split(oldUrl).join(newUrl); // canonical + hreflang "es" (URL completa con dominio)
  html = html.split(oldRel).join(newRel); // switcher "ES" (path relativo, sin dominio — se
  // perdía antes: el reemplazo por URL completa no matcheaba href="/es/guides/...")

  fs.writeFileSync(newPath, html, 'utf8');
  fs.unlinkSync(oldPath);
  renamed++;
}
console.log(`${renamed}/${Object.keys(SLUG_MAP).length} archivos renombrados en es/guides/`);

// --- 2. hreflang "es" + switcher "ES" en las 40 guías en inglés ---
// el switcher del inglés también tiene un botón ES con el slug viejo (path relativo,
// no solo la URL completa del hreflang) — mismo tipo de bug que en el paso 1
let enUpdated = 0;
for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
  const abs = path.join(ROOT, 'guides', `${oldSlug}.html`);
  if (!fs.existsSync(abs)) continue;
  let html = fs.readFileSync(abs, 'utf8');
  const oldEsUrl = `${SITE}/es/guides/${oldSlug}.html`;
  const newEsUrl = `${SITE}/es/guides/${newSlug}.html`;
  const oldEsRel = `/es/guides/${oldSlug}.html`;
  const newEsRel = `/es/guides/${newSlug}.html`;
  if (html.includes(oldEsUrl) || html.includes(oldEsRel)) {
    html = html.split(oldEsUrl).join(newEsUrl);
    html = html.split(oldEsRel).join(newEsRel);
    fs.writeFileSync(abs, html, 'utf8');
    enUpdated++;
  }
}
console.log(`${enUpdated}/40 guías en inglés — hreflang + switcher "es" actualizado`);

// --- 2b. botón "ES" del switcher en pt/guides/ y fr/guides/ (mismo slug viejo, no
// se renombran en esta pasada pero su switcher SÍ apunta a la versión en español) ---
let ptFrUpdated = 0;
for (const langDir of ['pt', 'fr']) {
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const abs = path.join(ROOT, langDir, 'guides', `${oldSlug}.html`);
    if (!fs.existsSync(abs)) continue;
    let html = fs.readFileSync(abs, 'utf8');
    const oldEsRel = `/es/guides/${oldSlug}.html`;
    const newEsRel = `/es/guides/${newSlug}.html`;
    if (html.includes(oldEsRel)) {
      html = html.split(oldEsRel).join(newEsRel);
      fs.writeFileSync(abs, html, 'utf8');
      ptFrUpdated++;
    }
  }
}
console.log(`${ptFrUpdated} archivos pt/fr — botón ES del switcher actualizado`);

// --- 3. guide-cta en es/tools/*.html ---
let toolsUpdated = 0;
for (const f of fs.readdirSync(path.join(ROOT, 'es', 'tools')).filter((f) => f.endsWith('.html'))) {
  const abs = path.join(ROOT, 'es', 'tools', f);
  let html = fs.readFileSync(abs, 'utf8');
  let changed = false;
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const oldHref = `/es/guides/${oldSlug}.html`;
    const newHref = `/es/guides/${newSlug}.html`;
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
console.log(`${toolsUpdated} calculadoras en es/tools/ — link a guía actualizado`);

// --- 4. es/index.html + es/guides.html: apuntaban a /guides/<slug-ingles>.html, deben
// apuntar a /es/guides/<slug-nuevo>.html ---
let hubsUpdated = 0;
for (const relFile of ['index.html', 'guides.html']) {
  const abs = path.join(ROOT, 'es', relFile);
  if (!fs.existsSync(abs)) continue;
  let html = fs.readFileSync(abs, 'utf8');
  let changed = false;
  for (const [oldSlug, newSlug] of Object.entries(SLUG_MAP)) {
    const oldHref = `href="/guides/${oldSlug}.html"`;
    const newHref = `href="/es/guides/${newSlug}.html"`;
    if (html.includes(oldHref)) {
      html = html.split(oldHref).join(newHref);
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(abs, html, 'utf8');
    hubsUpdated++;
    console.log(`[OK] ${relFile} — links a guías corregidos (apuntan a /es/guides/ ahora)`);
  }
}
console.log(`${hubsUpdated} hubs actualizados`);
