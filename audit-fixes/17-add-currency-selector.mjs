#!/usr/bin/env node
/**
 * Agrega el selector de moneda a las 13 calculadoras que muestran resultados en dinero
 * (excluye instagram-engagement-calculator: sus resultados son %, no hay nada que convertir).
 *
 * Por archivo:
 *   1. <script src="/currency.js"> en el head
 *   2. <div id="currency-selector"> antes de .results
 *   3. fmt(n) pasa a usar KalkilCurrency.format(n) en vez de "$"+n hardcodeado
 *   4. KalkilCurrency.renderSelector(...) + onChange(calc) al final del script inline,
 *      para que cambiar de moneda re-dispare el cálculo con los inputs actuales
 *
 * Corre esto ANTES de 15-assemble-tools-translations.mjs — el pipeline de traducción
 * lee el HTML en inglés como fuente, así que el selector y el fmt() nuevo se propagan
 * solos a es/pt/fr sin tocar esos archivos a mano.
 *
 * Uso: node audit-fixes/17-add-currency-selector.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const SKIP = new Set(['instagram-engagement-calculator.html']);

const OLD_FMT = "function fmt(n){if(n>=1000000)return'$'+(n/1000000).toFixed(2)+'M';if(n>=1000)return'$'+Math.round(n).toLocaleString();return'$'+n.toFixed(2);}";
const NEW_FMT = "function fmt(n){return window.KalkilCurrency ? window.KalkilCurrency.format(n) : '$'+n.toFixed(2);}";

let updated = 0;
for (const f of fs.readdirSync(path.join(ROOT, 'tools')).filter((f) => f.endsWith('.html'))) {
  if (SKIP.has(f)) continue;
  const abs = path.join(ROOT, 'tools', f);
  let html = fs.readFileSync(abs, 'utf8');

  if (html.includes('currency.js')) { console.log(`[SKIP] ${f} ya tiene currency.js`); continue; }
  if (!html.includes(OLD_FMT)) { console.log(`[WARN] ${f} — fmt() no coincide con el patrón esperado, revisar a mano`); continue; }

  html = html.replace('</head>', '  <script src="/currency.js"></script>\n</head>');
  html = html.replace('<div class="results">', '<div id="currency-selector" class="currency-selector"></div>\n    <div class="results">');
  // función como reemplazo: evita que "$'" dentro de NEW_FMT se interprete como
  // patrón especial de String.replace() (bug real que truncó fmt() en la primera pasada)
  html = html.replace(OLD_FMT, () => NEW_FMT);

  // dispara render del selector + recalculo cuando cambia la moneda, al final del
  // <script> inline de la calculadora (justo antes del </script> que sigue a reset())
  // reset() vive en una sola línea (confirmado en las 14 tools) — [^}]* cortaba en el
  // primer "}" de los forEach anidados adentro, nunca llegaba al cierre real de reset()
  html = html.replace(
    /(function reset\(\)\{[^\n]*\}\n)(\s*<\/script>)/,
    (_, before, after) =>
      `${before}    if (window.KalkilCurrency) {\n      window.KalkilCurrency.renderSelector('currency-selector');\n      window.KalkilCurrency.onChange(calc);\n    }\n${after}`
  );

  fs.writeFileSync(abs, html, 'utf8');
  updated++;
  console.log(`[OK] ${f}`);
}

console.log(`\n${updated} calculadoras actualizadas con selector de moneda`);
