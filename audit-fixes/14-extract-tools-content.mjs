#!/usr/bin/env node
/**
 * Igual que 11-extract-guide-content.mjs pero para las 14 calculadoras de tools/.
 * Mismo motivo: título/H1/hero/labels de resultado nunca tuvieron traducción real,
 * solo los <label> de los inputs vía data-i18n. Camina el DOM, extrae texto visible
 * del body (excluye header/footer/script/style/iconos/valores numéricos — estos
 * últimos son los "$0" placeholder de los result-value, que la calculadora sobrescribe
 * en cuanto el usuario tipea, así que no hace falta ni tiene sentido traducirlos).
 *
 * Uso: node audit-fixes/14-extract-tools-content.mjs
 * Salida: audit-fixes/translations-tools/<slug>.en.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const OUT_DIR = path.join(ROOT, 'audit-fixes', 'translations-tools');
fs.mkdirSync(OUT_DIR, { recursive: true });

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

const files = fs.readdirSync(path.join(ROOT, 'tools')).filter((f) => f.endsWith('.html'));
let totalNodes = 0;
for (const f of files) {
  const rel = `tools/${f}`;
  const data = extract(rel);
  const outPath = path.join(OUT_DIR, `${data.slug}.en.json`);
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  totalNodes += data.nodeCount;
  console.log(`${data.slug}: ${data.nodeCount} nodos`);
}
console.log(`\n${files.length} tools extraídas, ${totalNodes} nodos de texto totales`);
