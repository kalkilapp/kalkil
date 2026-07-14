#!/usr/bin/env node
/**
 * Inyecta Article schema (+ FAQPage schema cuando existe el patrón <div class="faq">)
 * y og:image en las 40 guías + 14 tools + home/tools.html/guides.html/about.html.
 *
 * Requiere haber corrido antes 01-fix-canonicals.sh (usa el <link rel="canonical">
 * ya corregido como "url" del schema).
 *
 * Parsea el HTML existente con regex simple (no hay build system ni parser DOM en
 * este proyecto — es HTML estático puro), así que el patrón .faq tiene que mantenerse
 * consistente para que esto siga funcionando en guías futuras.
 *
 * Uso:
 *   node audit-fixes/02-inject-schema.mjs           # aplica
 *   node audit-fixes/02-inject-schema.mjs --dry-run  # solo reporta
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const DRY_RUN = process.argv.includes('--dry-run');
const SITE = 'https://kalkilapp.com';
const OG_IMAGE = `${SITE}/assets/og-default.png`; // ver nota al final: este archivo NO existe todavía

function listHtmlFiles() {
  const files = [];
  for (const f of fs.readdirSync(ROOT)) {
    if (f.endsWith('.html') && f !== 'open index.html') files.push(f);
  }
  for (const dir of ['guides', 'tools']) {
    for (const f of fs.readdirSync(path.join(ROOT, dir))) {
      if (f.endsWith('.html')) files.push(path.join(dir, f));
    }
  }
  return files;
}

function extract(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function buildFaqSchema(html) {
  // Patrón A (2 guías): <div class="faq"><h3>Q</h3><p>A</p></div>
  const patternA = [...html.matchAll(/<div class="faq">\s*<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<\/div>/g)]
    .map(([, q, a]) => [q, a]);

  // Patrón B (30 guías): <div class="faq-item"><button class="faq-q">Q<span class="faq-icon">+</span></button><div class="faq-a">A</div></div>
  const patternB = [...html.matchAll(/<button class="faq-q"[^>]*>([\s\S]*?)<span class="faq-icon">[\s\S]*?<\/button>\s*<div class="faq-a">([\s\S]*?)<\/div>/g)]
    .map(([, q, a]) => [q, a]);

  const blocks = patternA.length ? patternA : patternB;
  if (blocks.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: blocks.map(([q, a]) => ({
      '@type': 'Question',
      name: decodeEntities(q.replace(/<[^>]+>/g, '').trim()),
      acceptedAnswer: {
        '@type': 'Answer',
        text: decodeEntities(a.replace(/<[^>]+>/g, '').trim()),
      },
    })),
  };
}

function buildArticleSchema(html, canonical) {
  const title = extract(html, /<title>([\s\S]*?)<\/title>/i);
  const desc = extract(html, /<meta name="description" content="([\s\S]*?)"\s*\/?>/i);
  const h1 = extract(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!title || !h1) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: decodeEntities(h1.replace(/<[^>]+>/g, '').trim()),
    description: desc ? decodeEntities(desc) : undefined,
    image: OG_IMAGE,
    author: { '@type': 'Organization', name: 'Kalkil' },
    publisher: {
      '@type': 'Organization',
      name: 'Kalkil',
      logo: { '@type': 'ImageObject', url: OG_IMAGE },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
  };
}

function processFile(rel) {
  const abs = path.join(ROOT, rel);
  let html = fs.readFileSync(abs, 'utf8');
  const isGuide = rel.startsWith('guides/') && rel !== 'guides/guide-style.css';
  const already = html.includes('application/ld+json');

  const canonicalMatch = html.match(/rel="canonical" href="([^"]+)"/);
  const canonical = canonicalMatch ? canonicalMatch[1] : `${SITE}/${rel}`;

  const schemas = [];
  if (isGuide) {
    const article = buildArticleSchema(html, canonical);
    if (article) schemas.push(article);
    const faq = buildFaqSchema(html);
    if (faq) schemas.push(faq);
  }

  let changed = false;
  const report = { file: rel, ogImageAdded: false, schemaAdded: [] };

  // og:image (todas las páginas, no solo guías)
  if (!/property="og:image"/.test(html)) {
    const ogTypeLine = html.match(/<meta property="og:type"[^>]*>\n?/);
    const insertion = `  <meta property="og:image" content="${OG_IMAGE}">\n  <meta property="og:image:width" content="1200">\n  <meta property="og:image:height" content="630">\n`;
    if (ogTypeLine) {
      html = html.replace(ogTypeLine[0], ogTypeLine[0] + insertion);
    } else {
      // fallback: después del viewport meta
      html = html.replace(/(<meta name="viewport"[^>]*>\n)/, `$1${insertion}`);
    }
    changed = true;
    report.ogImageAdded = true;
  }

  // JSON-LD (solo guías, solo si no existe ya alguno)
  if (schemas.length && !already) {
    const block = schemas
      .map((s) => `  <script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n  </script>`)
      .join('\n');
    html = html.replace('</head>', `${block}\n</head>`);
    changed = true;
    report.schemaAdded = schemas.map((s) => s['@type']);
  }

  if (changed && !DRY_RUN) fs.writeFileSync(abs, html, 'utf8');
  return report;
}

const files = listHtmlFiles();
const reports = files.map(processFile);

console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Procesados ${files.length} archivos\n`);
for (const r of reports) {
  if (r.ogImageAdded || r.schemaAdded.length) {
    console.log(`${r.file}: og:image=${r.ogImageAdded ? 'sí' : 'ya tenía'}${r.schemaAdded.length ? ', schema=' + r.schemaAdded.join('+') : ''}`);
  }
}

const guidesWithoutFaq = reports.filter((r) => r.file.startsWith('guides/') && !r.schemaAdded.includes('FAQPage'));
console.log(`\nGuías sin bloque .faq (solo Article schema, sin FAQPage): ${guidesWithoutFaq.length}`);
guidesWithoutFaq.forEach((r) => console.log(`  - ${r.file}`));

console.log(`\nIMPORTANTE: og:image apunta a ${OG_IMAGE} — ese archivo NO existe todavía en /assets.`);
console.log('Hay que subir una imagen 1200x630 real antes de que esto sirva para algo (ver sección 3 del reporte).');
