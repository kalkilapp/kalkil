#!/usr/bin/env node
/**
 * Ronda 2 del fix de las 4 páginas hub /fr/ — mismo patrón que
 * 22-patch-hub-dictionary.mjs (ES) pero en francés: texto en inglés que la ronda 1
 * (20/21 con --lang=fr) no detectó por tratarse de frases cortas sin "hint words" —
 * H1 completos, footer compartido, <option> de las calculadoras embebidas en
 * index.html, filter-tabs y "N min read" en guides.html, además de ~44 bullets de
 * features en tools.html que quedaron casi enteramente sin traducir (traducidos por
 * separado vía agente, ver tools-features-li.fr.json).
 *
 * También corrige el mismo bug funcional encontrado en la ronda ES: el footer de
 * fr/about.html linkeaba a /guides/<slug-ingles>.html en vez de
 * /fr/guides/<slug-frances>.html (usa fr-slug-map.json, ya generado para el rename
 * de guías francesas).
 *
 * Uso: node audit-fixes/28-patch-hub-dictionary-fr.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const PAGES = ['index.html', 'tools.html', 'guides.html', 'about.html'];
const FR_SLUG_MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', 'fr-slug-map.json'), 'utf8'));

const SHARED = {
  'Home': 'Accueil',
  'Tools': 'Outils',
  'Guides': 'Guides',
  'About': 'À Propos',
  'Calculators': 'Calculateurs',
  'YouTube Calculator': 'Calculateur YouTube',
  'TikTok Calculator': 'Calculateur TikTok',
  'Spotify Calculator': 'Calculateur Spotify',
  'Instagram Calculator': 'Calculateur Instagram',
  'Twitch Calculator': 'Calculateur Twitch',
  'All Calculators →': 'Tous les Calculateurs →',
  'All Guides →': 'Tous les Guides →',
  'Top Guides': 'Guides Principaux',
  'YouTube Pay Per 1K Views': 'Paiement YouTube par 1K Vues',
  'TikTok Pay Per View': 'Paiement TikTok par Vue',
  'Spotify Pay Per Stream': 'Paiement Spotify par Écoute',
  'Instagram Rates': 'Tarifs Instagram',
  'Creator Income Streams': 'Sources de Revenus des Créateurs',
  '· Free Creator Economy Calculators & Guides': '· Calculateurs et Guides Gratuits de l’Économie Créative',
  'Free creator earnings calculators and guides for YouTube, TikTok, Spotify, Instagram, Twitch, and more. No sign-up. No paywalls.':
    'Calculateurs et guides gratuits de revenus pour créateurs sur YouTube, TikTok, Spotify, Instagram, Twitch et plus. Sans inscription. Sans abonnement payant.',
  'Data updated for 2026 · No sign-up required': 'Données mises à jour pour 2026 · Sans inscription',
  'Data updated': 'Données mises à jour',
  'Free calculators': 'Calculateurs gratuits',
};

const PER_PAGE = {
  'index.html': {
    'YouTube Shorts Calculator': 'Calculateur YouTube Shorts',
    'YouTube brand sponsorship deal value by subscriber count': 'Valeur des accords de sponsoring YouTube selon le nombre d’abonnés',
    'TikTok Creator Rewards Program earnings by engagement rate': 'Revenus du programme Creator Rewards TikTok selon le taux d’engagement',
    'Instagram engagement rate benchmarks by follower tier': 'Références de taux d’engagement Instagram selon le nombre d’abonnés',
    'Get new calculators & creator income data — monthly': 'Recevez les nouveaux calculateurs et données de revenus créateurs — chaque mois',
    'No spam. Unsubscribe anytime.': 'Sans spam. Désabonnement à tout moment.',
    'Subscribe': 'S’abonner',
    'Personal Finance ($20 CPM)': 'Finance Personnelle ($20 CPM)',
    'Tech & Software ($12 CPM)': 'Tech et Logiciels ($12 CPM)',
    'Health & Wellness ($8 CPM)': 'Santé et Bien-être ($8 CPM)',
    'Education ($6 CPM)': 'Éducation ($6 CPM)',
    'General ($4 CPM)': 'Général ($4 CPM)',
    'Gaming ($3 CPM)': 'Gaming ($3 CPM)',
    'Entertainment / Vlogs ($2 CPM)': 'Divertissement / Vlogs ($2 CPM)',
    'US / Canada (Premium heavy)': 'États-Unis / Canada (majorité Premium)',
    'Mixed Global Average': 'Moyenne Mondiale Mixte',
    'Europe (mixed tiers)': 'Europe (niveaux mixtes)',
    'Latin America / SE Asia': 'Amérique Latine / Asie du Sud-Est',
    'India / Free tier heavy': 'Inde (majorité niveau gratuit)',
    'Low — under 3%': 'Faible — moins de 3 %',
    'Average — 3–6%': 'Moyen — 3–6 %',
    'High — 6–10%': 'Élevé — 6–10 %',
    'Viral — 10%+': 'Viral — 10 %+',
    'Under 1% (low)': 'Moins de 1 % (faible)',
    '1–3% (average)': '1–3 % (moyen)',
    '3–6% (good)': '3–6 % (bon)',
    '6–10% (excellent)': '6–10 % (excellent)',
    '10%+ (top tier)': '10 %+ (niveau maximal)',
    'Finance / Tech (premium)': 'Finance / Tech (premium)',
    'Fashion / Beauty / Fitness': 'Mode / Beauté / Fitness',
    'Lifestyle / Travel': 'Style de Vie / Voyage',
    'Entertainment / Comedy': 'Divertissement / Comédie',
  },
  'tools.html': {
    'Patreon & more': 'Patreon et plus',
    'Browse All Guides →': 'Voir Tous les Guides →',
    'About Kalkil\'s Creator Calculators': 'À Propos des Calculateurs Créateurs de Kalkil',
    'Earnings by niche (finance, gaming, lifestyle, tech)': 'Revenus par niche (finance, gaming, lifestyle, tech)',
  },
  'guides.html': {
    'All Guides': 'Tous les Guides',
    'Streaming / Music': 'Streaming / Musique',
    'Creator Economy': 'Économie Créative',
    'About These Creator Economy Guides': 'À Propos de Ces Guides de l’Économie Créative',
    ...Object.fromEntries([5, 6, 7, 8, 9, 10].map((n) => [`⏱ ${n} min read`, `⏱ ${n} min de lecture`])),
  },
  'about.html': {
    'Free Calculators →': 'Calculateurs Gratuits →',
    'Creator economy guides': 'Guides de l’économie créative',
    'Always free — no account, no paywall': 'Toujours gratuit — sans compte, sans abonnement payant',
    'Platform-specific, not one-size-fits-all': 'Spécifique à chaque plateforme, pas générique',
    'Memberships · Income': 'Adhésions · Revenus',
    'Global creator economy (2026)': 'Économie créative mondiale (2026)',
    'Content creators worldwide': 'Créateurs de contenu dans le monde',
    'YouTube lifetime creator payouts': 'Paiements cumulés de YouTube aux créateurs',
    'Spotify annual artist royalties': 'Redevances annuelles Spotify aux artistes',
    'Creators earning full-time income': 'Créateurs avec un revenu à temps plein',
    'Including 50M+ who earn professional or semi-professional income through platforms.':
      'Dont plus de 50 M qui génèrent un revenu professionnel ou semi-professionnel via les plateformes.',
    'Explore All 14 Calculators →': 'Explorer les 14 Calculateurs →',
    'Browse 30 Free Guides →': 'Explorer les 30 Guides Gratuits →',
  },
};

// H1 completos — reemplazo directo por selector, no por diccionario de texto, porque
// palabras como "Calculators" colisionan con el mismo texto usado en el footer con
// una traducción distinta según el contexto (mismo motivo que en la versión ES)
const H1_FIXES = {
  'tools.html': '<h1>Calculateurs Gratuits<br>de <em>Revenus</em> pour Créateurs</h1>',
  'about.html': '<h1>Rendre les <em>Revenus</em><br>des Créateurs Transparents</h1>',
  'guides.html': '<h1>Découvrez Comment les Créateurs<br><em>Gagnent Vraiment</em> de l’Argent</h1>',
};

// bug funcional: el footer de about.html linkea a /guides/<slug-en>.html en vez de
// /fr/guides/<slug-fr>.html
const ABOUT_GUIDE_HREF_FIX = {};
for (const [oldSlug, newSlug] of Object.entries(FR_SLUG_MAP)) {
  ABOUT_GUIDE_HREF_FIX[`/guides/${oldSlug}.html`] = `/fr/guides/${newSlug}.html`;
}

// bullets de card-features en tools.html — traducidos por separado vía agente
// (mucho más volumen que en la versión ES: 44 items casi enteramente en inglés)
const featuresEnPath = path.join(ROOT, 'audit-fixes', 'translations-hub', 'fr', 'tools-features-li.en.json');
const featuresFrPath = path.join(ROOT, 'audit-fixes', 'translations-hub', 'fr', 'tools-features-li.fr.json');
if (fs.existsSync(featuresEnPath) && fs.existsSync(featuresFrPath)) {
  const en = JSON.parse(fs.readFileSync(featuresEnPath, 'utf8'));
  const fr = JSON.parse(fs.readFileSync(featuresFrPath, 'utf8'));
  if (en.length !== fr.length) {
    console.log(`[WARN] tools-features-li: ${en.length} EN vs ${fr.length} FR — largos distintos, se ignoran`);
  } else {
    PER_PAGE['tools.html'] = { ...PER_PAGE['tools.html'] };
    en.forEach((text, i) => { PER_PAGE['tools.html'][text] = fr[i]; });
  }
} else {
  console.log('[WARN] no se encontró tools-features-li.fr.json — los bullets de features de tools.html quedan sin traducir en esta pasada');
}

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
  const abs = path.join(ROOT, 'fr', page);
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

  let optReplaced = 0;
  doc.querySelectorAll('option').forEach((opt) => {
    const text = opt.textContent.trim();
    if (dict[text]) { opt.textContent = dict[text]; optReplaced++; }
  });

  const outHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}\n`;
  fs.writeFileSync(abs, outHtml, 'utf8');
  console.log(`${page}: ${replaced} nodos de texto + ${optReplaced} <option> reemplazados`);
}
