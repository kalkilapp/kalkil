#!/usr/bin/env node
/**
 * Igual que 12-assemble-guide-translations.mjs pero para las 14 calculadoras.
 * Diferencias reales con guides: no hay Article/FAQPage schema, el CSS compartido es
 * calc-style.css (no guide-style.css), y el nav tiene un botón .nav-cta con el MISMO
 * href="../tools.html" que el link "Tools" — hay que excluirlo del mapeo genérico de
 * nav o se pisa con el label incorrecto.
 *
 * Uso: node audit-fixes/15-assemble-tools-translations.mjs [--lang=es,pt,fr] [--only=slug1,slug2]
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const TRANS_DIR = path.join(ROOT, 'audit-fixes', 'translations-tools');
const SITE = 'https://kalkilapp.com';

const argLang = process.argv.find((a) => a.startsWith('--lang='));
const LANGS = argLang ? argLang.slice(7).split(',') : ['es', 'pt', 'fr'];
const argOnly = process.argv.find((a) => a.startsWith('--only='));
const ONLY = argOnly ? new Set(argOnly.slice(7).split(',')) : null;

const NUMERIC_RE = /^[\s$€£¥%0-9.,+\-–—×x/:()]*$/;

function isSkippable(el) {
  let node = el;
  while (node) {
    if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase();
      if (['header', 'footer', 'script', 'style', 'nav'].includes(tag)) return true;
      const cls = (node.getAttribute && node.getAttribute('class')) || '';
      if (/icon|dot|\bnum\b|result-value/.test(cls)) return true;
    }
    node = node.parentNode;
  }
  return false;
}

const NAV_TEXT = {
  en: { home: 'Home', tools: 'Tools', guides: 'Guides', about: 'About', cta: 'All Calculators' },
  es: { home: 'Inicio', tools: 'Herramientas', guides: 'Guías', about: 'Sobre Nosotros', cta: 'Todas las Calculadoras' },
  pt: { home: 'Início', tools: 'Ferramentas', guides: 'Guias', about: 'Sobre', cta: 'Todas as Calculadoras' },
  fr: { home: 'Accueil', tools: 'Outils', guides: 'Guides', about: 'À propos', cta: 'Tous les Calculateurs' },
};

const LANG_LABELS = { en: 'EN', es: 'ES', pt: 'PT', fr: 'FR' };

function toolUrl(lang, slug) {
  return lang === 'en' ? `${SITE}/tools/${slug}.html` : `${SITE}/${lang}/tools/${slug}.html`;
}

function switcherHtml(slug, currentLang) {
  const btns = ['en', 'es', 'pt', 'fr'].map((lang) => {
    const href = lang === 'en' ? `/tools/${slug}.html` : `/${lang}/tools/${slug}.html`;
    const active = lang === currentLang ? ' lang-active' : '';
    return `<a href="${href}" class="lang-btn${active}">${LANG_LABELS[lang]}</a>`;
  });
  return `<div id="lang-switcher">${btns.join('')}</div>`;
}
const SWITCHER_CSS = `<style id="kalkil-i18n-css">#lang-switcher{display:flex;gap:2px;align-items:center}.lang-btn{background:transparent;color:#8a94a6;border:1px solid rgba(128,140,160,0.35);border-radius:6px;padding:3px 7px;font-size:11px;font-weight:700;cursor:pointer;text-decoration:none;font-family:inherit;letter-spacing:0.3px;transition:all .15s}.lang-btn.lang-active{background:#22c55e;color:white;border-color:#22c55e}.lang-btn:hover:not(.lang-active){color:#22c55e;border-color:#22c55e}</style>`;

function rewriteInternalLinks(doc, lang) {
  doc.querySelectorAll('a[href]').forEach((el) => {
    let href = el.getAttribute('href');
    if (!href || /^https?:\/\/|^mailto:|^tel:|^#/.test(href)) return;
    const clean = href.replace(/^\.\.\//, '');
    const ROOT_TRANSLATABLE = ['index.html', 'tools.html', 'guides.html', 'about.html'];
    if (ROOT_TRANSLATABLE.includes(clean)) {
      el.setAttribute('href', clean === 'index.html' ? `/${lang}/` : `/${lang}/${clean}`);
      return;
    }
    if (clean === 'privacy.html' || clean === 'terms.html') {
      el.setAttribute('href', `/${clean}`);
      return;
    }
    if (clean.startsWith('guides/')) {
      // las 40 guías NO tienen traducción de slug propia por idioma más allá de lo ya
      // generado — igual apuntan a /lang/guides/slug.html porque sí existen
      el.setAttribute('href', `/${lang}/${clean}`);
      return;
    }
    if (clean.startsWith('tools/')) {
      const slug = clean.replace('tools/', '').replace('.html', '');
      el.setAttribute('href', `/${lang}/tools/${slug}.html`);
      return;
    }
    if (/^[\w-]+\.html$/.test(clean)) {
      const slug = clean.replace('.html', '');
      el.setAttribute('href', `/${lang}/tools/${slug}.html`);
    }
  });
}

function assemble(slug, lang) {
  const enPath = path.join(ROOT, 'tools', `${slug}.html`);
  const transPath = path.join(TRANS_DIR, `${slug}.${lang}.json`);
  if (!fs.existsSync(transPath)) return { slug, lang, ok: false, error: 'sin traducción' };

  const trans = JSON.parse(fs.readFileSync(transPath, 'utf8'));
  const html = fs.readFileSync(enPath, 'utf8');
  const dom = new JSDOM(html, { url: toolUrl('en', slug) });
  const doc = dom.window.document;

  const body = doc.body;
  const walker = doc.createTreeWalker(body, dom.window.NodeFilter.SHOW_TEXT);
  const byId = new Map(trans.nodes.map((n) => [n.id, n.text]));
  let i = 0;
  let n;
  const nodesToReplace = [];
  while ((n = walker.nextNode())) {
    const text = n.textContent;
    if (!text || !text.trim()) continue;
    if (isSkippable(n.parentNode)) continue;
    if (NUMERIC_RE.test(text)) continue;
    nodesToReplace.push({ node: n, id: `t${i++}` });
  }
  let mismatches = 0;
  for (const { node, id } of nodesToReplace) {
    if (byId.has(id)) {
      const original = node.textContent;
      const leading = original.match(/^\s*/)[0];
      const trailing = original.match(/\s*$/)[0];
      node.textContent = leading + byId.get(id) + trailing;
    } else {
      mismatches++;
    }
  }

  doc.title = trans.title;
  const descEl = doc.querySelector('meta[name="description"]');
  if (descEl) descEl.setAttribute('content', trans.metaDescription);
  const ogTitleEl = doc.querySelector('meta[property="og:title"]');
  if (ogTitleEl) ogTitleEl.setAttribute('content', trans.ogTitle);
  const ogDescEl = doc.querySelector('meta[property="og:description"]');
  if (ogDescEl) ogDescEl.setAttribute('content', trans.ogDescription);

  let canonical = doc.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = doc.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    doc.head.appendChild(canonical);
  }
  canonical.setAttribute('href', toolUrl(lang, slug));

  doc.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  const hreflangLinks = ['en', 'es', 'pt', 'fr']
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${toolUrl(l, slug)}">`)
    .join('\n  ');
  doc.head.insertAdjacentHTML('beforeend', `\n  ${hreflangLinks}\n  <link rel="alternate" hreflang="x-default" href="${toolUrl('en', slug)}">\n`);

  doc.documentElement.setAttribute('lang', lang);

  // CSS compartido → path absoluto
  doc.querySelectorAll('link[rel="stylesheet"][href]').forEach((el) => {
    const href = el.getAttribute('href');
    if (!/^https?:\/\//.test(href)) el.setAttribute('href', `/tools/${href.replace(/^\.\.\//, '')}`);
  });

  // nav: Home/Tools/Guides/About — excluye .nav-cta (mismo href que "Tools", se traduce
  // aparte) y .brand (el logo "Kalkil" también tiene href="../index.html", mismo href
  // que el link "Home" — sin esta exclusión "Kalkil" se pisaba con "Inicio")
  const navLabels = NAV_TEXT[lang];
  const navMap = { '../index.html': navLabels.home, '../tools.html': navLabels.tools, '../guides.html': navLabels.guides, '../about.html': navLabels.about };
  doc.querySelectorAll('nav a[href]').forEach((a) => {
    if (a.classList.contains('nav-cta') || a.classList.contains('brand') || a.classList.contains('nav-brand')) return;
    const href = a.getAttribute('href');
    if (navMap[href] && a.textContent.trim() && !a.querySelector('*')) a.textContent = navMap[href];
  });
  const ctaLink = doc.querySelector('nav a.nav-cta');
  if (ctaLink) ctaLink.textContent = navLabels.cta;

  // switcher estático — sin i18n.js
  const scriptTag = doc.querySelector('script[src="../i18n.js"]');
  if (scriptTag) scriptTag.remove();
  doc.getElementById('kalkil-i18n-css')?.remove();
  doc.head.insertAdjacentHTML('beforeend', SWITCHER_CSS);
  // mismo fix que en 12-assemble-guide-translations.mjs: el fuente en inglés ya trae su
  // propio switcher (16-update-english-tools.mjs), hay que sacarlo y poner el correcto
  doc.getElementById('lang-switcher')?.remove();
  const navLinksContainer = doc.querySelector('.nav-links');
  if (navLinksContainer) {
    navLinksContainer.insertAdjacentHTML('beforeend', switcherHtml(slug, lang));
  }

  rewriteInternalLinks(doc, lang);

  const outHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`;
  const outDir = path.join(ROOT, lang, 'tools');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${slug}.html`), outHtml, 'utf8');

  return { slug, lang, ok: true, mismatches, totalNodes: trans.nodes.length };
}

const slugs = fs
  .readdirSync(path.join(ROOT, 'tools'))
  .filter((f) => f.endsWith('.html'))
  .map((f) => path.basename(f, '.html'))
  .filter((s) => !ONLY || ONLY.has(s));

const results = [];
for (const lang of LANGS) {
  for (const slug of slugs) {
    results.push(assemble(slug, lang));
  }
}

const failed = results.filter((r) => !r.ok);
const withMismatches = results.filter((r) => r.ok && r.mismatches > 0);
console.log(`${results.length} páginas procesadas (${slugs.length} tools × ${LANGS.length} idiomas)`);
console.log(`Fallidas (sin traducción disponible): ${failed.length}`);
failed.forEach((r) => console.log(`  - ${r.slug} [${r.lang}]`));
console.log(`Con nodos sin match (id no encontrado en la traducción): ${withMismatches.length}`);
withMismatches.forEach((r) => console.log(`  - ${r.slug} [${r.lang}]: ${r.mismatches}/${r.totalNodes} sin match`));
