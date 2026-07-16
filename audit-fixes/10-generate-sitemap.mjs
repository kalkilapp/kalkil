#!/usr/bin/env node
/**
 * Genera sitemap.xml completo a partir del filesystem real, en vez de mantenerlo a
 * mano. Además de listar cada URL, ahora declara las anotaciones internacionales
 * <xhtml:link rel="alternate" hreflang="..."> dentro de cada <url> — el estándar que
 * pide Google para sitios multi-idioma (alternativa a poner hreflang solo en
 * <head>, útil como señal redundante/complementaria y recomendado cuando el sitio
 * tiene muchas variantes de idioma por página).
 * https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap
 *
 * Reglas de Google que este script respeta:
 *   - Cada variante de idioma de una página debe listar TODAS las variantes,
 *     incluyéndose a sí misma (auto-referencia) — el bloque debe ser simétrico.
 *   - Todas las URLs (<loc> y <xhtml:link href>) van absolutas con dominio completo.
 *   - x-default apunta a la versión en inglés (mismo criterio que ya usan las
 *     etiquetas <link rel="alternate"> en el <head> de cada página individual).
 *   - Solo se anota hreflang entre páginas que REALMENTE tienen las 4 versiones
 *     (home, hubs, tools, guides). privacy.html/terms.html no tienen traducción —
 *     se listan sin bloque de alternates, no tiene sentido inventar una relación
 *     que no existe.
 *
 * Nota sobre el código de idioma: se usa "pt" (no "pt-BR") porque es el que ya está
 * desplegado en las etiquetas <link rel="alternate" hreflang="pt"> del <head> de las
 * ~160 páginas en portugués — Google requiere que las señales de hreflang sean
 * CONSISTENTES entre el sitemap y la página; si no coinciden, Google puede ignorar
 * la anotación por completo. Cambiar a "pt-BR" sería más preciso (el contenido es
 * específicamente de Brasil) pero implicaría re-etiquetar esas ~160 páginas primero
 * — una tarea aparte, no incluida en este cambio.
 *
 * Uso: node audit-fixes/10-generate-sitemap.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SITE = 'https://kalkilapp.com';
const TODAY = new Date().toISOString().slice(0, 10);
const XHTML_NS = 'http://www.w3.org/1999/xhtml';

const LANGS = ['en', 'es', 'fr', 'pt'];
const SLUG_MAPS = {
  guides: {
    es: JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', 'es-slug-map.json'), 'utf8')),
    fr: JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', 'fr-slug-map.json'), 'utf8')),
    pt: JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', 'pt-slug-map.json'), 'utf8')),
  },
  tools: {
    es: JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', 'es-tools-slug-map.json'), 'utf8')),
    fr: JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', 'fr-tools-slug-map.json'), 'utf8')),
    pt: JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', 'pt-tools-slug-map.json'), 'utf8')),
  },
};

// { en: 'https://.../x', es: 'https://.../y', fr: '...', pt: '...' }
function buildVariants(kind, enSlug) {
  if (kind === 'home') {
    return { en: `${SITE}/`, es: `${SITE}/es/`, fr: `${SITE}/fr/`, pt: `${SITE}/pt/` };
  }
  if (kind === 'hub') {
    return Object.fromEntries(LANGS.map((l) => [l, l === 'en' ? `${SITE}/${enSlug}` : `${SITE}/${l}/${enSlug}`]));
  }
  // 'tools' | 'guides'
  const variants = { en: `${SITE}/${kind}/${enSlug}.html` };
  for (const l of ['es', 'fr', 'pt']) {
    const localSlug = SLUG_MAPS[kind][l][enSlug] || enSlug;
    variants[l] = `${SITE}/${l}/${kind}/${localSlug}.html`;
  }
  return variants;
}

function urlEntry(loc, priority, changefreq, variants) {
  let alternates = '';
  if (variants) {
    const links = LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${variants[l]}"/>`);
    links.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${variants.en}"/>`);
    alternates = `\n${links.join('\n')}`;
  }
  return `  <url>\n    <loc>${loc}</loc>${alternates}\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const entries = [];

// --- Home ---
{
  const variants = buildVariants('home');
  for (const l of LANGS) entries.push(urlEntry(variants[l], '1.0', 'weekly', variants));
}

// --- Hubs: tools.html, guides.html, about.html (nunca se renombran) ---
for (const enSlug of ['tools.html', 'guides.html', 'about.html']) {
  const variants = buildVariants('hub', enSlug);
  const priority = enSlug === 'about.html' ? '0.6' : '0.9';
  for (const l of LANGS) entries.push(urlEntry(variants[l], priority, 'monthly', variants));
}

// --- privacy.html / terms.html: sin versiones traducidas, sin bloque de alternates ---
entries.push(urlEntry(`${SITE}/privacy.html`, '0.3', 'yearly', null));
entries.push(urlEntry(`${SITE}/terms.html`, '0.3', 'yearly', null));

// --- Tools (14 en inglés, cada uno con sus 3 variantes traducidas) ---
for (const f of fs.readdirSync(path.join(ROOT, 'tools')).filter((f) => f.endsWith('.html')).sort()) {
  const enSlug = f.replace('.html', '');
  const variants = buildVariants('tools', enSlug);
  for (const l of LANGS) entries.push(urlEntry(variants[l], '0.8', 'monthly', variants));
}

// --- Guides (40 en inglés, cada uno con sus 3 variantes traducidas) ---
for (const f of fs.readdirSync(path.join(ROOT, 'guides')).filter((f) => f.endsWith('.html')).sort()) {
  const enSlug = f.replace('.html', '');
  const variants = buildVariants('guides', enSlug);
  for (const l of LANGS) entries.push(urlEntry(variants[l], '0.7', 'monthly', variants));
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="${XHTML_NS}">\n\n${entries.join('\n\n')}\n\n</urlset>\n`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml generado: ${entries.length} URLs (con anotaciones hreflang simétricas)`);
