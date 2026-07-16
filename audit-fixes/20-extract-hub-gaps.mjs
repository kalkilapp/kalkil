#!/usr/bin/env node
/**
 * Extrae SOLO el texto que quedó en inglés dentro de las 4 páginas hub ya traducidas
 * (es/index.html, es/tools.html, es/guides.html, es/about.html) — no toca nada que ya
 * funciona (nav, hreflang, canonical, switcher, tabs de filtro ya traducidas por
 * i18n.js). El mecanismo viejo (i18n.js + textMap) solo cubría títulos cortos, no
 * descripciones largas — esto encuentra exactamente lo que falta.
 *
 * A diferencia de 11-extract-guide-content.mjs (que camina TODO el body por id
 * secuencial), acá se filtra por heurística de inglés y se guarda por STRING exacto
 * (no por id) — el reensamblado hace find-replace literal sobre el archivo actual,
 * sin regenerar nada que ya esté bien.
 *
 * Uso: node audit-fixes/20-extract-hub-gaps.mjs [--lang=es|pt|fr]
 * Salida: audit-fixes/translations-hub/<lang>/<page>.gaps.en.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const argLang = process.argv.find((a) => a.startsWith('--lang='));
const LANG = argLang ? argLang.slice(7) : 'es';
const OUT_DIR = path.join(ROOT, 'audit-fixes', 'translations-hub', LANG);
fs.mkdirSync(OUT_DIR, { recursive: true });

const ENGLISH_HINTS = /\b(the|and|your|with|for|from|per|is|are|to|of|on|in|our|you|this|every|based|discover|learn|find|estimate|calculate)\b/i;
const PAGES = ['index.html', 'tools.html', 'guides.html', 'about.html'];

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
  const abs = path.join(ROOT, LANG, page);
  const html = fs.readFileSync(abs, 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const walker = doc.createTreeWalker(doc.body, dom.window.NodeFilter.SHOW_TEXT);

  // clases conocidas por quedar en inglés incluso con frases cortas que la heurística
  // de "palabras en inglés" no detecta (ej "Read Guide →" no tiene ninguna hint word)
  const FORCE_CLASSES = /\b(card-read|guide-read)\b/;

  const seen = new Map(); // texto exacto -> {count, tag, className}
  let n;
  while ((n = walker.nextNode())) {
    const text = n.textContent.trim();
    if (text.length < 3) continue;
    if (isSkippable(n.parentNode)) continue;
    const className = n.parentNode.className || '';
    const forced = FORCE_CLASSES.test(className);
    if (!forced && (text.length < 12 || !ENGLISH_HINTS.test(text))) continue;
    if (seen.has(text)) { seen.get(text).count++; continue; }
    seen.set(text, { count: 1, tag: n.parentNode.tagName.toLowerCase(), className });
  }

  const gaps = [...seen.entries()].map(([text, meta], i) => ({ id: `g${i}`, text, ...meta }));
  const outPath = path.join(OUT_DIR, `${page}.gaps.en.json`);
  fs.writeFileSync(outPath, JSON.stringify({ page, gapCount: gaps.length, gaps }, null, 2), 'utf8');
  console.log(`${page}: ${gaps.length} textos en inglés encontrados`);
}
