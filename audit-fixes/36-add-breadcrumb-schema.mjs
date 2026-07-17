#!/usr/bin/env node
/**
 * Agrega structured data BreadcrumbList (schema.org) a las 216 páginas de
 * guías/calculadoras (14 tools + 40 guides × 4 idiomas) — hoy 0% de cobertura en
 * todo el sitio, confirmado con grep. El sitio ya muestra una migaja de pan visual
 * ("Inicio › Herramientas › Calculadora de CPM de YouTube") en 176 de las 216 — este
 * script hace que el schema coincida EXACTO con lo que el usuario ve ahí, tal como
 * exige Google, en vez de inventar textos nuevos.
 *
 * Las 40 restantes (10 guías × 4 idiomas) usan una plantilla más vieja sin ese
 * elemento visual — confirmado revisando el HTML, no es un bug de esta sesión, ya
 * eran así. Para esas se arma el mismo BreadcrumbList igual (la jerarquía Home →
 * Guides → esta guía es real y coincide con la URL), usando el <h1> como nombre del
 * último nivel en vez del texto de un breadcrumb que no existe.
 *
 * Los nombres de "Inicio" y "Herramientas/Guías" salen del propio <nav> de cada
 * página (100% presente siempre, a diferencia del breadcrumb) — así se evita
 * inventar traducciones: el nav de una página en francés ya dice "Accueil"/"Outils",
 * eso es lo que se usa.
 *
 * Uso: node audit-fixes/36-add-breadcrumb-schema.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SITE = 'https://kalkilapp.com';
const LANG_TOOL_DIRS = ['tools', 'es/tools', 'pt/tools', 'fr/tools'];
const LANG_GUIDE_DIRS = ['guides', 'es/guides', 'pt/guides', 'fr/guides'];
const MARKER = 'kalkil-schema-breadcrumb';

function homeUrl(lang) {
  return lang === 'en' ? `${SITE}/` : `${SITE}/${lang}/`;
}
function sectionUrl(lang, kind) {
  return lang === 'en' ? `${SITE}/${kind}.html` : `${SITE}/${lang}/${kind}.html`;
}

function process(rel, kind) {
  const abs = path.join(ROOT, rel);
  const html = fs.readFileSync(abs, 'utf8');
  if (html.includes(MARKER)) return 'already';

  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const lang = doc.documentElement.getAttribute('lang') || 'en';
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (!canonical) return 'no-canonical';

  // .brand/.nav-brand (el logo "Kalkil") comparte el mismo href que el link "Home" del
  // nav — sin excluirlo, querySelector agarra el logo primero porque aparece antes en
  // el DOM (mismo bug ya visto y corregido en 12/15-assemble-*-translations.mjs)
  const isBrand = (el) => el.classList.contains('brand') || el.classList.contains('nav-brand');
  const homeLink = Array.from(doc.querySelectorAll(
    'nav a[href*="index.html"], nav a[href="/"], nav a[href^="/es/"][href$="/"], nav a[href^="/pt/"][href$="/"], nav a[href^="/fr/"][href$="/"]'
  )).find((el) => !isBrand(el));
  const sectionLink = doc.querySelector(`nav a[href*="${kind}.html"]`);
  const homeName = homeLink ? homeLink.textContent.trim() : 'Home';
  const sectionName = sectionLink ? sectionLink.textContent.trim() : (kind === 'tools' ? 'Tools' : 'Guides');

  let currentName;
  const breadcrumb = doc.querySelector('.breadcrumb');
  if (breadcrumb) {
    // el nombre de la página actual es el último nodo de texto del breadcrumb (no un <a>)
    const textNodes = Array.from(breadcrumb.childNodes).filter((n) => n.nodeType === 3 && n.textContent.trim());
    currentName = textNodes.length ? textNodes[textNodes.length - 1].textContent.trim() : null;
  }
  if (!currentName) {
    currentName = doc.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim();
  }
  if (!currentName) return 'no-name';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeName, item: homeUrl(lang) },
      { '@type': 'ListItem', position: 2, name: sectionName, item: sectionUrl(lang, kind) },
      { '@type': 'ListItem', position: 3, name: currentName, item: canonical },
    ],
  };

  const scriptTag = `  <script type="application/ld+json" data-${MARKER}>\n${JSON.stringify(schema, null, 2)}\n  </script>\n`;
  const headCloseIdx = html.indexOf('</head>');
  if (headCloseIdx === -1) return 'no-head';
  const out = html.slice(0, headCloseIdx) + scriptTag + html.slice(headCloseIdx);
  fs.writeFileSync(abs, out, 'utf8');
  return 'added';
}

const results = { added: 0, already: 0, skipped: 0 };
for (const [dirs, kind] of [[LANG_TOOL_DIRS, 'tools'], [LANG_GUIDE_DIRS, 'guides']]) {
  for (const dir of dirs) {
    for (const f of fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.html'))) {
      const rel = path.join(dir, f);
      const r = process(rel, kind);
      if (r === 'added') results.added++;
      else if (r === 'already') results.already++;
      else { results.skipped++; console.log(`[WARN] ${rel}: ${r}`); }
    }
  }
}

console.log(`\n${results.added} páginas con BreadcrumbList agregado`);
console.log(`${results.already} ya lo tenían`);
console.log(`${results.skipped} saltadas por falta de datos`);
