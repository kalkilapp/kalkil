#!/usr/bin/env node
/**
 * Toma el JSON traducido (audit-fixes/translations/<slug>.<lang>.json) + el HTML
 * original en inglés, y genera guides/<slug>.html final por idioma, en /es /pt /fr.
 *
 * Camina el DOM con el MISMO filtro que 11-extract-guide-content.mjs (mismo orden
 * determinístico), reemplaza cada nodo de texto por su traducción vía el id
 * secuencial (t0, t1...), reescribe título/meta/canonical/hreflang, reescribe links
 * internos a la versión del mismo idioma cuando existe, y reemplaza el switcher de
 * idioma dinámico (i18n.js) por uno estático (estas páginas ya están completamente
 * traducidas server-side, no necesitan reescritura client-side — y el textMap de
 * i18n.js no cubre body de artículo, así que dejarlo activo rompería el texto real).
 *
 * Uso: node audit-fixes/12-assemble-guide-translations.mjs [--lang=es,pt,fr] [--only=slug1,slug2]
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const TRANS_DIR = path.join(ROOT, 'audit-fixes', 'translations');
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
      if (/icon|dot|\bnum\b/.test(cls)) return true;
    }
    node = node.parentNode;
  }
  return false;
}

// mismos labels que usa i18n.js (T.es/pt/fr['nav.home'] etc.) — se reutilizan literal
// para que el nav de las guías diga exactamente lo mismo que el nav del resto del sitio
const NAV_TEXT = {
  en: { home: 'Home', tools: 'Tools', guides: 'Guides', about: 'About' },
  es: { home: 'Inicio', tools: 'Herramientas', guides: 'Guías', about: 'Sobre Nosotros' },
  pt: { home: 'Início', tools: 'Ferramentas', guides: 'Guias', about: 'Sobre' },
  fr: { home: 'Accueil', tools: 'Outils', guides: 'Guides', about: 'À propos' },
};

const LANG_LABELS = {
  en: { flag: '🇺🇸', name: 'EN' },
  es: { flag: '🇪🇸', name: 'ES' },
  pt: { flag: '🇧🇷', name: 'PT' },
  fr: { flag: '🇫🇷', name: 'FR' },
};

function guideUrl(lang, slug) {
  return lang === 'en' ? `${SITE}/guides/${slug}.html` : `${SITE}/${lang}/guides/${slug}.html`;
}

function switcherHtml(slug, currentLang) {
  // paths absolutos — mucho menos frágil que calcular relativos según profundidad
  const btns = ['en', 'es', 'pt', 'fr'].map((lang) => {
    const href = lang === 'en' ? `/guides/${slug}.html` : `/${lang}/guides/${slug}.html`;
    const active = lang === currentLang ? ' lang-active' : '';
    return `<a href="${href}" class="lang-btn${active}">${LANG_LABELS[lang].name}</a>`;
  });
  return `<div id="lang-switcher">${btns.join('')}</div>`;
}

const SWITCHER_CSS = `<style id="kalkil-i18n-css">#lang-switcher{display:flex;gap:2px;align-items:center}.lang-btn{background:transparent;color:#8a94a6;border:1px solid rgba(128,140,160,0.35);border-radius:6px;padding:3px 7px;font-size:11px;font-weight:700;cursor:pointer;text-decoration:none;font-family:inherit;letter-spacing:0.3px;transition:all .15s}.lang-btn.lang-active{background:#22c55e;color:white;border-color:#22c55e}.lang-btn:hover:not(.lang-active){color:#22c55e;border-color:#22c55e}</style>`;

function rewriteInternalLinks(doc, lang, currentSlug) {
  // hrefs relativos desde guides/*.html son del tipo "../index.html", "../tools/x.html",
  // "../guides/y.html", "y.html" (guía hermana sin ../guides/ prefix a veces)
  doc.querySelectorAll('a[href]').forEach((el) => {
    let href = el.getAttribute('href');
    if (!href || /^https?:\/\/|^mailto:|^tel:|^#/.test(href)) return;

    const clean = href.replace(/^\.\.\//, '');
    // páginas raíz traducidas (18 ya generadas en sesión anterior)
    const ROOT_TRANSLATABLE = ['index.html', 'tools.html', 'guides.html', 'about.html'];
    if (ROOT_TRANSLATABLE.includes(clean)) {
      el.setAttribute('href', clean === 'index.html' ? `/${lang}/` : `/${lang}/${clean}`);
      return;
    }
    if (clean === 'privacy.html' || clean === 'terms.html') {
      el.setAttribute('href', `/${clean}`); // sin traducir, apuntan al inglés real
      return;
    }
    if (clean.startsWith('tools/')) {
      el.setAttribute('href', `/${lang}/${clean}`);
      return;
    }
    if (clean.startsWith('guides/')) {
      const slug = clean.replace('guides/', '').replace('.html', '');
      el.setAttribute('href', `/${lang}/guides/${slug}.html`);
      return;
    }
    // link relativo sin prefijo, ej href="other-guide.html" dentro de guides/
    if (/^[\w-]+\.html$/.test(clean)) {
      const slug = clean.replace('.html', '');
      el.setAttribute('href', `/${lang}/guides/${slug}.html`);
    }
  });
}

function assemble(slug, lang) {
  const enPath = path.join(ROOT, 'guides', `${slug}.html`);
  const transPath = path.join(TRANS_DIR, `${slug}.${lang}.json`);
  if (!fs.existsSync(transPath)) return { slug, lang, ok: false, error: 'sin traducción' };

  const trans = JSON.parse(fs.readFileSync(transPath, 'utf8'));
  const html = fs.readFileSync(enPath, 'utf8');
  const dom = new JSDOM(html, { url: guideUrl('en', slug) });
  const doc = dom.window.document;

  // 1. reemplazar nodos de texto por id, mismo orden que la extracción
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
      // preserva espacios en blanco al inicio/fin del original (indentación del HTML fuente)
      const original = node.textContent;
      const leading = original.match(/^\s*/)[0];
      const trailing = original.match(/\s*$/)[0];
      node.textContent = leading + byId.get(id) + trailing;
    } else {
      mismatches++;
    }
  }

  // 2. meta/title/canonical
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
  canonical.setAttribute('href', guideUrl(lang, slug));

  // 3. hreflang recíproco
  doc.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  const hreflangLinks = ['en', 'es', 'pt', 'fr']
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${guideUrl(l, slug)}">`)
    .join('\n  ');
  doc.head.insertAdjacentHTML('beforeend', `\n  ${hreflangLinks}\n  <link rel="alternate" hreflang="x-default" href="${guideUrl('en', slug)}">\n`);

  // 4. html lang
  doc.documentElement.setAttribute('lang', lang);

  // 5. JSON-LD: traducir headline/description si existe
  doc.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    try {
      const data = JSON.parse(script.textContent);
      if (data['@type'] === 'Article') {
        data.headline = trans.title.replace(/\s*\|\s*Kalkil.*$/, '');
        data.description = trans.metaDescription;
        data.mainEntityOfPage = { '@type': 'WebPage', '@id': guideUrl(lang, slug) };
        script.textContent = JSON.stringify(data, null, 2);
      } else if (data['@type'] === 'FAQPage') {
        // las preguntas/respuestas del FAQ ya se tradujeron como nodos de texto normales
        // dentro del body, así que acá solo hace falta releer el DOM ya traducido para el
        // schema — dos patrones de FAQ distintos conviven en el repo (ver 02-inject-schema.mjs)
        const itemsB = [...doc.querySelectorAll('.faq-item')]; // patrón nuevo: button.faq-q + div.faq-a
        const itemsA = [...doc.querySelectorAll('div.faq')]; // patrón viejo: h3 + p
        let rebuilt = null;
        if (itemsB.length === data.mainEntity.length) {
          rebuilt = itemsB.map((item) => ({
            '@type': 'Question',
            name: item.querySelector('.faq-q')?.childNodes[0]?.textContent.trim() || '',
            acceptedAnswer: { '@type': 'Answer', text: item.querySelector('.faq-a')?.textContent.trim() || '' },
          }));
        } else if (itemsA.length === data.mainEntity.length) {
          rebuilt = itemsA.map((item) => ({
            '@type': 'Question',
            name: item.querySelector('h3')?.textContent.trim() || '',
            acceptedAnswer: { '@type': 'Answer', text: item.querySelector('p')?.textContent.trim() || '' },
          }));
        }
        if (rebuilt) {
          data.mainEntity = rebuilt;
          script.textContent = JSON.stringify(data, null, 2);
        }
      }
    } catch (e) { /* deja el bloque como está si no es JSON parseable */ }
  });

  // 6. assets compartidos (guide-style.css, gtag) → path absoluto — el archivo generado
  // vive un nivel más profundo (/<lang>/guides/ en vez de /guides/), el relativo original
  // ya no resuelve al mismo lugar
  doc.querySelectorAll('link[rel="stylesheet"][href]').forEach((el) => {
    const href = el.getAttribute('href');
    if (!/^https?:\/\//.test(href)) el.setAttribute('href', `/guides/${href.replace(/^\.\.\//, '')}`);
  });

  // 7. nav (Home/Tools/Guides/About) — excluido a propósito de la extracción por nodo
  // (es <nav>, filtrado como chrome), se traduce acá con los mismos labels que i18n.js
  const navLabels = NAV_TEXT[lang];
  const navMap = { '../index.html': navLabels.home, '../tools.html': navLabels.tools, '../guides.html': navLabels.guides, '../about.html': navLabels.about };
  // 10 de las 40 guías usan un nav viejo sin clase .nav-links (div sin clases) — se
  // matchea por href dentro de <nav> en vez de por clase, cubre ambos patrones. Se excluye
  // .nav-brand/.brand: el logo "Kalkil" tiene el MISMO href="../index.html" que el link
  // "Home" — sin esta exclusión "Kalkil" se pisaba con la traducción de "Home" ("Inicio").
  doc.querySelectorAll('nav a[href]').forEach((a) => {
    if (a.classList.contains('nav-brand') || a.classList.contains('brand')) return;
    const href = a.getAttribute('href');
    if (navMap[href] && a.textContent.trim() && !a.querySelector('*')) a.textContent = navMap[href];
  });

  // 8. reemplazar i18n.js por switcher estático (estas páginas no necesitan reescritura client-side)
  const scriptTag = doc.querySelector('script[src="../i18n.js"]');
  if (scriptTag) scriptTag.remove();
  doc.getElementById('kalkil-i18n-css')?.remove();
  doc.head.insertAdjacentHTML('beforeend', SWITCHER_CSS);
  // 10 de las 40 guías no tienen .nav-links (nav viejo, div sin clases) — fallback: el
  // contenedor real de los links de nav es el padre del último <a> dentro de <nav>
  // el HTML fuente (inglés) puede ya traer su propio switcher (13-update-english-guides.mjs
  // le agrega uno con "EN" activo) — hay que sacarlo y poner el correcto para este idioma,
  // no saltear la inserción con un switcher-copiado-tal-cual que queda con el idioma
  // equivocado marcado como activo (bug real que estuvo en las 120 guías en producción)
  doc.getElementById('lang-switcher')?.remove();
  const navLinksContainer = doc.querySelector('.nav-links') || doc.querySelector('nav a[href]:last-of-type')?.parentElement;
  if (navLinksContainer) {
    navLinksContainer.insertAdjacentHTML('beforeend', switcherHtml(slug, lang));
  }

  // 7. links internos → misma versión de idioma
  rewriteInternalLinks(doc, lang, slug);

  const outHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`;
  const outDir = path.join(ROOT, lang, 'guides');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${slug}.html`), outHtml, 'utf8');

  return { slug, lang, ok: true, mismatches, totalNodes: trans.nodes.length };
}

const slugs = fs
  .readdirSync(path.join(ROOT, 'guides'))
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
console.log(`${results.length} páginas procesadas (${slugs.length} guías × ${LANGS.length} idiomas)`);
console.log(`Fallidas (sin traducción disponible): ${failed.length}`);
failed.forEach((r) => console.log(`  - ${r.slug} [${r.lang}]`));
console.log(`Con nodos sin match (id no encontrado en la traducción): ${withMismatches.length}`);
withMismatches.forEach((r) => console.log(`  - ${r.slug} [${r.lang}]: ${r.mismatches}/${r.totalNodes} sin match`));
