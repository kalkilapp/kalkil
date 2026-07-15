#!/usr/bin/env node
/**
 * Ronda 2 del fix de las 4 páginas hub /es/: texto en inglés que la ronda 1
 * (20-extract-hub-gaps.mjs / 21-patch-hub-gaps.mjs) no detectó porque no contenía
 * ninguna de las "hint words" usadas por la heurística — H1 completos, footer
 * compartido (idéntico en las 4 páginas), <option> de las calculadoras embebidas en
 * index.html, filter-tabs y etiquetas "N min read" en guides.html, <strong> de las
 * fact-card en about.html.
 *
 * A diferencia de la ronda 1 (heurística + walker), acá es un diccionario de
 * reemplazo EXACTO por string — más seguro dado que varias entradas son cortas
 * ("Home", "About") y una heurística de "palabra en inglés" daría demasiados falsos
 * positivos o negativos en textos tan breves.
 *
 * También corrige un bug funcional real encontrado en el camino: el footer de
 * es/about.html linkeaba "Top Guides" a /guides/<slug-ingles>.html (la versión EN)
 * en vez de /es/guides/<slug-espanol>.html — un lector en la página en español
 * terminaba en el artículo en inglés al hacer clic.
 *
 * Uso: node audit-fixes/22-patch-hub-dictionary.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const PAGES = ['index.html', 'tools.html', 'guides.html', 'about.html'];

// texto exacto (trim) -> traducción — aplica en cualquier página donde aparezca
const SHARED = {
  'Home': 'Inicio',
  'Tools': 'Herramientas',
  'Guides': 'Guías',
  'About': 'Sobre Nosotros',
  'Calculators': 'Calculadoras',
  'YouTube Calculator': 'Calculadora de YouTube',
  'TikTok Calculator': 'Calculadora de TikTok',
  'Spotify Calculator': 'Calculadora de Spotify',
  'Instagram Calculator': 'Calculadora de Instagram',
  'Twitch Calculator': 'Calculadora de Twitch',
  'All Calculators →': 'Todas las Calculadoras →',
  'All Guides →': 'Todas las Guías →',
  'Top Guides': 'Guías Destacadas',
  'YouTube Pay Per 1K Views': 'Pago de YouTube por 1K Vistas',
  'TikTok Pay Per View': 'Pago de TikTok por Vista',
  'Spotify Pay Per Stream': 'Pago de Spotify por Reproducción',
  'Instagram Rates': 'Tarifas de Instagram',
  'Creator Income Streams': 'Fuentes de Ingresos de Creadores',
  '· Free Creator Economy Calculators & Guides': '· Calculadoras y Guías Gratuitas de la Economía Creator',
  'Free creator earnings calculators and guides for YouTube, TikTok, Spotify, Instagram, Twitch, and more. No sign-up. No paywalls.':
    'Calculadoras y guías gratuitas de ganancias para creadores de YouTube, TikTok, Spotify, Instagram, Twitch y más. Sin registro. Sin muros de pago.',
  'Data updated for 2026 · No sign-up required': 'Datos actualizados para 2026 · Sin necesidad de registro',
  'Data updated': 'Datos actualizados',
  'Free calculators': 'Calculadoras gratuitas',
};
const PER_PAGE = {
  'index.html': {
    'YouTube Shorts Calculator': 'Calculadora de YouTube Shorts',
    'YouTube Shorts revenue vs. long-form comparison': 'Comparación de ingresos entre Shorts y contenido largo de YouTube',
    'YouTube brand sponsorship deal value by subscriber count': 'Valor de acuerdos de patrocinio de marca en YouTube según número de suscriptores',
    'TikTok Creator Rewards Program earnings by engagement rate': 'Ganancias del Programa de Recompensas para Creadores de TikTok según tasa de interacción',
    'Instagram engagement rate benchmarks by follower tier': 'Referencias de tasa de interacción en Instagram según nivel de seguidores',
    'Get new calculators & creator income data — monthly': 'Recibe nuevas calculadoras y datos de ingresos de creadores — cada mes',
    'No spam. Unsubscribe anytime.': 'Sin spam. Cancela cuando quieras.',
    'Subscribe': 'Suscribirme',
    // <option> de las 5 calculadoras embebidas en la home
    'Personal Finance ($20 CPM)': 'Finanzas Personales ($20 CPM)',
    'Tech & Software ($12 CPM)': 'Tecnología y Software ($12 CPM)',
    'Health & Wellness ($8 CPM)': 'Salud y Bienestar ($8 CPM)',
    'Education ($6 CPM)': 'Educación ($6 CPM)',
    'General ($4 CPM)': 'General ($4 CPM)',
    'Gaming ($3 CPM)': 'Videojuegos ($3 CPM)',
    'Entertainment / Vlogs ($2 CPM)': 'Entretenimiento / Vlogs ($2 CPM)',
    'US / Canada (Premium heavy)': 'EE. UU. / Canadá (mayoría Premium)',
    'Mixed Global Average': 'Promedio Global Mixto',
    'Europe (mixed tiers)': 'Europa (niveles mixtos)',
    'Latin America / SE Asia': 'Latinoamérica / Sudeste Asiático',
    'India / Free tier heavy': 'India (mayoría nivel gratuito)',
    'Low — under 3%': 'Baja — menos de 3%',
    'Average — 3–6%': 'Promedio — 3–6%',
    'High — 6–10%': 'Alta — 6–10%',
    'Viral — 10%+': 'Viral — 10%+',
    'Under 1% (low)': 'Menos de 1% (baja)',
    '1–3% (average)': '1–3% (promedio)',
    '3–6% (good)': '3–6% (buena)',
    '6–10% (excellent)': '6–10% (excelente)',
    '10%+ (top tier)': '10%+ (nivel máximo)',
    'Finance / Tech (premium)': 'Finanzas / Tecnología (premium)',
    'Fashion / Beauty / Fitness': 'Moda / Belleza / Fitness',
    'Lifestyle / Travel': 'Estilo de Vida / Viajes',
    'Entertainment / Comedy': 'Entretenimiento / Comedia',
  },
  'tools.html': {
    'Patreon & more': 'Patreon y más',
    'Browse All Guides →': 'Ver Todas las Guías →',
    'About Kalkil\'s Creator Calculators': 'Sobre las Calculadoras de Creadores de Kalkil',
    'Creator Rewards rate by engagement level': 'Tasa del Programa de Recompensas según nivel de interacción',
    'Originality & watch time impact modeled': 'Modela el impacto de la originalidad y el tiempo de reproducción',
  },
  'guides.html': {
    'All Guides': 'Todas las Guías',
    'Streaming / Music': 'Streaming / Música',
    'Creator Economy': 'Economía Creator',
    'Engagement Rate de Instagram Explicado': 'Tasa de Engagement de Instagram Explicada',
    'About These Creator Economy Guides': 'Sobre Estas Guías de la Economía Creator',
    ...Object.fromEntries([5, 6, 7, 8, 9, 10].map((n) => [`⏱ ${n} min read`, `⏱ ${n} min de lectura`])),
  },
  'about.html': {
    'Free Calculators →': 'Calculadoras Gratuitas →',
    'Creator economy guides': 'Guías de la economía creator',
    'Always free — no account, no paywall': 'Siempre gratis — sin cuenta, sin muro de pago',
    'Platform-specific, not one-size-fits-all': 'Específico por plataforma, no genérico',
    'Memberships · Income': 'Membresías · Ingresos',
    'Global creator economy (2026)': 'Economía creator global (2026)',
    'Content creators worldwide': 'Creadores de contenido en el mundo',
    'YouTube lifetime creator payouts': 'Pagos históricos de YouTube a creadores',
    'Spotify annual artist royalties': 'Regalías anuales de Spotify a artistas',
    'Creators earning full-time income': 'Creadores con ingresos de tiempo completo',
    'Including 50M+ who earn professional or semi-professional income through platforms.':
      'Incluyendo más de 50M que generan ingresos profesionales o semiprofesionales a través de plataformas.',
    'Explore All 14 Calculators →': 'Explora las 14 Calculadoras →',
    'Browse 30 Free Guides →': 'Explora las 30 Guías Gratuitas →',
  },
};

// H1 completos — se reemplaza el innerHTML directo en vez de por diccionario de texto
// porque "Calculators" (tools.html) y otras palabras del H1 colisionan con el mismo
// texto exacto usado en el footer/nav con una traducción distinta según el contexto
const H1_FIXES = {
  'tools.html': '<h1>Calculadoras Gratuitas<br>de <em>Ganancias</em> para Creadores</h1>',
  'about.html': '<h1>Haciendo Transparentes<br>los <em>Ingresos</em> de los Creadores</h1>',
  'guides.html': '<h1>Aprende Cómo los Creadores<br><em>Realmente</em> Ganan Dinero</h1>',
};

// bug funcional: el footer de about.html linkea a /guides/<slug-en>.html en vez de
// /es/guides/<slug-es>.html — se corrige el href al mismo tiempo que el texto
const ABOUT_GUIDE_HREF_FIX = {
  '/guides/how-much-does-youtube-pay-per-1000-views.html': '/es/guides/cuanto-paga-youtube-por-vistas.html',
  '/guides/how-much-does-tiktok-pay-per-view.html': '/es/guides/cuanto-paga-tiktok-por-vista.html',
  '/guides/average-spotify-pay-per-stream.html': '/es/guides/promedio-de-pago-de-spotify-por-reproduccion.html',
  '/guides/instagram-influencer-rates.html': '/es/guides/tarifas-de-influencers-en-instagram.html',
  '/guides/creator-income-streams.html': '/es/guides/fuentes-de-ingresos-para-creadores.html',
};

function isSkippable(el) {
  let node = el;
  while (node) {
    if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase();
      if (['script', 'style'].includes(tag)) return true;
    }
    node = node.parentNode;
  }
  return false;
}

for (const page of PAGES) {
  const abs = path.join(ROOT, 'es', page);
  const html = fs.readFileSync(abs, 'utf8');
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const dict = { ...SHARED, ...(PER_PAGE[page] || {}) };

  if (page === 'about.html') {
    doc.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (ABOUT_GUIDE_HREF_FIX[href]) a.setAttribute('href', ABOUT_GUIDE_HREF_FIX[href]);
    });
  }

  if (H1_FIXES[page]) {
    const h1 = doc.querySelector('h1');
    if (h1) h1.outerHTML = H1_FIXES[page];
  }

  const walker = doc.createTreeWalker(doc.body, dom.window.NodeFilter.SHOW_TEXT);
  let n;
  const toReplace = [];
  while ((n = walker.nextNode())) {
    if (isSkippable(n.parentNode)) continue;
    const text = n.textContent.trim();
    if (!text || !dict[text]) continue;
    toReplace.push(n);
  }
  let replaced = 0;
  for (const node of toReplace) {
    const text = node.textContent.trim();
    const translated = dict[text];
    const leading = node.textContent.match(/^\s*/)[0];
    const trailing = node.textContent.match(/\s*$/)[0];
    node.textContent = leading + translated + trailing;
    replaced++;
  }

  // <option> — el walker SHOW_TEXT no entra en <option> en todos los parsers; se
  // procesan aparte por si acaso, comparando textContent exacto
  let optReplaced = 0;
  doc.querySelectorAll('option').forEach((opt) => {
    const text = opt.textContent.trim();
    if (dict[text]) { opt.textContent = dict[text]; optReplaced++; }
  });

  const outHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`;
  fs.writeFileSync(abs, outHtml, 'utf8');
  console.log(`${page}: ${replaced} nodos de texto + ${optReplaced} <option> reemplazados`);
}
