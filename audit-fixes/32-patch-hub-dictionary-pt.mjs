#!/usr/bin/env node
/**
 * Ronda 2 del fix de las 4 páginas hub /pt/ — mismo patrón que
 * 22-patch-hub-dictionary.mjs (ES) y 28-patch-hub-dictionary-fr.mjs (FR): texto en
 * inglés que la ronda 1 no detectó por tratarse de frases cortas sin "hint words" —
 * H1 completos, footer compartido, <option> de las calculadoras embebidas en
 * index.html, filter-tabs y "N min read" en guides.html, y los ~42 bullets de
 * features en tools.html (traducidos por separado vía agente, mismo texto en inglés
 * que en la versión FR — ver tools-features-li.pt.json).
 *
 * También corrige el mismo bug funcional visto en ES y FR: el footer de
 * pt/about.html linkeaba a /guides/<slug-ingles>.html en vez de
 * /pt/guides/<slug-portugues>.html (usa pt-slug-map.json).
 *
 * Uso: node audit-fixes/32-patch-hub-dictionary-pt.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');
const PAGES = ['index.html', 'tools.html', 'guides.html', 'about.html'];
const PT_SLUG_MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'audit-fixes', 'pt-slug-map.json'), 'utf8'));

const SHARED = {
  'Home': 'Início',
  'Tools': 'Ferramentas',
  'Guides': 'Guias',
  'About': 'Sobre',
  'Calculators': 'Calculadoras',
  'YouTube Calculator': 'Calculadora do YouTube',
  'TikTok Calculator': 'Calculadora do TikTok',
  'Spotify Calculator': 'Calculadora do Spotify',
  'Instagram Calculator': 'Calculadora do Instagram',
  'Twitch Calculator': 'Calculadora da Twitch',
  'All Calculators →': 'Todas as Calculadoras →',
  'All Guides →': 'Todos os Guias →',
  'Top Guides': 'Principais Guias',
  'YouTube Pay Per 1K Views': 'Pagamento do YouTube por 1K Visualizações',
  'TikTok Pay Per View': 'Pagamento do TikTok por Visualização',
  'Spotify Pay Per Stream': 'Pagamento do Spotify por Reprodução',
  'Instagram Rates': 'Tarifas do Instagram',
  'Creator Income Streams': 'Fontes de Renda dos Criadores',
  '· Free Creator Economy Calculators & Guides': '· Calculadoras e Guias Gratuitos da Economia Criativa',
  'Free creator earnings calculators and guides for YouTube, TikTok, Spotify, Instagram, Twitch, and more. No sign-up. No paywalls.':
    'Calculadoras e guias gratuitos de ganhos para criadores no YouTube, TikTok, Spotify, Instagram, Twitch e mais. Sem cadastro. Sem assinatura paga.',
  'Data updated for 2026 · No sign-up required': 'Dados atualizados para 2026 · Sem necessidade de cadastro',
  'Data updated': 'Dados atualizados',
  'Free calculators': 'Calculadoras gratuitas',
};

const PER_PAGE = {
  'index.html': {
    'YouTube Shorts Calculator': 'Calculadora do YouTube Shorts',
    'YouTube brand sponsorship deal value by subscriber count': 'Valor de acordos de patrocínio no YouTube por número de inscritos',
    'TikTok Creator Rewards Program earnings by engagement rate': 'Ganhos do programa Creator Rewards do TikTok por taxa de engajamento',
    'Instagram engagement rate benchmarks by follower tier': 'Referências de taxa de engajamento do Instagram por número de seguidores',
    'Get new calculators & creator income data — monthly': 'Receba novas calculadoras e dados de renda de criadores — todo mês',
    'No spam. Unsubscribe anytime.': 'Sem spam. Cancele quando quiser.',
    'Subscribe': 'Inscrever-se',
    'Personal Finance ($20 CPM)': 'Finanças Pessoais ($20 CPM)',
    'Tech & Software ($12 CPM)': 'Tecnologia e Software ($12 CPM)',
    'Health & Wellness ($8 CPM)': 'Saúde e Bem-estar ($8 CPM)',
    'Education ($6 CPM)': 'Educação ($6 CPM)',
    'General ($4 CPM)': 'Geral ($4 CPM)',
    'Gaming ($3 CPM)': 'Games ($3 CPM)',
    'Entertainment / Vlogs ($2 CPM)': 'Entretenimento / Vlogs ($2 CPM)',
    'US / Canada (Premium heavy)': 'EUA / Canadá (maioria Premium)',
    'Mixed Global Average': 'Média Global Mista',
    'Europe (mixed tiers)': 'Europa (níveis mistos)',
    'Latin America / SE Asia': 'América Latina / Sudeste Asiático',
    'India / Free tier heavy': 'Índia (maioria nível gratuito)',
    'Low — under 3%': 'Baixa — menos de 3%',
    'Average — 3–6%': 'Média — 3–6%',
    'High — 6–10%': 'Alta — 6–10%',
    'Viral — 10%+': 'Viral — 10%+',
    'Under 1% (low)': 'Menos de 1% (baixa)',
    '1–3% (average)': '1–3% (média)',
    '3–6% (good)': '3–6% (boa)',
    '6–10% (excellent)': '6–10% (excelente)',
    '10%+ (top tier)': '10%+ (nível máximo)',
    'Finance / Tech (premium)': 'Finanças / Tecnologia (premium)',
    'Fashion / Beauty / Fitness': 'Moda / Beleza / Fitness',
    'Lifestyle / Travel': 'Estilo de Vida / Viagem',
    'Entertainment / Comedy': 'Entretenimento / Comédia',
  },
  'tools.html': {
    'Patreon & more': 'Patreon e mais',
    'Browse All Guides →': 'Ver Todos os Guias →',
    'About Kalkil\'s Creator Calculators': 'Sobre as Calculadoras de Criadores da Kalkil',
    'Earnings by niche (finance, gaming, lifestyle, tech)': 'Ganhos por nicho (finanças, games, lifestyle, tech)',
  },
  'guides.html': {
    'All Guides': 'Todos os Guias',
    'Streaming / Music': 'Streaming / Música',
    'Creator Economy': 'Economia Criativa',
    'About These Creator Economy Guides': 'Sobre Estes Guias da Economia Criativa',
    ...Object.fromEntries([5, 6, 7, 8, 9, 10].map((n) => [`⏱ ${n} min read`, `⏱ ${n} min de leitura`])),
  },
  'about.html': {
    'Free Calculators →': 'Calculadoras Gratuitas →',
    'Creator economy guides': 'Guias da economia criativa',
    'Always free — no account, no paywall': 'Sempre gratuito — sem conta, sem assinatura paga',
    'Platform-specific, not one-size-fits-all': 'Específico por plataforma, não genérico',
    'Memberships · Income': 'Assinaturas · Renda',
    'Global creator economy (2026)': 'Economia criativa global (2026)',
    'Content creators worldwide': 'Criadores de conteúdo no mundo',
    'YouTube lifetime creator payouts': 'Pagamentos acumulados do YouTube a criadores',
    'Spotify annual artist royalties': 'Royalties anuais do Spotify a artistas',
    'Creators earning full-time income': 'Criadores com renda em tempo integral',
    'Including 50M+ who earn professional or semi-professional income through platforms.':
      'Incluindo mais de 50 milhões que geram renda profissional ou semiprofissional por meio de plataformas.',
    'Explore All 14 Calculators →': 'Explore as 14 Calculadoras →',
    'Browse 30 Free Guides →': 'Explore os 30 Guias Gratuitos →',
  },
};

const H1_FIXES = {
  'tools.html': '<h1>Calculadoras Gratuitas<br>de <em>Ganhos</em> para Criadores</h1>',
  'about.html': '<h1>Tornando os <em>Ganhos</em><br>dos Criadores Transparentes</h1>',
  'guides.html': '<h1>Descubra Como os Criadores<br><em>Realmente</em> Ganham Dinheiro</h1>',
};

const ABOUT_GUIDE_HREF_FIX = {};
for (const [oldSlug, newSlug] of Object.entries(PT_SLUG_MAP)) {
  ABOUT_GUIDE_HREF_FIX[`/guides/${oldSlug}.html`] = `/pt/guides/${newSlug}.html`;
}

const featuresEnPath = path.join(ROOT, 'audit-fixes', 'translations-hub', 'pt', 'tools-features-li.en.json');
const featuresPtPath = path.join(ROOT, 'audit-fixes', 'translations-hub', 'pt', 'tools-features-li.pt.json');
if (fs.existsSync(featuresEnPath) && fs.existsSync(featuresPtPath)) {
  const en = JSON.parse(fs.readFileSync(featuresEnPath, 'utf8'));
  const pt = JSON.parse(fs.readFileSync(featuresPtPath, 'utf8'));
  if (en.length !== pt.length) {
    console.log(`[WARN] tools-features-li: ${en.length} EN vs ${pt.length} PT — largos distintos, se ignoran`);
  } else {
    PER_PAGE['tools.html'] = { ...PER_PAGE['tools.html'] };
    en.forEach((text, i) => { PER_PAGE['tools.html'][text] = pt[i]; });
  }
} else {
  console.log('[WARN] no se encontró tools-features-li.pt.json — los bullets de features de tools.html quedan sin traducir en esta pasada');
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
  const abs = path.join(ROOT, 'pt', page);
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
