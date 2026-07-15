#!/usr/bin/env node
/**
 * El usuario encontró que el <footer> de las 14 calculadoras y las 40 guías
 * individuales (en es/pt/fr) sigue en inglés — un footer distinto al de las 4
 * páginas hub (que ya se arregló en rondas anteriores). Nunca se tradujo porque
 * 12/15-assemble-*-translations.mjs no tocan el footer (solo nav/switcher/contenido
 * del body vía textMap).
 *
 * Dos formatos de footer distintos:
 *  - tools/*.html: <div class="footer-links"> con 6 links (Home/Calculators/Guides/
 *    About/Privacy/Terms) + tagline "Free Creator Economy Calculators & Guides".
 *  - guides/*.html: footer simple, solo tagline "Free Creator Economy Calculators"
 *    + Privacy/Terms.
 *
 * privacy.html/terms.html NO tienen versión traducida (decisión ya tomada en
 * 23-fix-hub-switcher.mjs) — el link sigue apuntando a la página en inglés, pero el
 * TEXTO del link se traduce igual, como hace cualquier sitio multi-idioma.
 *
 * Uso: node audit-fixes/25-fix-individual-page-footers.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const LANGS = ['es', 'pt', 'fr'];

const NAV = {
  es: { home: 'Inicio', calculators: 'Calculadoras', guides: 'Guías', about: 'Sobre Nosotros', privacy: 'Privacidad', terms: 'Términos' },
  pt: { home: 'Início', calculators: 'Calculadoras', guides: 'Guias', about: 'Sobre', privacy: 'Privacidade', terms: 'Termos' },
  fr: { home: 'Accueil', calculators: 'Calculateurs', guides: 'Guides', about: 'À propos', privacy: 'Confidentialité', terms: 'Conditions' },
};

const TAGLINE_TOOLS = {
  es: 'Calculadoras y Guías Gratuitas de la Economía Creator',
  pt: 'Calculadoras e Guias Gratuitos da Economia Creator',
  fr: 'Calculateurs et Guides Gratuits de l’Économie Créative',
};

const TAGLINE_GUIDES = {
  es: 'Calculadoras Gratuitas de la Economía Creator',
  pt: 'Calculadoras Gratuitas da Economia Creator',
  fr: 'Calculateurs Gratuits de l’Économie Créative',
};

function fixToolsFooter(html, lang) {
  const nav = NAV[lang];
  const oldBlock = `<div class="footer-links">
    <a href="/${lang}/">Home</a>
    <a href="/${lang}/tools.html">Calculators</a>
    <a href="/${lang}/guides.html">Guides</a>
    <a href="/${lang}/about.html">About</a>
  <a href="/privacy.html">Privacy</a>
    <a href="/terms.html">Terms</a>
  </div>`;
  const newBlock = `<div class="footer-links">
    <a href="/${lang}/">${nav.home}</a>
    <a href="/${lang}/tools.html">${nav.calculators}</a>
    <a href="/${lang}/guides.html">${nav.guides}</a>
    <a href="/${lang}/about.html">${nav.about}</a>
  <a href="/privacy.html">${nav.privacy}</a>
    <a href="/terms.html">${nav.terms}</a>
  </div>`;
  let out = html.split(oldBlock).join(newBlock);
  out = out.split('Free Creator Economy Calculators &amp; Guides').join(TAGLINE_TOOLS[lang]);
  return out;
}

function fixGuidesFooter(html, lang) {
  const nav = NAV[lang];
  let out = html.split('Free Creator Economy Calculators</p>').join(`${TAGLINE_GUIDES[lang]}</p>`);
  out = out.split('<a href="/privacy.html">Privacy</a>').join(`<a href="/privacy.html">${nav.privacy}</a>`);
  out = out.split('<a href="/terms.html">Terms</a>').join(`<a href="/terms.html">${nav.terms}</a>`);
  return out;
}

let toolsFixed = 0;
let guidesFixed = 0;

for (const lang of LANGS) {
  const toolsDir = path.join(ROOT, lang, 'tools');
  if (fs.existsSync(toolsDir)) {
    for (const f of fs.readdirSync(toolsDir).filter((f) => f.endsWith('.html'))) {
      const abs = path.join(toolsDir, f);
      const html = fs.readFileSync(abs, 'utf8');
      const fixed = fixToolsFooter(html, lang);
      if (fixed !== html) {
        fs.writeFileSync(abs, fixed, 'utf8');
        toolsFixed++;
      } else {
        console.log(`[WARN] ${lang}/tools/${f}: footer no coincidió con el patrón esperado`);
      }
    }
  }

  const guidesDir = path.join(ROOT, lang, 'guides');
  if (fs.existsSync(guidesDir)) {
    for (const f of fs.readdirSync(guidesDir).filter((f) => f.endsWith('.html'))) {
      const abs = path.join(guidesDir, f);
      const html = fs.readFileSync(abs, 'utf8');
      const fixed = fixGuidesFooter(html, lang);
      if (fixed !== html) {
        fs.writeFileSync(abs, fixed, 'utf8');
        guidesFixed++;
      } else {
        console.log(`[WARN] ${lang}/guides/${f}: footer no coincidió con el patrón esperado`);
      }
    }
  }
}

console.log(`\n${toolsFixed} páginas de calculadora corregidas`);
console.log(`${guidesFixed} páginas de guía corregidas`);
