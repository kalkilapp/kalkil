#!/usr/bin/env node
/**
 * Genera sitemap.xml completo a partir del filesystem real, en vez de mantenerlo a mano.
 * Causa raíz identificada en la sección 1 del audit original: el sitemap manual es la
 * razón más probable de que las URLs legacy se hayan quedado ahí — nadie las sacó porque
 * nadie edita este archivo de forma sistemática. Este script reemplaza esa edición manual.
 *
 * Uso: node audit-fixes/10-generate-sitemap.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SITE = 'https://kalkilapp.com';
const TODAY = new Date().toISOString().slice(0, 10);

const I18N_HUB_PAGES = ['index.html', 'tools.html', 'guides.html', 'about.html']; // nunca se renombran

function urlEntry(loc, priority, changefreq) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const entries = [];

// Home + hub pages
entries.push(urlEntry(`${SITE}/`, '1.0', 'weekly'));
entries.push(urlEntry(`${SITE}/tools.html`, '0.9', 'weekly'));
entries.push(urlEntry(`${SITE}/guides.html`, '0.9', 'weekly'));
entries.push(urlEntry(`${SITE}/about.html`, '0.6', 'monthly'));
entries.push(urlEntry(`${SITE}/privacy.html`, '0.3', 'yearly'));
entries.push(urlEntry(`${SITE}/terms.html`, '0.3', 'yearly'));

// Tools (14)
for (const f of fs.readdirSync(path.join(ROOT, 'tools')).filter((f) => f.endsWith('.html')).sort()) {
  entries.push(urlEntry(`${SITE}/tools/${f}`, '0.8', 'monthly'));
}

// Guides (40)
for (const f of fs.readdirSync(path.join(ROOT, 'guides')).filter((f) => f.endsWith('.html')).sort()) {
  entries.push(urlEntry(`${SITE}/guides/${f}`, '0.7', 'monthly'));
}

// /es /pt /fr — los 4 hubs (home/tools.html/guides.html/about.html, nunca cambian de
// nombre) + las 14 calculadoras + las 40 guías traducidas. Los slugs de /es/guides/ y
// /es/tools/ ya NO coinciden con los del inglés (renombrados a keywords SEO en español)
// — hay que leer el directorio real de cada idioma, no asumir que usan el mismo nombre
// de archivo que el inglés.
for (const lang of ['es', 'pt', 'fr']) {
  for (const rel of I18N_HUB_PAGES) {
    const loc = rel === 'index.html' ? `${SITE}/${lang}/` : `${SITE}/${lang}/${rel}`;
    entries.push(urlEntry(loc, rel === 'index.html' ? '0.9' : '0.6', 'monthly'));
  }
  for (const kind of ['tools', 'guides']) {
    const langDir = path.join(ROOT, lang, kind);
    if (!fs.existsSync(langDir)) continue;
    for (const f of fs.readdirSync(langDir).filter((f) => f.endsWith('.html')).sort()) {
      entries.push(urlEntry(`${SITE}/${lang}/${kind}/${f}`, '0.6', 'monthly'));
    }
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n\n${entries.join('\n\n')}\n\n</urlset>\n`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml generado: ${entries.length} URLs`);
