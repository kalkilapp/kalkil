#!/usr/bin/env node
/**
 * Deja el sitio listo para AdSense (Auto ads) en un solo paso, una vez que el usuario
 * tenga su Publisher ID (formato pub-XXXXXXXXXXXXXXXX, se ve en AdSense → Cuenta →
 * Información de la cuenta).
 *
 * Hace dos cosas:
 *   1. Genera /ads.txt en la raíz con la línea estándar que exige Google
 *      (https://support.google.com/adsense/answer/7532444). El valor
 *      "f08c47fec0942fa0" NO es específico de esta cuenta — es el "Certification
 *      Authority ID" fijo que Google usa para todo publisher de AdSense, documentado
 *      en su ayuda oficial.
 *   2. Inyecta el script de Auto ads
 *      (https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=...)
 *      en el <head> de TODAS las páginas .html del sitio — Auto ads necesita el
 *      script en cada página donde puede mostrar anuncios, no alcanza con ponerlo
 *      solo en el home. Idempotente: si ya está insertado (mismo marcador), no lo
 *      duplica — se puede correr de nuevo sin problema si cambia el pub ID.
 *
 * Uso: node audit-fixes/34-setup-adsense.mjs --pub-id=pub-XXXXXXXXXXXXXXXX
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const argPubId = process.argv.find((a) => a.startsWith('--pub-id='));
const PUB_ID = argPubId ? argPubId.slice(9) : null;

if (!PUB_ID || !/^pub-\d{10,20}$/.test(PUB_ID)) {
  console.error('Uso: node audit-fixes/34-setup-adsense.mjs --pub-id=pub-XXXXXXXXXXXXXXXX');
  console.error('El pub-id tiene que tener el formato exacto "pub-" + solo dígitos (se ve en AdSense → Cuenta → Información de la cuenta).');
  process.exit(1);
}

const CLIENT_ID = `ca-${PUB_ID}`; // el script de Auto ads usa el prefijo "ca-", ads.txt no

// --- 1. ads.txt ---
const adsTxtPath = path.join(ROOT, 'ads.txt');
const adsTxtContent = `google.com, ${PUB_ID}, DIRECT, f08c47fec0942fa0\n`;
fs.writeFileSync(adsTxtPath, adsTxtContent, 'utf8');
console.log(`[OK] ads.txt generado con ${PUB_ID}`);

// --- 2. script de Auto ads en el <head> de todas las páginas ---
const MARKER = 'kalkil-adsense-autoads';
const SCRIPT_TAG = `<script async data-${MARKER} src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}" crossorigin="anonymous"></script>`;

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
let alreadyHad = 0;
for (const abs of walk(ROOT)) {
  let html = fs.readFileSync(abs, 'utf8');
  if (html.includes(MARKER)) {
    // ya insertado — si el client ID cambió, lo actualiza; si no, no toca nada
    const re = new RegExp(`<script async data-${MARKER}[^>]*></script>`);
    if (!html.includes(SCRIPT_TAG)) {
      html = html.replace(re, SCRIPT_TAG);
      fs.writeFileSync(abs, html, 'utf8');
      updated++;
    } else {
      alreadyHad++;
    }
    continue;
  }
  const headIdx = html.indexOf('<head>');
  if (headIdx === -1) { console.log(`[WARN] ${path.relative(ROOT, abs)}: no tiene <head>, se salta`); continue; }
  const insertAt = headIdx + '<head>'.length;
  html = html.slice(0, insertAt) + '\n  ' + SCRIPT_TAG + html.slice(insertAt);
  fs.writeFileSync(abs, html, 'utf8');
  updated++;
}

console.log(`[OK] ${updated} páginas actualizadas con el script de Auto ads`);
if (alreadyHad) console.log(`[OK] ${alreadyHad} páginas ya tenían el client ID correcto, sin cambios`);
console.log('\nPendiente del lado de Google (no lo puede hacer este script):');
console.log('  - Verificación de propiedad del sitio, si AdSense te pide un paso extra además del ads.txt.');
console.log('  - "Privacy & messaging" en AdSense, para el aviso de consentimiento GDPR (relevante para el tráfico de /fr/).');
