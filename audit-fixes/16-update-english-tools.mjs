#!/usr/bin/env node
/**
 * Igual que 13-update-english-guides.mjs pero para las 14 calculadoras: agrega
 * hreflang recíproco + switcher estático a las tools en inglés, saca i18n.js.
 * No toca texto de nav (queda "Home/Tools/Guides/About" en inglés, correcto).
 *
 * Uso: node audit-fixes/16-update-english-tools.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SITE = 'https://kalkilapp.com';

function toolUrl(lang, slug) {
  return lang === 'en' ? `${SITE}/tools/${slug}.html` : `${SITE}/${lang}/tools/${slug}.html`;
}

const LANG_LABELS = { en: 'EN', es: 'ES', pt: 'PT', fr: 'FR' };
function switcherHtml(slug) {
  const btns = ['en', 'es', 'pt', 'fr'].map((lang) => {
    const href = lang === 'en' ? `/tools/${slug}.html` : `/${lang}/tools/${slug}.html`;
    const active = lang === 'en' ? ' lang-active' : '';
    return `<a href="${href}" class="lang-btn${active}">${LANG_LABELS[lang]}</a>`;
  });
  return `<div id="lang-switcher">${btns.join('')}</div>`;
}
const SWITCHER_CSS = `<style id="kalkil-i18n-css">#lang-switcher{display:flex;gap:2px;align-items:center}.lang-btn{background:transparent;color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.15);border-radius:6px;padding:3px 7px;font-size:11px;font-weight:700;cursor:pointer;text-decoration:none;font-family:inherit;letter-spacing:0.3px;transition:all .15s}.lang-btn.lang-active{background:#22c55e;color:white;border-color:#22c55e}.lang-btn:hover:not(.lang-active){color:white;border-color:rgba(255,255,255,0.4)}</style>`;

const slugs = fs.readdirSync(path.join(ROOT, 'tools')).filter((f) => f.endsWith('.html')).map((f) => path.basename(f, '.html'));

let updated = 0;
for (const slug of slugs) {
  const abs = path.join(ROOT, 'tools', `${slug}.html`);
  const html = fs.readFileSync(abs, 'utf8');
  const dom = new JSDOM(html, { url: toolUrl('en', slug) });
  const doc = dom.window.document;

  doc.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  const hreflangLinks = ['en', 'es', 'pt', 'fr']
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${toolUrl(l, slug)}">`)
    .join('\n  ');
  doc.head.insertAdjacentHTML('beforeend', `\n  ${hreflangLinks}\n  <link rel="alternate" hreflang="x-default" href="${toolUrl('en', slug)}">\n`);

  doc.head.insertAdjacentHTML('beforeend', SWITCHER_CSS);
  const navLinksContainer = doc.querySelector('.nav-links');
  if (navLinksContainer && !doc.getElementById('lang-switcher')) {
    navLinksContainer.insertAdjacentHTML('beforeend', switcherHtml(slug));
  }

  const scriptTag = doc.querySelector('script[src="../i18n.js"]');
  if (scriptTag) scriptTag.remove();

  const outHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`;
  fs.writeFileSync(abs, outHtml, 'utf8');
  updated++;
}

console.log(`${updated}/${slugs.length} tools en inglés actualizadas`);
