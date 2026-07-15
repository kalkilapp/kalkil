#!/usr/bin/env node
/**
 * Root cause del bug que el usuario encontró al navegar desde guides.html?lang=es:
 * las 4 páginas hub (index/tools/guides/about) — en SUS 4 VERSIONES DE IDIOMA
 * (en/es/pt/fr, 16 archivos en total) — todavía cargan i18n.js. Ese script:
 *   1. En la versión EN, inyecta un switcher dinámico (<button data-lang>) que al
 *      hacer clic en "ES" NO navega a /es/guides.html — hace una traducción
 *      incompleta en el propio DOM (el textMap viejo, con todos los huecos que
 *      arreglamos en las rondas 1 y 2) y solo actualiza el query string a ?lang=es.
 *   2. En las versiones ES/PT/FR (ya 100% traducidas de forma estática), i18n.js
 *      IGUAL se ejecuta al cargar la página y SOBREESCRIBE el switcher con botones
 *      dinámicos — el botón "EN" tampoco navega a la página en inglés, hace un
 *      apply('en') que no revierte nada (no hay textMap en inglés) dejando texto
 *      en español con lang="en".
 *
 * Ya se había resuelto exactamente este problema para las 40 guías y 14 tools
 * individuales (ver 12/15-assemble-*-translations.mjs: quitan i18n.js y ponen un
 * switcher estático <a href> que navega directo a la URL real del idioma). Este
 * script aplica el mismo patrón a los 4 hub pages que quedaron afuera.
 *
 * privacy.html y terms.html también cargan i18n.js pero no tienen versiones
 * /es//pt//fr/ — se les quita el script sin agregar switcher (no hay adónde navegar).
 *
 * Uso: node audit-fixes/23-fix-hub-switcher.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const LANGS = ['en', 'es', 'pt', 'fr'];
const PAGES = ['index.html', 'tools.html', 'guides.html', 'about.html'];
const LANG_LABELS = { en: 'EN', es: 'ES', pt: 'PT', fr: 'FR' };
const FLAGS = { en: '🇺🇸', es: '🇪🇸', pt: '🇧🇷', fr: '🇫🇷' };

const SWITCHER_CSS = `<style id="kalkil-i18n-css">#lang-switcher{display:flex;gap:2px;align-items:center}.lang-btn{background:transparent;color:#8a94a6;border:1px solid rgba(128,140,160,0.35);border-radius:6px;padding:3px 7px;font-size:11px;font-weight:700;cursor:pointer;text-decoration:none;font-family:inherit;letter-spacing:0.3px;transition:all .15s}.lang-btn.lang-active{background:#22c55e;color:white;border-color:#22c55e}.lang-btn:hover:not(.lang-active){color:#22c55e;border-color:#22c55e}</style>`;

function pageUrl(lang, page) {
  const isHome = page === 'index.html';
  if (lang === 'en') return isHome ? '/' : `/${page}`;
  return isHome ? `/${lang}/` : `/${lang}/${page}`;
}

function switcherHtml(page, currentLang) {
  const btns = LANGS.map((lang) => {
    const active = lang === currentLang ? ' lang-active' : '';
    return `<a href="${pageUrl(lang, page)}" class="lang-btn${active}" title="${FLAGS[lang]}">${LANG_LABELS[lang]}</a>`;
  });
  return `<div id="lang-switcher">${btns.join('')}</div>`;
}

function removeI18nScript(doc) {
  doc.querySelectorAll('script').forEach((s) => {
    const src = s.getAttribute('src') || '';
    if (/i18n\.js$/.test(src)) s.remove();
  });
}

let totalFixed = 0;

for (const page of PAGES) {
  for (const lang of LANGS) {
    const rel = lang === 'en' ? page : path.join(lang, page);
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) { console.log(`[SKIP] no existe ${rel}`); continue; }

    const html = fs.readFileSync(abs, 'utf8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    removeI18nScript(doc);
    doc.getElementById('lang-switcher')?.remove();
    doc.getElementById('kalkil-i18n-css')?.remove();
    doc.head.insertAdjacentHTML('beforeend', SWITCHER_CSS);

    const navLinks = doc.querySelector('.nav-links');
    if (navLinks) {
      const navCta = navLinks.querySelector('a.nav-cta');
      if (navCta) navCta.insertAdjacentHTML('beforebegin', switcherHtml(page, lang));
      else navLinks.insertAdjacentHTML('beforeend', switcherHtml(page, lang));
    }

    const outHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`;
    fs.writeFileSync(abs, outHtml, 'utf8');
    totalFixed++;
    console.log(`[OK] ${rel} — switcher estático, i18n.js removido`);
  }
}

// privacy.html / terms.html: sin versiones traducidas, solo se quita i18n.js
for (const page of ['privacy.html', 'terms.html']) {
  const abs = path.join(ROOT, page);
  if (!fs.existsSync(abs)) continue;
  const html = fs.readFileSync(abs, 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  removeI18nScript(doc);
  const outHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`;
  fs.writeFileSync(abs, outHtml, 'utf8');
  totalFixed++;
  console.log(`[OK] ${page} — i18n.js removido (sin versiones traducidas, sin switcher)`);
}

console.log(`\n${totalFixed} archivos actualizados`);
