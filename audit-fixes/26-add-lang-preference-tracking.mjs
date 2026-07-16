#!/usr/bin/env node
/**
 * El auto-redirect por idioma de navegador en la raíz (index.html) solo debe correr
 * si el usuario NUNCA eligió un idioma a mano. Para eso, cada clic en el switcher
 * (#lang-switcher a.lang-btn, en CUALQUIER página del sitio, no solo la raíz) tiene
 * que guardar esa elección en localStorage ANTES de navegar — si no, un usuario de
 * LATAM que prefiere leer en inglés terminaría siendo redirigido a /es/ cada vez que
 * vuelve a la raíz, sin poder escapar de la detección automática.
 *
 * El switcher es un <a href> plano (sin data-lang, ver 23-fix-hub-switcher.mjs y
 * 12/15-assemble-*-translations.mjs) — el idioma de destino se deduce del propio
 * href ('/es/...' → es, '/pt/...' → pt, '/fr/...' → fr, cualquier otra cosa → en).
 * No hace falta preventDefault: se guarda en localStorage de forma síncrona antes de
 * que el navegador siga el link.
 *
 * Uso: node audit-fixes/26-add-lang-preference-tracking.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');

const MARKER = 'kalkil-lang-pref-tracking';
const SNIPPET = `<script data-${MARKER}>document.getElementById('lang-switcher')&&document.getElementById('lang-switcher').addEventListener('click',function(e){var a=e.target.closest?e.target.closest('a.lang-btn'):null;if(!a)return;var m=(a.getAttribute('href')||'').match(/^\\/(es|pt|fr)\\//);try{localStorage.setItem('user_language',m?m[1]:'en');}catch(_){}});</script>`;

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f === 'node_modules' || f === '.git') continue;
      walk(full, out);
    } else if (f.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

let updated = 0;
let skippedNoSwitcher = 0;
let skippedAlready = 0;

for (const abs of walk(ROOT)) {
  const html = fs.readFileSync(abs, 'utf8');
  if (!html.includes('id="lang-switcher"')) { skippedNoSwitcher++; continue; }
  if (html.includes(MARKER)) { skippedAlready++; continue; }

  const idx = html.lastIndexOf('</body>');
  if (idx === -1) { console.log(`[WARN] ${path.relative(ROOT, abs)}: no tiene </body>, se salta`); continue; }
  const out = html.slice(0, idx) + SNIPPET + '\n' + html.slice(idx);
  fs.writeFileSync(abs, out, 'utf8');
  updated++;
}

console.log(`${updated} páginas actualizadas`);
console.log(`${skippedAlready} ya tenían el snippet (idempotente)`);
console.log(`${skippedNoSwitcher} páginas sin switcher, no se tocaron`);
