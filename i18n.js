(function () {
  var SUPPORTED = ['en', 'es', 'pt', 'fr'];

  var T = {
    en: {
      'meta.title': 'Kalkil — Free Creator Earnings Calculators 2026 | YouTube, TikTok, Spotify & More',
      'meta.desc': 'Free creator earnings calculators for YouTube, TikTok, Spotify, Instagram, Twitch, Patreon and more. Instant estimates — no sign-up required.',
      'nav.home': 'Home', 'nav.tools': 'Tools', 'nav.guides': 'Guides', 'nav.about': 'About', 'nav.cta': 'All Calculators →',
      'hero.eyebrow': 'Free Creator Economy Tools — 2026',
      'hero.h1': 'Know Exactly What<br>Your Content Is <em>Worth</em>',
      'hero.sub': 'Instant earnings calculators for YouTube, TikTok, Spotify, Instagram, Twitch and more. Free, accurate, no sign-up.',
      'hero.btn1': 'Try the Calculator ↓', 'hero.btn2': 'Read the Guides →',
      'calc.label': 'Quick Calculator', 'calc.title': 'Creator Earnings Calculator',
      'calc.sub': 'Pick a platform, enter your numbers, get an instant estimate.',
      'yt.views': 'Monthly Views', 'yt.views.hint': 'Total views across all videos this month',
      'yt.cpm': 'Your CPM ($)', 'yt.cpm.hint': 'Avg: Finance $15 · Tech $8 · Gaming $3 · Vlogs $2',
      'yt.niche': 'Niche',
      'yt.res1': 'Monthly AdSense (RPM)', 'yt.note1': "After YouTube's 45% cut",
      'yt.res2': 'Annual Estimate', 'yt.note2': 'AdSense only · Add sponsorships for full picture',
      'yt.res3': 'Earnings per 1,000 views', 'yt.note3': 'Your estimated RPM', 'yt.link': 'Full YouTube Calculator →',
      'sp.streams': 'Monthly Streams', 'sp.streams.hint': 'Total Spotify streams across your catalog',
      'sp.market': 'Primary Listener Market',
      'sp.res1': 'Monthly Royalties', 'sp.note1': 'Before distributor fees',
      'sp.res2': 'Annual Estimate', 'sp.note2': 'Based on your current stream rate',
      'sp.res3': 'Per 1,000 Streams', 'sp.note3': 'Your effective rate', 'sp.link': 'Full Spotify Calculator →',
      'tt.views': 'Monthly Views', 'tt.followers': 'Followers',
      'tt.followers.hint': 'Used to estimate sponsorship potential', 'tt.eng': 'Engagement Rate (%)',
      'tt.res1': 'Creator Rewards (monthly)', 'tt.note1': "From TikTok's Creator Rewards Program",
      'tt.res2': 'Sponsorship Potential', 'tt.note2': 'Estimated per sponsored post',
      'tt.res3': 'Monthly Total Est.', 'tt.note3': 'Rewards + 2 sponsorships/month', 'tt.link': 'Full TikTok Calculator →',
      'ig.followers': 'Followers', 'ig.eng': 'Engagement Rate', 'ig.niche': 'Niche',
      'ig.res1': 'Feed Post Rate', 'ig.note1': 'Estimated per sponsored feed post',
      'ig.res2': 'Reel Rate', 'ig.note2': 'Reels earn ~30% more than feed posts',
      'ig.res3': 'Monthly (2 deals)', 'ig.note3': '2 sponsored posts per month', 'ig.link': 'Full Instagram Calculator →',
      'stats.calcs': 'Free calculators', 'stats.guides': 'Creator economy guides',
      'stats.platforms': 'Platforms covered', 'stats.updated': 'Data updated',
      'tools.label': 'Popular Tools', 'tools.h2': 'Creator Earnings Calculators', 'tools.all': 'See all 14 tools →',
      'card.open': 'Open Calculator →',
      'how.label': 'How It Works', 'how.h2': 'Instant Estimates in 3 Steps',
      'how.step1': 'Choose Your Platform',
      'how.step1.desc': "Select from YouTube, TikTok, Spotify, Instagram, Twitch, Patreon, or 8 other creator platforms. Each calculator is built specifically for that platform's payment model.",
      'how.step2': 'Enter Your Numbers',
      'how.step2.desc': 'Input your view count, stream count, follower count, or subscriber numbers. Adjust for your niche, audience geography, and engagement rate for a more accurate estimate.',
      'how.step3': 'Get Your Estimate',
      'how.step3.desc': 'See projected monthly and annual earnings instantly. Link directly to our guides for the context behind the numbers — so you know what levers to pull to earn more.',
      'guides.label': 'Learn More', 'guides.h2': 'Creator Economy Guides',
      'guides.all': 'See all 30 guides →', 'guides.read': 'Read Guide →',
      'footer.tagline': 'Free creator earnings calculators and guides for YouTube, TikTok, Spotify, Instagram, Twitch, and more. No sign-up. No paywalls.',
      'footer.col1': 'Calculators', 'footer.col2': 'Top Guides', 'footer.col3': 'Kalkil',
      'footer.all.calcs': 'All Calculators →', 'footer.all.guides': 'All Guides →',
      'footer.bottom': '© 2026 Kalkil · Free Creator Economy Calculators & Guides',
      'footer.bottom2': 'Data updated for 2026 · No sign-up required',
    },

    es: {
      'meta.title': 'Kalkil — Calculadoras Gratuitas de Ganancias para Creadores 2026 | YouTube, TikTok, Spotify',
      'meta.desc': 'Calculadoras gratuitas de ganancias para YouTube, TikTok, Spotify, Instagram, Twitch, Patreon y más. Estimaciones instantáneas — sin registro.',
      'nav.home': 'Inicio', 'nav.tools': 'Herramientas', 'nav.guides': 'Guías', 'nav.about': 'Sobre Nosotros', 'nav.cta': 'Todas las Calculadoras →',
      'hero.eyebrow': 'Herramientas Gratuitas para Creadores — 2026',
      'hero.h1': 'Sabe Exactamente Cuánto<br>Vale Tu Contenido',
      'hero.sub': 'Calculadoras de ganancias para YouTube, TikTok, Spotify, Instagram, Twitch y más. Gratis, precisas, sin registro.',
      'hero.btn1': 'Probar la Calculadora ↓', 'hero.btn2': 'Leer las Guías →',
      'calc.label': 'Calculadora Rápida', 'calc.title': 'Calculadora de Ganancias para Creadores',
      'calc.sub': 'Elige una plataforma, ingresa tus números y obtén una estimación instantánea.',
      'yt.views': 'Vistas Mensuales', 'yt.views.hint': 'Total de vistas de todos tus videos este mes',
      'yt.cpm': 'Tu CPM ($)', 'yt.cpm.hint': 'Promedio: Finanzas $15 · Tech $8 · Gaming $3 · Vlogs $2',
      'yt.niche': 'Nicho',
      'yt.res1': 'AdSense Mensual (RPM)', 'yt.note1': 'Después del 45% de YouTube',
      'yt.res2': 'Estimación Anual', 'yt.note2': 'Solo AdSense · Suma patrocinios para el total completo',
      'yt.res3': 'Ganancias por 1.000 vistas', 'yt.note3': 'Tu RPM estimado', 'yt.link': 'Calculadora Completa de YouTube →',
      'sp.streams': 'Streams Mensuales', 'sp.streams.hint': 'Total de streams de Spotify en tu catálogo',
      'sp.market': 'Mercado Principal de Oyentes',
      'sp.res1': 'Regalías Mensuales', 'sp.note1': 'Antes de las comisiones del distribuidor',
      'sp.res2': 'Estimación Anual', 'sp.note2': 'Basado en tu tasa de streams actual',
      'sp.res3': 'Por 1.000 Streams', 'sp.note3': 'Tu tarifa efectiva', 'sp.link': 'Calculadora Completa de Spotify →',
      'tt.views': 'Vistas Mensuales', 'tt.followers': 'Seguidores',
      'tt.followers.hint': 'Usado para estimar el potencial de patrocinio', 'tt.eng': 'Tasa de Engagement (%)',
      'tt.res1': 'Recompensas de Creadores (mensual)', 'tt.note1': 'Del Programa de Recompensas de TikTok',
      'tt.res2': 'Potencial de Patrocinio', 'tt.note2': 'Estimado por post patrocinado',
      'tt.res3': 'Total Mensual Est.', 'tt.note3': 'Recompensas + 2 patrocinios/mes', 'tt.link': 'Calculadora Completa de TikTok →',
      'ig.followers': 'Seguidores', 'ig.eng': 'Tasa de Engagement', 'ig.niche': 'Nicho',
      'ig.res1': 'Tarifa por Post en Feed', 'ig.note1': 'Estimado por post patrocinado en feed',
      'ig.res2': 'Tarifa por Reel', 'ig.note2': 'Los Reels ganan ~30% más que los posts en feed',
      'ig.res3': 'Mensual (2 acuerdos)', 'ig.note3': '2 posts patrocinados por mes', 'ig.link': 'Calculadora Completa de Instagram →',
      'stats.calcs': 'Calculadoras gratuitas', 'stats.guides': 'Guías de economía creativa',
      'stats.platforms': 'Plataformas cubiertas', 'stats.updated': 'Datos actualizados',
      'tools.label': 'Herramientas Populares', 'tools.h2': 'Calculadoras de Ganancias para Creadores', 'tools.all': 'Ver las 14 herramientas →',
      'card.open': 'Abrir Calculadora →',
      'how.label': 'Cómo Funciona', 'how.h2': 'Estimaciones al Instante en 3 Pasos',
      'how.step1': 'Elige Tu Plataforma',
      'how.step1.desc': 'Selecciona entre YouTube, TikTok, Spotify, Instagram, Twitch, Patreon u otras 8 plataformas. Cada calculadora está diseñada específicamente para el modelo de pago de esa plataforma.',
      'how.step2': 'Ingresa Tus Números',
      'how.step2.desc': 'Introduce tu número de vistas, streams, seguidores o suscriptores. Ajusta según tu nicho, geografía de tu audiencia y tasa de engagement para una estimación más precisa.',
      'how.step3': 'Obtén Tu Estimación',
      'how.step3.desc': 'Ve tus ganancias mensuales y anuales proyectadas al instante. Accede directamente a nuestras guías para entender el contexto detrás de los números.',
      'guides.label': 'Aprende Más', 'guides.h2': 'Guías de Economía para Creadores',
      'guides.all': 'Ver las 30 guías →', 'guides.read': 'Leer Guía →',
      'footer.tagline': 'Calculadoras gratuitas de ganancias y guías para YouTube, TikTok, Spotify, Instagram, Twitch y más. Sin registro. Sin paywalls.',
      'footer.col1': 'Calculadoras', 'footer.col2': 'Guías Principales', 'footer.col3': 'Kalkil',
      'footer.all.calcs': 'Todas las Calculadoras →', 'footer.all.guides': 'Todas las Guías →',
      'footer.bottom': '© 2026 Kalkil · Calculadoras y Guías Gratuitas para Creadores',
      'footer.bottom2': 'Datos actualizados para 2026 · Sin registro requerido',
    },

    pt: {
      'meta.title': 'Kalkil — Calculadoras Gratuitas de Ganhos para Criadores 2026 | YouTube, TikTok, Spotify',
      'meta.desc': 'Calculadoras gratuitas de ganhos para YouTube, TikTok, Spotify, Instagram, Twitch, Patreon e mais. Estimativas instantâneas — sem cadastro.',
      'nav.home': 'Início', 'nav.tools': 'Ferramentas', 'nav.guides': 'Guias', 'nav.about': 'Sobre', 'nav.cta': 'Todas as Calculadoras →',
      'hero.eyebrow': 'Ferramentas Gratuitas para Criadores — 2026',
      'hero.h1': 'Saiba Exatamente Quanto<br>Vale o Seu Conteúdo',
      'hero.sub': 'Calculadoras de ganhos para YouTube, TikTok, Spotify, Instagram, Twitch e mais. Gratuito, preciso, sem cadastro.',
      'hero.btn1': 'Usar a Calculadora ↓', 'hero.btn2': 'Ler os Guias →',
      'calc.label': 'Calculadora Rápida', 'calc.title': 'Calculadora de Ganhos para Criadores',
      'calc.sub': 'Escolha uma plataforma, insira seus números e obtenha uma estimativa instantânea.',
      'yt.views': 'Visualizações Mensais', 'yt.views.hint': 'Total de visualizações em todos os vídeos este mês',
      'yt.cpm': 'Seu CPM ($)', 'yt.cpm.hint': 'Média: Finanças $15 · Tech $8 · Games $3 · Vlogs $2',
      'yt.niche': 'Nicho',
      'yt.res1': 'AdSense Mensal (RPM)', 'yt.note1': 'Após 45% do YouTube',
      'yt.res2': 'Estimativa Anual', 'yt.note2': 'Apenas AdSense · Adicione patrocínios para o total',
      'yt.res3': 'Ganhos por 1.000 visualizações', 'yt.note3': 'Seu RPM estimado', 'yt.link': 'Calculadora Completa do YouTube →',
      'sp.streams': 'Streams Mensais', 'sp.streams.hint': 'Total de streams do Spotify no seu catálogo',
      'sp.market': 'Mercado Principal de Ouvintes',
      'sp.res1': 'Royalties Mensais', 'sp.note1': 'Antes das taxas do distribuidor',
      'sp.res2': 'Estimativa Anual', 'sp.note2': 'Com base na sua taxa de streams atual',
      'sp.res3': 'Por 1.000 Streams', 'sp.note3': 'Sua taxa efetiva', 'sp.link': 'Calculadora Completa do Spotify →',
      'tt.views': 'Visualizações Mensais', 'tt.followers': 'Seguidores',
      'tt.followers.hint': 'Usado para estimar o potencial de patrocínio', 'tt.eng': 'Taxa de Engajamento (%)',
      'tt.res1': 'Recompensas de Criadores (mensal)', 'tt.note1': 'Do Programa de Recompensas do TikTok',
      'tt.res2': 'Potencial de Patrocínio', 'tt.note2': 'Estimado por post patrocinado',
      'tt.res3': 'Total Mensal Est.', 'tt.note3': 'Recompensas + 2 patrocínios/mês', 'tt.link': 'Calculadora Completa do TikTok →',
      'ig.followers': 'Seguidores', 'ig.eng': 'Taxa de Engajamento', 'ig.niche': 'Nicho',
      'ig.res1': 'Taxa por Post no Feed', 'ig.note1': 'Estimado por post patrocinado no feed',
      'ig.res2': 'Taxa por Reel', 'ig.note2': 'Reels ganham ~30% a mais que posts no feed',
      'ig.res3': 'Mensal (2 acordos)', 'ig.note3': '2 posts patrocinados por mês', 'ig.link': 'Calculadora Completa do Instagram →',
      'stats.calcs': 'Calculadoras gratuitas', 'stats.guides': 'Guias de economia criativa',
      'stats.platforms': 'Plataformas cobertas', 'stats.updated': 'Dados atualizados',
      'tools.label': 'Ferramentas Populares', 'tools.h2': 'Calculadoras de Ganhos para Criadores', 'tools.all': 'Ver todas as 14 ferramentas →',
      'card.open': 'Abrir Calculadora →',
      'how.label': 'Como Funciona', 'how.h2': 'Estimativas Instantâneas em 3 Passos',
      'how.step1': 'Escolha Sua Plataforma',
      'how.step1.desc': 'Selecione entre YouTube, TikTok, Spotify, Instagram, Twitch, Patreon ou outras 8 plataformas. Cada calculadora foi desenvolvida especificamente para o modelo de pagamento daquela plataforma.',
      'how.step2': 'Insira Seus Números',
      'how.step2.desc': 'Digite sua contagem de visualizações, streams, seguidores ou inscritos. Ajuste para seu nicho, geografia da audiência e taxa de engajamento para uma estimativa mais precisa.',
      'how.step3': 'Obtenha Sua Estimativa',
      'how.step3.desc': 'Veja os ganhos mensais e anuais projetados instantaneamente. Acesse nossos guias para entender o contexto por trás dos números.',
      'guides.label': 'Saiba Mais', 'guides.h2': 'Guias de Economia Criativa',
      'guides.all': 'Ver todos os 30 guias →', 'guides.read': 'Ler Guia →',
      'footer.tagline': 'Calculadoras gratuitas de ganhos e guias para YouTube, TikTok, Spotify, Instagram, Twitch e mais. Sem cadastro. Sem paywall.',
      'footer.col1': 'Calculadoras', 'footer.col2': 'Guias Principais', 'footer.col3': 'Kalkil',
      'footer.all.calcs': 'Todas as Calculadoras →', 'footer.all.guides': 'Todos os Guias →',
      'footer.bottom': '© 2026 Kalkil · Calculadoras e Guias Gratuitos para Criadores',
      'footer.bottom2': 'Dados atualizados para 2026 · Sem cadastro necessário',
    },

    fr: {
      'meta.title': 'Kalkil — Calculateurs Gratuits de Revenus pour Créateurs 2026 | YouTube, TikTok, Spotify',
      'meta.desc': 'Calculateurs gratuits de revenus pour YouTube, TikTok, Spotify, Instagram, Twitch, Patreon et plus. Estimations instantanées — sans inscription.',
      'nav.home': 'Accueil', 'nav.tools': 'Outils', 'nav.guides': 'Guides', 'nav.about': 'À propos', 'nav.cta': 'Tous les Calculateurs →',
      'hero.eyebrow': 'Outils Gratuits pour Créateurs — 2026',
      'hero.h1': 'Sachez Exactement Combien<br>Vaut Votre Contenu',
      'hero.sub': 'Calculateurs de revenus pour YouTube, TikTok, Spotify, Instagram, Twitch et plus. Gratuit, précis, sans inscription.',
      'hero.btn1': 'Essayer le Calculateur ↓', 'hero.btn2': 'Lire les Guides →',
      'calc.label': 'Calculateur Rapide', 'calc.title': 'Calculateur de Revenus pour Créateurs',
      'calc.sub': 'Choisissez une plateforme, entrez vos chiffres et obtenez une estimation instantanée.',
      'yt.views': 'Vues Mensuelles', 'yt.views.hint': 'Total des vues sur toutes vos vidéos ce mois',
      'yt.cpm': 'Votre CPM ($)', 'yt.cpm.hint': 'Moy : Finance 15 $ · Tech 8 $ · Gaming 3 $ · Vlogs 2 $',
      'yt.niche': 'Niche',
      'yt.res1': 'AdSense Mensuel (RPM)', 'yt.note1': 'Après la part de 45 % de YouTube',
      'yt.res2': 'Estimation Annuelle', 'yt.note2': 'AdSense seulement · Ajoutez les sponsors pour le total',
      'yt.res3': 'Revenus par 1 000 vues', 'yt.note3': 'Votre RPM estimé', 'yt.link': 'Calculateur YouTube Complet →',
      'sp.streams': 'Streams Mensuels', 'sp.streams.hint': 'Total des streams Spotify sur votre catalogue',
      'sp.market': "Marché Principal d'Auditeurs",
      'sp.res1': 'Royalties Mensuelles', 'sp.note1': 'Avant les frais du distributeur',
      'sp.res2': 'Estimation Annuelle', 'sp.note2': 'Basé sur votre taux de streams actuel',
      'sp.res3': 'Par 1 000 Streams', 'sp.note3': 'Votre taux effectif', 'sp.link': 'Calculateur Spotify Complet →',
      'tt.views': 'Vues Mensuelles', 'tt.followers': 'Abonnés',
      'tt.followers.hint': 'Utilisé pour estimer le potentiel de sponsoring', 'tt.eng': "Taux d'Engagement (%)",
      'tt.res1': 'Récompenses Créateurs (mensuel)', 'tt.note1': 'Du Programme de Récompenses TikTok',
      'tt.res2': 'Potentiel de Sponsoring', 'tt.note2': 'Estimé par post sponsorisé',
      'tt.res3': 'Total Mensuel Est.', 'tt.note3': 'Récompenses + 2 sponsorings/mois', 'tt.link': 'Calculateur TikTok Complet →',
      'ig.followers': 'Abonnés', 'ig.eng': "Taux d'Engagement", 'ig.niche': 'Niche',
      'ig.res1': 'Tarif Post Feed', 'ig.note1': 'Estimé par post sponsorisé dans le feed',
      'ig.res2': 'Tarif Reel', 'ig.note2': 'Les Reels rapportent ~30% de plus que les posts',
      'ig.res3': 'Mensuel (2 deals)', 'ig.note3': '2 posts sponsorisés par mois', 'ig.link': 'Calculateur Instagram Complet →',
      'stats.calcs': 'Calculateurs gratuits', 'stats.guides': 'Guides économie créative',
      'stats.platforms': 'Plateformes couvertes', 'stats.updated': 'Données mises à jour',
      'tools.label': 'Outils Populaires', 'tools.h2': 'Calculateurs de Revenus pour Créateurs', 'tools.all': 'Voir les 14 outils →',
      'card.open': 'Ouvrir le Calculateur →',
      'how.label': 'Comment Ça Marche', 'how.h2': 'Estimations Instantanées en 3 Étapes',
      'how.step1': 'Choisissez Votre Plateforme',
      'how.step1.desc': "Choisissez parmi YouTube, TikTok, Spotify, Instagram, Twitch, Patreon ou 8 autres plateformes créateurs. Chaque calculateur est conçu spécifiquement pour le modèle de paiement de cette plateforme.",
      'how.step2': 'Entrez Vos Chiffres',
      'how.step2.desc': "Saisissez votre nombre de vues, streams, abonnés ou inscrits. Ajustez pour votre niche, la géographie de votre audience et votre taux d'engagement pour une estimation plus précise.",
      'how.step3': 'Obtenez Votre Estimation',
      'how.step3.desc': 'Consultez vos revenus mensuels et annuels projetés instantanément. Accédez directement à nos guides pour comprendre le contexte derrière les chiffres.',
      'guides.label': 'En Savoir Plus', 'guides.h2': 'Guides Économie Créative',
      'guides.all': 'Voir tous les 30 guides →', 'guides.read': 'Lire le Guide →',
      'footer.tagline': 'Calculateurs gratuits de revenus et guides pour YouTube, TikTok, Spotify, Instagram, Twitch et plus. Sans inscription. Sans paywall.',
      'footer.col1': 'Calculateurs', 'footer.col2': 'Guides Principaux', 'footer.col3': 'Kalkil',
      'footer.all.calcs': 'Tous les Calculateurs →', 'footer.all.guides': 'Tous les Guides →',
      'footer.bottom': '© 2026 Kalkil · Calculateurs et Guides Gratuits pour Créateurs',
      'footer.bottom2': 'Données mises à jour pour 2026 · Sans inscription requise',
    }
  };

  var currentLang = 'en';

  // Nav link texts to auto-translate (no data-i18n needed on individual pages)
  var NAV_MAP = {
    'Home': 'nav.home', 'Inicio': 'nav.home', 'Início': 'nav.home', 'Accueil': 'nav.home',
    'Tools': 'nav.tools', 'Herramientas': 'nav.tools', 'Ferramentas': 'nav.tools', 'Outils': 'nav.tools',
    'Guides': 'nav.guides', 'Guías': 'nav.guides', 'Guias': 'nav.guides',
    'About': 'nav.about', 'Sobre Nosotros': 'nav.about', 'Sobre': 'nav.about', 'À propos': 'nav.about',
    'All Calculators': 'nav.cta', 'All Calculators →': 'nav.cta',
    'Read Guides': 'guides.label', 'Read Guides →': 'guides.label',
  };

  function detect() {
    var p = new URLSearchParams(window.location.search).get('lang');
    if (p && SUPPORTED.indexOf(p) !== -1) { _save(p); return p; }
    var s; try { s = localStorage.getItem('kalkil-lang'); } catch(e) {}
    if (s && SUPPORTED.indexOf(s) !== -1) return s;
    var b = ((navigator.language || navigator.userLanguage || '').slice(0, 2)).toLowerCase();
    if (SUPPORTED.indexOf(b) !== -1) { _save(b); return b; }
    return 'en';
  }

  function _save(l) { try { localStorage.setItem('kalkil-lang', l); } catch(e) {} }

  function injectCSS() {
    if (document.getElementById('kalkil-i18n-css')) return;
    var s = document.createElement('style');
    s.id = 'kalkil-i18n-css';
    s.textContent = '#lang-switcher{display:flex;gap:2px;align-items:center}' +
      '.lang-btn{background:transparent;color:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.15);' +
      'border-radius:6px;padding:3px 7px;font-size:11px;font-weight:700;cursor:pointer;' +
      'font-family:inherit;letter-spacing:0.3px;transition:all .15s}' +
      '.lang-btn.lang-active{background:#22c55e;color:white;border-color:#22c55e}' +
      '.lang-btn:hover:not(.lang-active){color:white;border-color:rgba(255,255,255,0.4)}';
    document.head.appendChild(s);
  }

  function injectSwitcherIntoNav() {
    // If #lang-switcher already exists in HTML, skip
    if (document.getElementById('lang-switcher')) return;
    var navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    var div = document.createElement('div');
    div.id = 'lang-switcher';
    // Insert before the last link (nav-cta)
    var lastLink = navLinks.querySelector('a:last-child, a.nav-cta');
    if (lastLink) navLinks.insertBefore(div, lastLink);
    else navLinks.appendChild(div);
  }

  function apply(lang) {
    var t = T[lang];
    if (!t) return;
    // data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });
    // Auto-translate nav links by their text content
    document.querySelectorAll('.nav-links a').forEach(function(a) {
      var txt = a.textContent.trim();
      var key = NAV_MAP[txt];
      if (key && t[key]) a.textContent = t[key];
    });
    if (t['meta.title']) document.title = t['meta.title'];
    var descEl = document.querySelector('meta[name="description"]');
    if (descEl && t['meta.desc']) descEl.setAttribute('content', t['meta.desc']);
    document.documentElement.setAttribute('lang', lang);
    var url = new URL(window.location.href);
    if (lang === 'en') url.searchParams.delete('lang');
    else url.searchParams.set('lang', lang);
    history.replaceState({}, '', url.toString());
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
      btn.classList.toggle('lang-active', btn.getAttribute('data-lang') === lang);
    });
    _save(lang);
    currentLang = lang;
  }

  function renderSwitcher() {
    var cont = document.getElementById('lang-switcher');
    if (!cont) return;
    var flags = { en: '🇺🇸', es: '🇪🇸', pt: '🇧🇷', fr: '🇫🇷' };
    cont.innerHTML = SUPPORTED.map(function(l) {
      return '<button class="lang-btn' + (l === currentLang ? ' lang-active' : '') +
        '" data-lang="' + l + '" title="' + flags[l] + '">' + l.toUpperCase() + '</button>';
    }).join('');
    cont.addEventListener('click', function(e) {
      var btn = e.target.closest ? e.target.closest('.lang-btn') : (e.target.classList.contains('lang-btn') ? e.target : null);
      if (btn) apply(btn.getAttribute('data-lang'));
    });
  }

  function init() {
    injectCSS();
    injectSwitcherIntoNav();
    renderSwitcher();
    apply(currentLang);
  }

  currentLang = detect();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
