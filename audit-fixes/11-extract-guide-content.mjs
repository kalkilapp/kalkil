#!/usr/bin/env node
/**
 * Extrae todo el texto traducible de las 40 guías a JSON, para traducción real
 * (no textMap — el cuerpo completo del artículo). Camina el DOM con jsdom y
 * recolecta cada nodo de texto visible del <body>, excluyendo:
 *   - header/footer/script/style (nav y footer se manejan aparte, no como contenido)
 *   - elementos con clase que contenga "icon" o "dot" (símbolos, no texto real)
 *   - nodos puramente numéricos/moneda/porcentaje (ej "$50", "1,000", "45%") — no
 *     tiene sentido "traducirlos" y traducirlos mal rompería los cálculos de ejemplo
 *
 * El orden de recorrido es determinístico: extracción y reensamblado (script 12)
 * caminan el MISMO html original con el MISMO filtro, así que un id secuencial
 * (t0, t1, t2...) alcanza para volver a matchear cada nodo sin necesidad de
 * selectores CSS frágiles.
 *
 * Uso: node audit-fixes/11-extract-guide-content.mjs
 * Salida: audit-fixes/translations/<slug>.en.json (uno por guía)
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const OUT_DIR = path.join(ROOT, 'audit-fixes', 'translations');
fs.mkdirSync(OUT_DIR, { recursive: true });

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

function extract(relPath) {
  const abs = path.join(ROOT, relPath);
  const html = fs.readFileSync(abs, 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const title = doc.querySelector('title')?.textContent || '';
  const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
  const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';

  const body = doc.body;
  const walker = doc.createTreeWalker(body, dom.window.NodeFilter.SHOW_TEXT);
  const nodes = [];
  let i = 0;
  let n;
  while ((n = walker.nextNode())) {
    const text = n.textContent;
    if (!text || !text.trim()) continue;
    if (isSkippable(n.parentNode)) continue;
    if (NUMERIC_RE.test(text)) continue;
    nodes.push({ id: `t${i++}`, tag: n.parentNode.tagName.toLowerCase(), text: text.trim() });
  }

  return { slug: path.basename(relPath, '.html'), title, metaDescription, ogTitle, ogDescription, nodeCount: nodes.length, nodes };
}

const files = fs.readdirSync(path.join(ROOT, 'guides')).filter((f) => f.endsWith('.html'));
let totalNodes = 0;
for (const f of files) {
  const rel = `guides/${f}`;
  const data = extract(rel);
  const outPath = path.join(OUT_DIR, `${data.slug}.en.json`);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  totalNodes += data.nodeCount;
  console.log(`${data.slug}: ${data.nodeCount} nodos`);
}
console.log(`\n${files.length} guías extraídas, ${totalNodes} nodos de texto totales`);
