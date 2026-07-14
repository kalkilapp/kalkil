#!/usr/bin/env node
/**
 * Agrega links a Privacy/Terms en el footer de las 58 páginas del sitio, requisito
 * para aprobación de AdSense (necesita política de privacidad enlazada y visible).
 * privacy.html y terms.html ya existen en la raíz — este script solo enlaza.
 *
 * 3 patrones de footer distintos en el repo (otra vez: no hay plantilla compartida):
 *   1. footer-bottom (index.html, about.html) — 2 <p> dentro de .footer-bottom
 *   2. footer-links (tools.html, guides.html, tools/*.html) — <div class="footer-links">
 *   3. copyright plano (guides/*.html) — un solo <p>© 2026 Kalkil</p>, sin div de links
 *
 * Uso: node audit-fixes/09-add-legal-links.mjs [--dry-run]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

function listFiles() {
  const files = ['index.html', 'tools.html', 'guides.html', 'about.html'];
  for (const dir of ['guides', 'tools']) {
    for (const f of fs.readdirSync(path.join(ROOT, dir))) {
      if (f.endsWith('.html')) files.push(path.join(dir, f));
    }
  }
  return files;
}

function processFile(rel) {
  const abs = path.join(ROOT, rel);
  let html = fs.readFileSync(abs, 'utf8');
  const prefix = rel.includes('/') ? '../' : '';
  const privacyHref = `${prefix}privacy.html`;
  const termsHref = `${prefix}terms.html`;

  if (html.includes(privacyHref) && html.includes('>Privacy<')) {
    return { file: rel, changed: false, reason: 'ya tenía' };
  }

  let changed = false;

  if (html.includes('class="footer-bottom"')) {
    // patrón 1: index.html, about.html
    const linksHtml = `\n      <p><a href="${privacyHref}">Privacy</a> · <a href="${termsHref}">Terms</a></p>`;
    html = html.replace(/(<div class="footer-bottom">[\s\S]*?<\/p>)/, `$1${linksHtml}`);
    changed = true;
  } else if (html.includes('class="footer-links"')) {
    // patrón 2: tools.html, guides.html, tools/*.html
    html = html.replace(
      /(<div class="footer-links">[\s\S]*?)(<\/div>)/,
      `$1<a href="${privacyHref}">Privacy</a>\n    <a href="${termsHref}">Terms</a>\n  $2`
    );
    changed = true;
  } else if (/<footer>\s*<p>©/.test(html)) {
    // patrón 3: guides/*.html — copyright plano, sin div de links
    html = html.replace(
      /(<footer>\s*<p>©[^<]*(?:<a[^>]*>[^<]*<\/a>[^<]*)?<\/p>)/,
      `$1\n<p style="margin-top:6px;font-size:13px;"><a href="${privacyHref}">Privacy</a> · <a href="${termsHref}">Terms</a></p>`
    );
    changed = true;
  }

  if (changed && !DRY_RUN) fs.writeFileSync(abs, html, 'utf8');
  return { file: rel, changed, reason: changed ? 'ok' : 'NINGÚN PATRÓN RECONOCIDO' };
}

const files = listFiles();
const results = files.map(processFile);
const notChanged = results.filter((r) => !r.changed);
const changed = results.filter((r) => r.changed);

console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}${changed.length}/${files.length} archivos actualizados`);
if (notChanged.length) {
  console.log('\nSIN CAMBIOS (revisar a mano):');
  notChanged.forEach((r) => console.log(`  ${r.file} — ${r.reason}`));
}
