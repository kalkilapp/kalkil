#!/usr/bin/env node
/**
 * Bug pre-existente (ya estaba en el commit 3794a2a, antes de esta sesión, en las 14
 * tarjetas de tools.html): cada tarjeta es <a class="tool-card"> que envuelve, más
 * adentro, otro <a class="open-btn"> — anchors anidados, inválido en HTML5. Los
 * navegadores (y JSDOM, con el mismo algoritmo de la spec) "corrigen" esto partiendo
 * el <a> exterior en fragmentos alrededor del <a> interior. En la tarjeta destacada
 * (.tool-card.featured, layout de 2 columnas con flexbox) esa partición saca
 * .featured-right del contenedor flex, produciendo el layout apretado que se ve en
 * la captura del usuario. En las tarjetas normales no se nota visualmente (layout en
 * columna simple) pero el HTML guardado quedó igual de roto.
 *
 * Fix: reconstruye cada tarjeta como una sola <a class="tool-card"> válida, moviendo
 * .featured-right / .card-footer adentro y convirtiendo el <a class="open-btn"> interior
 * en <span class="open-btn"> (mismo estilo visual — .open-btn no depende de ser <a>,
 * y toda la tarjeta ya es clickeable via el <a> exterior con el mismo href).
 *
 * Uso: node audit-fixes/24-fix-tool-card-nesting.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const FILES = ['tools.html', 'es/tools.html', 'pt/tools.html', 'fr/tools.html'];

function convertOpenBtnAnchorsToSpans(doc, container) {
  container.querySelectorAll('a.open-btn').forEach((a) => {
    const span = doc.createElement('span');
    span.className = a.className;
    span.innerHTML = a.innerHTML;
    a.replaceWith(span);
  });
}

function removeEmptyLeftoverAnchors(container) {
  // fragmentos vacíos <a class="tool-card...">(sin contenido real, artefacto del split)
  container.querySelectorAll('a.tool-card').forEach((a) => {
    if (!a.textContent.trim() && a.children.length === 0) a.remove();
  });
}

function fixFile(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { console.log(`[SKIP] no existe ${rel}`); return; }
  const html = fs.readFileSync(abs, 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const grids = doc.querySelectorAll('.tools-grid');
  if (!grids.length) { console.log(`[SKIP] ${rel}: no tiene .tools-grid`); return; }

  let fixed = 0;
  for (const grid of grids) {
    // snapshot de los hijos ANTES de mutar (mutar mientras se recorre rompe nextElementSibling)
    const children = Array.from(grid.children);
    for (const el of children) {
      if (!el.isConnected) continue; // ya movido/eliminado por una iteración previa
      if (el.tagName !== 'A' || !el.classList.contains('tool-card')) continue;
      const isFeatured = el.classList.contains('featured');
      const next = el.nextElementSibling;

      if (isFeatured && next && next.classList.contains('featured-right')) {
        removeEmptyLeftoverAnchors(next);
        convertOpenBtnAnchorsToSpans(doc, next);
        // unwrap cualquier <a class="tool-card"> residual con contenido real (el fragmento
        // que envolvía badge/title/desc/features) — mueve sus hijos al nivel de featured-right
        next.querySelectorAll('a.tool-card').forEach((innerA) => {
          while (innerA.firstChild) next.insertBefore(innerA.firstChild, innerA);
          innerA.remove();
        });
        el.appendChild(next);
        fixed++;
      } else if (!isFeatured && next && next.classList.contains('card-footer')) {
        removeEmptyLeftoverAnchors(next);
        convertOpenBtnAnchorsToSpans(doc, next);
        el.appendChild(next);
        fixed++;
      }
    }
  }

  const outHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`;
  fs.writeFileSync(abs, outHtml, 'utf8');
  console.log(`${rel}: ${fixed} tarjetas reconstruidas`);
}

for (const f of FILES) fixFile(f);
