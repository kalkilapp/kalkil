#!/usr/bin/env node
/**
 * Agrega structured data SoftwareApplication (schema.org) a las 56 calculadoras
 * (14 × en/es/pt/fr) — hoy tienen 0% de cobertura, confirmado con grep antes de
 * escribir este script. Google usa este marcado para mostrar rich results (ej. "Gratis"
 * como badge en el resultado de búsqueda) en herramientas web.
 *
 * Todos los campos salen del HTML real de cada página — nada inventado:
 *   - name: el <h1> sin las etiquetas (ya es el título limpio de cada calculadora)
 *   - description: la <meta name="description"> que ya existe, única por página
 *   - url: el <link rel="canonical"> que ya existe
 *   - inLanguage: el <html lang="...">
 *
 * NO incluye aggregateRating/review — Google penaliza (manual action) el structured
 * data de reseñas fabricadas o no verificables, y acá no hay datos de rating reales.
 * Si en el futuro se suma un sistema de reseñas de verdad, se puede agregar aparte.
 *
 * applicationCategory: "FinanceApplication" — es el valor de la lista cerrada que
 * usa Google (https://developers.google.com/search/docs/appearance/structured-data/software-app)
 * más preciso para una calculadora de ingresos, mejor que "UtilitiesApplication".
 *
 * offers: price 0 — las 14 calculadoras son gratuitas, sin registro, confirmado en
 * el propio contenido de cada página ("Free · No sign-up" / "Gratis · Sin registro").
 *
 * Uso: node audit-fixes/35-add-tool-schema.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const LANG_DIRS = ['tools', 'es/tools', 'pt/tools', 'fr/tools'];
const MARKER = 'kalkil-schema-softwareapp';

function walk(dir) {
  return fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.html')).map((f) => path.join(dir, f));
}

let added = 0;
let skippedAlready = 0;

for (const dir of LANG_DIRS) {
  for (const rel of walk(dir)) {
    const abs = path.join(ROOT, rel);
    const html = fs.readFileSync(abs, 'utf8');
    if (html.includes(MARKER)) { skippedAlready++; continue; }

    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const h1 = doc.querySelector('h1');
    const name = h1 ? h1.textContent.replace(/\s+/g, ' ').trim() : null;
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    const url = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
    const lang = doc.documentElement.getAttribute('lang') || 'en';

    if (!name || !description || !url) {
      console.log(`[WARN] ${rel}: falta name/description/url, se salta`);
      continue;
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name,
      description,
      url,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      inLanguage: lang,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Kalkil',
      },
    };

    const scriptTag = `  <script type="application/ld+json" data-${MARKER}>\n${JSON.stringify(schema, null, 2)}\n  </script>\n`;
    const headCloseIdx = html.indexOf('</head>');
    if (headCloseIdx === -1) { console.log(`[WARN] ${rel}: no tiene </head>, se salta`); continue; }
    const out = html.slice(0, headCloseIdx) + scriptTag + html.slice(headCloseIdx);
    fs.writeFileSync(abs, out, 'utf8');
    added++;
  }
}

console.log(`${added} páginas con SoftwareApplication agregado`);
console.log(`${skippedAlready} páginas ya lo tenían (sin cambios)`);
