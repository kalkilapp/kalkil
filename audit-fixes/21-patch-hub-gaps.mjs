#!/usr/bin/env node
/**
 * Aplica las traducciones de audit-fixes/translations-hub/<page>.gaps.es.json de vuelta
 * a es/<page> haciendo un find-replace de texto EXACTO por nodo (mismo walker/filtro que
 * 20-extract-hub-gaps.mjs, para que el orden y el matching sean deterministas) — no toca
 * nav, hreflang, canonical, switcher ni las filter-tabs, que ya funcionan bien.
 *
 * Uso: node audit-fixes/21-patch-hub-gaps.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const GAPS_DIR = path.join(ROOT, 'audit-fixes', 'translations-hub');
const PAGES = ['index.html', 'tools.html', 'guides.html', 'about.html'];

const ENGLISH_HINTS = /\b(the|and|your|with|for|from|per|is|are|to|of|on|in|our|you|this|every|based|discover|learn|find|estimate|calculate)\b/i;
const FORCE_CLASSES = /\b(card-read|guide-read)\b/;

// <title>/<meta description>/<og:title>/<og:description> — el walker de body no los ve
// (viven en <head>) y quedaron en inglés en 3 de las 4 páginas hub, mismo bug de fondo
// que el usuario reportó: SEO de una página /es/ con metadata en inglés.
const HEAD_FIXES = {
  'index.html': {
    ogTitle: 'Kalkil — Calculadoras Gratuitas de Ganancias para Creadores 2026',
    ogDescription: 'Estima tus ganancias en YouTube, TikTok, Spotify, Instagram, Twitch y más. Calculadoras y guías gratuitas para creadores.',
  },
  'tools.html': {
    title: 'Calculadoras Gratuitas de Ganancias para Creadores 2026 — YouTube, TikTok, Spotify, Twitch y Más | Kalkil',
    metaDescription: 'Calculadoras gratuitas de la economía creator para 2026. Estima ganancias de CPM de YouTube, Recompensas para Creadores de TikTok, regalías de Spotify, tarifas de influencers de Instagram, ingresos de Twitch, Patreon y más. Sin registro.',
    ogTitle: 'Calculadoras Gratuitas de Ganancias para Creadores 2026 | Kalkil',
    ogDescription: 'Herramientas gratuitas para estimar ganancias de creadores en YouTube, TikTok, Spotify, Instagram, Twitch, Patreon y OnlyFans. Resultados instantáneos, sin registro.',
  },
  'guides.html': {
    title: 'Guías de la Economía Creator 2026 — YouTube, TikTok, Instagram y Streaming | Kalkil',
    metaDescription: 'Guías gratuitas sobre la economía creator para 2026. Descubre cuánto pagan YouTube, TikTok, Instagram, Spotify y Twitch a los creadores — con calculadoras de ganancias para cada plataforma.',
    ogTitle: 'Guías de la Economía Creator 2026 | Kalkil',
    ogDescription: 'Guías gratuitas sobre la economía creator. CPM de YouTube, ganancias de TikTok, tarifas de Instagram, regalías de Spotify, ingresos de Twitch y más.',
  },
  'about.html': {
    title: 'Sobre Kalkil — Calculadoras y Guías Gratuitas de la Economía Creator 2026',
    metaDescription: 'Kalkil ofrece calculadoras y guías gratuitas de ganancias para creadores de YouTube, TikTok, Spotify, Instagram, Twitch y más. Conoce nuestra misión de hacer transparentes y accesibles los datos de la economía creator.',
    ogTitle: 'Sobre Kalkil — Herramientas y Guías de la Economía Creator',
    ogDescription: 'Calculadoras y guías gratuitas para entender cómo ganan dinero los creadores en YouTube, TikTok, Spotify, Instagram, Twitch, Patreon y más.',
  },
};

function isSkippable(el) {
  let node = el;
  while (node) {
    if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase();
      if (['header', 'footer', 'script', 'style', 'nav'].includes(tag)) return true;
      const cls = (node.getAttribute && node.getAttribute('class')) || '';
      if (/icon|dot/.test(cls)) return true;
    }
    node = node.parentNode;
  }
  return false;
}

for (const page of PAGES) {
  const enGapsPath = path.join(GAPS_DIR, `${page}.gaps.en.json`);
  const esGapsPath = path.join(GAPS_DIR, `${page}.gaps.es.json`);
  if (!fs.existsSync(enGapsPath) || !fs.existsSync(esGapsPath)) {
    console.log(`[SKIP] ${page}: falta gaps.en.json o gaps.es.json`);
    continue;
  }

  const enGaps = JSON.parse(fs.readFileSync(enGapsPath, 'utf8'));
  const esGaps = JSON.parse(fs.readFileSync(esGapsPath, 'utf8'));
  const byText = new Map(enGaps.gaps.map((g) => [g.text, esGaps.translations[g.id]]));

  const missing = enGaps.gaps.filter((g) => !esGaps.translations[g.id]);
  if (missing.length) {
    console.log(`[WARN] ${page}: ${missing.length} ids sin traducción — ${missing.map((g) => g.id).join(', ')}`);
  }

  const abs = path.join(ROOT, 'es', page);
  const html = fs.readFileSync(abs, 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const walker = doc.createTreeWalker(doc.body, dom.window.NodeFilter.SHOW_TEXT);

  let replaced = 0;
  let n;
  const toReplace = [];
  while ((n = walker.nextNode())) {
    const text = n.textContent.trim();
    if (text.length < 3) continue;
    if (isSkippable(n.parentNode)) continue;
    const className = n.parentNode.className || '';
    const forced = FORCE_CLASSES.test(className);
    if (!forced && (text.length < 12 || !ENGLISH_HINTS.test(text))) continue;
    if (!byText.has(text)) continue;
    toReplace.push(n);
  }
  for (const node of toReplace) {
    const text = node.textContent.trim();
    const translated = byText.get(text);
    if (!translated) continue;
    const leading = node.textContent.match(/^\s*/)[0];
    const trailing = node.textContent.match(/\s*$/)[0];
    node.textContent = leading + translated + trailing;
    replaced++;
  }

  const headFix = HEAD_FIXES[page];
  if (headFix) {
    if (headFix.title) doc.title = headFix.title;
    if (headFix.metaDescription) {
      const el = doc.querySelector('meta[name="description"]');
      if (el) el.setAttribute('content', headFix.metaDescription);
    }
    if (headFix.ogTitle) {
      const el = doc.querySelector('meta[property="og:title"]');
      if (el) el.setAttribute('content', headFix.ogTitle);
    }
    if (headFix.ogDescription) {
      const el = doc.querySelector('meta[property="og:description"]');
      if (el) el.setAttribute('content', headFix.ogDescription);
    }
  }

  const outHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`;
  fs.writeFileSync(abs, outHtml, 'utf8');
  console.log(`${page}: ${replaced}/${enGaps.gaps.length} textos reemplazados${headFix ? ' + head tags' : ''}`);
}
