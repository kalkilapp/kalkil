#!/usr/bin/env node
/**
 * Pre-renderiza /es/, /pt/, /fr/ como HTML estático real para las 18 páginas donde
 * i18n.js tiene cobertura de traducción completa (home, tools.html, guides.html,
 * about.html, 14 calculadoras). Las 40 guías largas NO se incluyen: el _textMap de
 * i18n.js no cubre los <p> del cuerpo del artículo (solo nav/hero/labels), así que
 * pre-renderizarlas hoy generaría title/h1 en español con el artículo en inglés.
 *
 * Método: carga cada página en jsdom con ?lang=<idioma> en la URL (que es exactamente
 * la señal de mayor prioridad que ya lee i18n.js en detect()), deja correr el propio
 * i18n.js del sitio sin modificarlo, y serializa el DOM resultante. Cero reimplementación
 * de la lógica de traducción — se reusa la misma que corre en producción hoy.
 *
 * Requiere: npm install (jsdom, ver package.json) y haber corrido antes
 * 01-fix-canonicals.sh (usa el canonical en inglés como base para armar el localizado)
 * y 07-patch-i18n-detect.sh (para que las páginas generadas no se "auto-revientan" de
 * vuelta a inglés en el cliente si el usuario tiene localStorage/navigator en inglés).
 *
 * Uso:
 *   npm install
 *   node audit-fixes/07-patch-i18n-detect.sh   (si no corriste este primero)
 *   node audit-fixes/08-generate-i18n-pages.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SITE = 'https://kalkilapp.com';
const LANGS = ['es', 'pt', 'fr'];

const PAGES = [
  'index.html',
  'tools.html',
  'guides.html',
  'about.html',
  ...fs.readdirSync(path.join(ROOT, 'tools'))
    .filter((f) => f.endsWith('.html'))
    .map((f) => `tools/${f}`),
];

const i18nSrc = fs.readFileSync(path.join(ROOT, 'i18n.js'), 'utf8');

function localizedUrl(lang, relPath) {
  if (relPath === 'index.html') return `${SITE}/${lang}/`;
  return `${SITE}/${lang}/${relPath}`;
}
function englishUrl(relPath) {
  if (relPath === 'index.html') return `${SITE}/`;
  return `${SITE}/${relPath}`;
}

function hreflangBlock(relPath) {
  const links = [`  <link rel="alternate" hreflang="en" href="${englishUrl(relPath)}">`];
  for (const lang of LANGS) {
    links.push(`  <link rel="alternate" hreflang="${lang}" href="${localizedUrl(lang, relPath)}">`);
  }
  links.push(`  <link rel="alternate" hreflang="x-default" href="${englishUrl(relPath)}">`);
  return links.join('\n');
}

function rewriteAssetPaths(doc, depth) {
  // depth = niveles de directorio del archivo ORIGINAL (0 para root, 1 para tools/xxx.html)
  // Los archivos generados viven en /<lang>/... (mismo nivel +1), así que los assets
  // compartidos (css/js en la raíz o en tools/) se referencian con path absoluto para no
  // duplicar archivos por idioma.
  doc.querySelectorAll('link[rel="stylesheet"][href]').forEach((el) => {
    const href = el.getAttribute('href');
    if (/^https?:\/\//.test(href)) return;
    const abs = path.posix.normalize(path.posix.join(depth === 0 ? '/' : '/tools/', href));
    el.setAttribute('href', abs);
  });
  doc.querySelectorAll('script[src]').forEach((el) => {
    const src = el.getAttribute('src');
    if (/^https?:\/\//.test(src)) return;
    const abs = path.posix.normalize(path.posix.join(depth === 0 ? '/' : '/tools/', src));
    el.setAttribute('src', abs);
  });
}

function rewriteInternalLinks(doc, translatedSet, depth) {
  // Todo link relativo hay que resolverlo primero contra la ubicación ORIGINAL del
  // archivo (root o tools/) antes de decidir destino — una vez que el archivo generado
  // vive un nivel más profundo bajo /<lang>/, un href relativo como "guides/x.html" ya
  // no resuelve al mismo lugar sin reescribirlo a absoluto.
  const base = depth === 0 ? '/' : '/tools/';
  doc.querySelectorAll('a[href]').forEach((el) => {
    let href = el.getAttribute('href');
    if (!href || /^https?:\/\/|^mailto:|^tel:|^#/.test(href)) return;
    const absSitePath = path.posix.normalize(path.posix.join(base, href)); // ej: "/guides/foo.html"
    const clean = absSitePath.replace(/^\//, ''); // "guides/foo.html"

    if (translatedSet.has(clean)) {
      const lang = doc.documentElement.getAttribute('lang');
      el.setAttribute('href', clean === 'index.html' ? `/${lang}/` : `/${lang}/${clean}`);
    } else {
      // no traducida (ej. guías) — apuntar absoluto a la versión en inglés real,
      // porque el href relativo original ya no resuelve bien desde /<lang>/...
      el.setAttribute('href', absSitePath);
    }
  });
}

async function renderPage(relPath, lang, translatedSet) {
  const abs = path.join(ROOT, relPath);
  const html = fs.readFileSync(abs, 'utf8');
  const depth = relPath.includes('/') ? 1 : 0;
  const url = `${englishUrl(relPath)}?lang=${lang}`;

  // BUG real en i18n.js (ver sección 5 del reporte): apply() hace
  // `document.title = t['meta.title']` sin importar la página — y meta.title solo
  // existe una vez por idioma (el título del HOME). En cualquier página que no sea
  // index.html esto pisa el título correcto con el del home. Hasta que se arregle
  // i18n.js de raíz (título/desc por página, no global), acá se restaura el
  // title/description ORIGINALES en inglés para no publicar metadata falsa.
  const originalTitle = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  const originalDesc = html.match(/<meta name="description" content="([\s\S]*?)"\s*\/?>/i)?.[1];

  const dom = new JSDOM(html, { url, runScripts: 'outside-only' });
  const { window } = dom;

  // localStorage no existe por defecto en jsdom fuera de un contexto de storage real;
  // stub mínimo para que i18n.js no explote al llamar _save()/getItem().
  const store = {};
  window.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = v; },
  };

  window.eval(i18nSrc);
  // el propio i18n.js escucha DOMContentLoaded o corre inline si ya está "complete"
  // (jsdom construye el doc ya completo), así que para runScripts:'outside-only' hay
  // que disparar el evento a mano.
  window.document.dispatchEvent(new window.Event('DOMContentLoaded', { bubbles: true }));

  const doc = window.document;
  rewriteAssetPaths(doc, depth);
  rewriteInternalLinks(doc, translatedSet, depth);

  if (relPath !== 'index.html') {
    if (originalTitle) doc.title = originalTitle;
    const descEl = doc.querySelector('meta[name="description"]');
    if (descEl && originalDesc) descEl.setAttribute('content', originalDesc);
  }

  // canonical propio
  let canonical = doc.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = doc.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    doc.head.appendChild(canonical);
  }
  canonical.setAttribute('href', localizedUrl(lang, relPath));

  // reemplazar/insertar bloque hreflang recíproco
  doc.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  doc.head.insertAdjacentHTML('beforeend', '\n' + hreflangBlock(relPath) + '\n');

  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`;
}

async function main() {
  const translatedSet = new Set(PAGES);
  let count = 0;
  for (const lang of LANGS) {
    for (const relPath of PAGES) {
      const html = await renderPage(relPath, lang, translatedSet);
      const outPath = path.join(ROOT, lang, relPath);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html, 'utf8');
      count++;
    }
  }
  console.log(`Generadas ${count} páginas (${PAGES.length} páginas × ${LANGS.length} idiomas)`);

  // agregar hreflang recíproco también a las 18 páginas en inglés originales
  for (const relPath of PAGES) {
    const abs = path.join(ROOT, relPath);
    let html = fs.readFileSync(abs, 'utf8');
    html = html.replace(/\n?\s*<link rel="alternate" hreflang="[^"]*"[^>]*>\n?/g, '');
    html = html.replace('</head>', `${hreflangBlock(relPath)}\n</head>`);
    fs.writeFileSync(abs, html, 'utf8');
  }
  console.log(`hreflang recíproco agregado a las ${PAGES.length} páginas en inglés originales`);
}

main();
