(function () {
  var SUPPORTED = ['en', 'es', 'pt', 'fr'];

  /* ─────────────────────────────────────────
     TRANSLATION KEYS (home page data-i18n)
  ───────────────────────────────────────── */
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
      'yt.res2': 'Estimación Anual', 'yt.note2': 'Solo AdSense · Suma patrocinios para el total',
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
      'how.step1.desc': 'Selecciona entre YouTube, TikTok, Spotify, Instagram, Twitch, Patreon u otras 8 plataformas. Cada calculadora está diseñada para el modelo de pago de esa plataforma.',
      'how.step2': 'Ingresa Tus Números',
      'how.step2.desc': 'Introduce tu número de vistas, streams, seguidores o suscriptores. Ajusta según tu nicho, geografía de tu audiencia y tasa de engagement.',
      'how.step3': 'Obtén Tu Estimación',
      'how.step3.desc': 'Ve tus ganancias mensuales y anuales proyectadas al instante. Accede a nuestras guías para entender el contexto detrás de los números.',
      'guides.label': 'Aprende Más', 'guides.h2': 'Guías de Economía para Creadores',
      'guides.all': 'Ver las 30 guías →', 'guides.read': 'Leer Guía →',
      'footer.tagline': 'Calculadoras gratuitas de ganancias y guías para YouTube, TikTok, Spotify, Instagram, Twitch y más. Sin registro. Sin paywalls.',
      'footer.col1': 'Calculadoras', 'footer.col2': 'Guías Principales', 'footer.col3': 'Kalkil',
      'footer.all.calcs': 'Todas las Calculadoras →', 'footer.all.guides': 'Todas las Guías →',
      'footer.bottom': '© 2026 Kalkil · Calculadoras y Guías Gratuitas para Creadores',
      'footer.bottom2': 'Datos actualizados para 2026 · Sin registro requerido',

      /* ── textMap: auto-translate page content by matching English text ── */
      _textMap: {
        /* tools.html — hero */
        '2026 Creator Economy Tools': 'Herramientas para Creadores 2026',
        'Instant, accurate earnings estimates for every major creator platform — no sign-up, no paywalls, no guesswork.': 'Estimaciones precisas e instantáneas para todas las plataformas — sin registro, sin paywalls.',
        /* tools.html — filter tabs (text nodes) */
        'All Tools': 'Todas', 'YouTube': 'YouTube', 'TikTok & Instagram': 'TikTok e Instagram',
        'Streaming': 'Streaming', 'Creator Economy': 'Economía Creativa',
        /* tools.html — categories */
        'YouTube Calculators': 'Calculadoras de YouTube',
        'Estimate AdSense earnings, CPM rates, Shorts revenue, and sponsorship potential.': 'Estima ganancias de AdSense, CPM, ingresos de Shorts y potencial de patrocinio.',
        '4 tools': '4 herramientas',
        'TikTok & Instagram Calculators': 'Calculadoras de TikTok e Instagram',
        'Creator Rewards estimates, influencer sponsorship rates, and engagement benchmarks.': 'Estimaciones de Creator Rewards, tarifas de patrocinio y métricas de engagement.',
        'Streaming & Music Calculator': 'Calculadora de Streaming y Música',
        'Spotify royalty estimates for independent artists and labels.': 'Estimaciones de regalías de Spotify para artistas independientes.',
        '1 tool': '1 herramienta',
        'Creator Economy Tools': 'Herramientas de Economía Creativa',
        'Twitch subscriptions, Patreon memberships, podcast CPM, influencer rates, and OnlyFans income.': 'Suscripciones Twitch, membresías Patreon, CPM de podcast, tarifas de influencers e ingresos de OnlyFans.',
        '5 tools': '5 herramientas',
        /* tools.html — card badges */
        'YouTube · Most Used': 'YouTube · Más Usado',
        'TikTok · Most Used': 'TikTok · Más Usado',
        'Spotify · Featured': 'Spotify · Destacado',
        'Creator Economy · Most Used': 'Economía Creativa · Más Usado',
        /* tools.html — card titles (all 14) */
        'YouTube Money Calculator': 'Calculadora de Ganancias de YouTube',
        'YouTube CPM Calculator': 'Calculadora de CPM de YouTube',
        'YouTube Shorts Earnings Calculator': 'Calculadora de Ganancias de YouTube Shorts',
        'YouTube Sponsorship Calculator': 'Calculadora de Patrocinios de YouTube',
        'TikTok Money Calculator': 'Calculadora de Ganancias de TikTok',
        'TikTok Creator Fund Calculator': 'Calculadora del Creator Fund de TikTok',
        'Instagram Earnings Calculator': 'Calculadora de Ganancias de Instagram',
        'Instagram Engagement Rate Calculator': 'Calculadora de Engagement de Instagram',
        'Spotify Royalty Calculator': 'Calculadora de Regalías de Spotify',
        'Influencer Rate Calculator': 'Calculadora de Tarifas para Influencers',
        'Twitch Earnings Calculator': 'Calculadora de Ganancias de Twitch',
        'Podcast Revenue Calculator': 'Calculadora de Ingresos de Podcast',
        'Patreon Income Calculator': 'Calculadora de Ingresos de Patreon',
        'OnlyFans Earnings Calculator': 'Calculadora de Ganancias de OnlyFans',
        /* tools.html — card descriptions (featured) */
        "The most comprehensive YouTube earnings estimator. Input your view count and niche CPM to instantly see projected AdSense revenue — monthly, annual, and per video. Includes RPM breakdown so you understand what you're actually keeping.": 'La calculadora de YouTube más completa para creadores LATAM. Ingresa tus vistas y CPM de nicho para proyecciones de AdSense al instante — mensual, anual y por video. Incluye desglose de RPM.',
        "Estimate your total TikTok income — not just Creator Rewards, but sponsorship potential based on your follower count and niche. Most creators earn 10–100× more from brand deals than from the platform itself, and this calculator shows both.": 'Estima tus ingresos totales de TikTok — no solo Creator Rewards, sino también el potencial de patrocinios según tus seguidores. La mayoría de creadores LATAM gana 10-100× más con marcas que con la plataforma.',
        "Estimate how much you earn from Spotify streams based on your listener geography, Premium vs. free-tier audience mix, and your distribution deal. Shows why 1 million streams from the US is worth far more than 1 million streams from developing markets.": 'Estima cuánto ganas con streams de Spotify según la geografía de tus oyentes. Muestra por qué 1 millón de streams de EE.UU. vale mucho más que 1 millón de streams de LATAM.',
        "Find out exactly what you should charge brands — across any platform, any content type. Built on real 2026 market rates with engagement rate multipliers, niche premiums, and format adjustments. Never undercharge or lose a deal by overpricing again.": 'Descubre exactamente cuánto cobrar a marcas en cualquier plataforma. Basado en tarifas reales de mercado 2026 con multiplicadores de engagement y nichos. Nunca cobres de menos.',
        /* tools.html — card features */
        'Monthly & annual AdSense projections': 'Proyecciones de AdSense mensual y anual',
        'CPM vs RPM comparison explained': 'Comparación CPM vs RPM explicada',
        'Earnings by niche (finance, gaming, lifestyle, tech)': 'Ganancias por nicho (finanzas, gaming, lifestyle, tech)',
        'Revenue at 100K, 500K, 1M+ view milestones': 'Ingresos en 100K, 500K, 1M+ vistas',
        'CPM to RPM conversion': 'Conversión CPM a RPM',
        'Gross vs. net revenue breakdown': 'Desglose ingresos brutos vs netos',
        'CPM benchmarks by niche': 'Benchmarks de CPM por nicho',
        'Shorts vs. long-form revenue comparison': 'Comparación ingresos Shorts vs formato largo',
        'Monthly earnings from Shorts view count': 'Ganancias mensuales por vistas de Shorts',
        'Channel growth impact projections': 'Proyecciones de impacto en crecimiento del canal',
        'Rate by integration type (dedicated / integrated / mention)': 'Tarifa por tipo de integración (dedicado / integrado / mención)',
        'Benchmark against industry sponsor rates': 'Comparativa con tarifas de patrocinio del sector',
        'Niche premium multipliers built in': 'Multiplicadores de nicho premium incluidos',
        'Creator Rewards estimate at your view count': 'Estimación de Creator Rewards según tus vistas',
        'Sponsorship deal value by follower tier': 'Valor de patrocinio por nivel de seguidores',
        'Monthly income projection across all income streams': 'Proyección de ingresos mensuales de todas las fuentes',
        'Niche impact on brand deal rates': 'Impacto del nicho en tarifas de marcas',
        'Sponsored post rates (feed, Reel, Story)': 'Tarifas de posts patrocinados (feed, Reel, Story)',
        'Engagement rate impact on deal value': 'Impacto del engagement en el valor del acuerdo',
        'Annual income projection by posting frequency': 'Proyección anual por frecuencia de publicación',
        'Engagement rate formula applied instantly': 'Fórmula de engagement aplicada al instante',
        'Benchmark against nano/micro/macro/mega averages': 'Comparativa con promedios nano/micro/macro/mega',
        'Extended ER with saves & shares option': 'ER extendido con opción de guardados y compartidos',
        'Earnings at 10K, 100K, 1M, 10M stream milestones': 'Ganancias en hitos de 10K, 100K, 1M, 10M streams',
        'Geography impact on per-stream rate': 'Impacto de la geografía en la tarifa por stream',
        'Premium vs. free-tier listener ratio modeled': 'Ratio oyentes Premium vs nivel gratuito modelado',
        'Distributor cut comparison (DistroKid, TuneCore, CD Baby)': 'Comparativa de comisión del distribuidor (DistroKid, TuneCore, CD Baby)',
        'Rate by platform (YouTube, TikTok, Instagram, podcast)': 'Tarifa por plataforma (YouTube, TikTok, Instagram, podcast)',
        'Engagement rate premium built in': 'Prima de engagement rate incluida',
        'Niche CPM multipliers (finance, tech, beauty, gaming)': 'Multiplicadores de CPM por nicho (finanzas, tech, belleza, gaming)',
        'Media kit rate card generator': 'Generador de media kit con tarifas',
        'Sub tier mix (Tier 1/2/3 + Prime Gaming)': 'Mix de niveles de subs (Nivel 1/2/3 + Prime Gaming)',
        '50/50 vs legacy 70/30 split comparison': 'Comparativa 50/50 vs histórico 70/30',
        'Bits + ad revenue + donations combined': 'Bits + ingresos publicitarios + donaciones combinados',
        'CPM revenue by niche (pre-roll, mid-roll, post-roll)': 'Ingresos CPM por nicho (pre-roll, mid-roll, post-roll)',
        'Patreon conversion estimate side-by-side': 'Estimación de conversión a Patreon en paralelo',
        'Total monthly income across all podcast income streams': 'Ingresos mensuales totales de todas las fuentes del podcast',
        'Monthly income after Patreon fees (Lite / Pro / Premium)': 'Ingresos mensuales tras comisiones de Patreon (Lite / Pro / Premium)',
        'Three-tier membership model': 'Modelo de membresía de tres niveles',
        'Conversion rate needed from your audience size': 'Tasa de conversión necesaria según el tamaño de tu audiencia',
        'Subscription + PPV + tips combined estimate': 'Estimación combinada de suscripciones + PPV + propinas',
        '80% creator share applied automatically': '80% de participación del creador aplicado automáticamente',
        'Pricing optimization (low sub / high PPV vs. premium sub)': 'Optimización de precios (suscripción baja / PPV alto vs. suscripción premium)',
        /* tools.html — cta + misc */
        'Free': 'Gratis',
        'Open Calculator →': 'Abrir Calculadora →',
        'Want to understand the numbers behind each tool?': '¿Quieres entender los números detrás de cada herramienta?',
        'Our 30 free guides explain exactly how each platform calculates creator earnings — with real data and examples.': 'Nuestras 30 guías gratuitas explican cómo calcula cada plataforma las ganancias — con datos reales y ejemplos.',
        'Browse All Guides →': 'Ver Todas las Guías →',
        "About Kalkil's Creator Calculators": 'Sobre las Calculadoras Kalkil para Creadores',
        /* guides.html — hero */
        '2026 Creator Economy Guides': 'Guías de Economía Creativa 2026',
        'Real earnings data for YouTube, TikTok, Instagram, Spotify, Twitch, and more — with free calculators for every platform.': 'Datos reales de ganancias para YouTube, TikTok, Instagram, Spotify, Twitch y más — con calculadoras gratuitas para cada plataforma.',
        'Free guides': 'Guías gratuitas', 'Platforms covered': 'Plataformas cubiertas',
        /* guides.html — clusters */
        'YouTube Money': 'Ingresos de YouTube',
        'CPM, RPM, and real earnings data for every YouTube niche in 2026.': 'CPM, RPM y datos reales de ganancias para cada nicho de YouTube en 2026.',
        '5 guides': '5 guías',
        'TikTok Economy': 'Economía de TikTok',
        'Creator Rewards, brand deals, and how TikTok income actually works in 2026.': 'Creator Rewards, deals de marcas y cómo funcionan los ingresos de TikTok en 2026.',
        'Instagram Influencers': 'Influencers de Instagram',
        'Sponsorship rates, Reels earnings, engagement benchmarks, and Instagram income in 2026.': 'Tarifas de patrocinio, ganancias de Reels, métricas de engagement e ingresos de Instagram en 2026.',
        'Streaming & Music': 'Streaming y Música',
        'Spotify royalties, Apple Music rates, and streaming income for independent artists in 2026.': 'Regalías de Spotify, tarifas de Apple Music e ingresos de streaming para artistas independientes.',
        'Podcasts, Twitch, Patreon, OnlyFans, and building a full creator business in 2026.': 'Podcasts, Twitch, Patreon, OnlyFans y cómo construir un negocio de creador en 2026.',
        '10 guides': '10 guías',
        /* guides.html — guide titles (30) */
        'How Much Does YouTube Pay Per 1,000 Views?': '¿Cuánto Paga YouTube por 1.000 Vistas?',
        'YouTube CPM by Country (2026 Global Rates)': 'CPM de YouTube por País (Tasas Globales 2026)',
        'How Much Do YouTube Shorts Pay Per View?': '¿Cuánto Pagan los YouTube Shorts por Vista?',
        'How Much Do YouTubers Make Per Million Views?': '¿Cuánto Ganan los YouTubers por Millón de Vistas?',
        'YouTube Monetization Explained — Ads, Shorts & Sponsorships': 'Monetización de YouTube Explicada — Anuncios, Shorts y Patrocinios',
        'How Much Does TikTok Pay Per View?': '¿Cuánto Paga TikTok por Vista?',
        'TikTok Creator Fund Payments Explained': 'Pagos del Creator Fund de TikTok Explicados',
        'How TikTok Influencers Make Money': 'Cómo Ganan Dinero los Influencers de TikTok',
        'TikTok vs YouTube Earnings — Which Pays More?': 'TikTok vs YouTube — ¿Cuál Paga Más?',
        'How Many Followers to Make Money on TikTok?': '¿Cuántos Seguidores Necesitas para Ganar en TikTok?',
        'Instagram Influencer Rates — 2026 Pricing Guide': 'Tarifas de Influencers de Instagram — Guía de Precios 2026',
        'How Much Do Instagram Reels Pay Creators?': '¿Cuánto Pagan los Instagram Reels a los Creadores?',
        'Instagram Engagement Rate Explained': 'Engagement Rate de Instagram Explicado',
        'How Instagram Influencers Make Money': 'Cómo Ganan Dinero los Influencers de Instagram',
        'Instagram vs TikTok Earnings — Which Pays More?': 'Instagram vs TikTok — ¿Cuál Paga Más?',
        'Spotify vs Apple Music Pay Per Stream': 'Spotify vs Apple Music: Pago por Stream',
        'How Much Do Musicians Make From Streaming?': '¿Cuánto Ganan los Músicos con el Streaming?',
        'How Spotify Royalties Work': 'Cómo Funcionan las Regalías de Spotify',
        'Average Spotify Pay Per Stream 2026': 'Pago Promedio de Spotify por Stream 2026',
        'How Streaming Revenue Is Calculated': 'Cómo se Calculan los Ingresos de Streaming',
        'How Creators Make Money Online — Every Income Stream': 'Cómo Ganan Dinero los Creadores Online',
        'How Much Do Podcasters Make in 2026?': '¿Cuánto Ganan los Podcasters en 2026?',
        'Podcast Advertising Rates Explained': 'Tarifas de Publicidad en Podcasts Explicadas',
        'How Much Do Twitch Streamers Make?': '¿Cuánto Ganan los Streamers de Twitch?',
        'How Much Do Twitch Streamers Make Per Sub?': '¿Cuánto Ganan los Streamers de Twitch por Suscripción?',
        'Patreon Earnings Guide 2026': 'Guía de Ganancias de Patreon 2026',
        'OnlyFans Earnings Explained': 'Ganancias de OnlyFans Explicadas',
        'Creator Economy Growth Statistics 2026': 'Estadísticas de Crecimiento de la Economía Creativa 2026',
        'How to Build a Creator Business in 2026': 'Cómo Construir un Negocio de Creador en 2026',
        'Top Creator Income Streams Ranked': 'Las Mejores Fuentes de Ingreso para Creadores',
        /* guides.html — misc */
        'YouTube · Featured': 'YouTube · Destacado',
        'TikTok · Featured': 'TikTok · Destacado',
        'Instagram · Featured': 'Instagram · Destacado',
        'Streaming · Featured': 'Streaming · Destacado',
        'Creator Economy · Featured': 'Economía Creativa · Destacado',
        'Read Guide →': 'Leer Guía →',
        '8 min read': '8 min de lectura', '6 min read': '6 min de lectura',
        '5 min read': '5 min de lectura', '7 min read': '7 min de lectura',
        '9 min read': '9 min de lectura', '10 min read': '10 min de lectura',
        /* about.html — hero */
        'About Kalkil': 'Sobre Kalkil',
        'Free, accurate earnings calculators and guides for every major creator platform — so you always know what your content is worth.': 'Calculadoras de ganancias gratuitas y precisas para todas las plataformas — para que siempre sepas lo que vale tu contenido.',
        'Explore Calculators →': 'Explorar Calculadoras →',
        'Read Guides →': 'Leer Guías →',
        /* about.html — stats */
        '$0 Cost to use — always': '$0 Costo de uso — siempre',
        '14 Free calculators': '14 Calculadoras gratuitas',
        '30 Creator economy guides': '30 Guías de economía creativa',
        '6 Platforms covered': '6 Plataformas cubiertas',
        /* about.html — sections */
        'Our Mission': 'Nuestra Misión',
        'Creator economy data should be free and honest': 'Los datos de la economía creativa deben ser gratuitos y honestos',
        'What Kalkil Offers': 'Lo Que Ofrece Kalkil',
        'Three tools to understand creator income': 'Tres herramientas para entender los ingresos de creadores',
        'The Creator Economy': 'La Economía Creativa',
        "A $500B industry most creators don't fully understand": 'Una industria de $500B que la mayoría de creadores no entiende',
        'Our Vision': 'Nuestra Visión',
        'Get Started': 'Empezar',
        'Start with a free calculator': 'Empieza con una calculadora gratuita',
        'No account. No paywall. Pick your platform and see your estimated earnings in seconds.': 'Sin cuenta. Sin paywall. Elige tu plataforma y ve tus ganancias estimadas en segundos.',
        'Explore All 14 Calculators →': 'Explorar las 14 Calculadoras →',
        'Browse 30 Free Guides →': 'Ver las 30 Guías Gratuitas →',
        /* about.html — offer cards */
        'Creator Earnings Calculators': 'Calculadoras de Ganancias para Creadores',
        'Creator Economy Guides': 'Guías de Economía Creativa',
        'Transparent Platform Insights': 'Datos Transparentes de Plataformas',
        'Explore all calculators →': 'Explorar todas las calculadoras →',
        'Browse all guides →': 'Ver todas las guías →',
        'See income streams guide →': 'Ver guía de fuentes de ingreso →',
        /* about.html — mission items */
        'Real earnings data, not estimates pulled from thin air': 'Datos reales de ganancias, no estimaciones inventadas',
        'Always free — no account, no paywall': 'Siempre gratis — sin cuenta, sin paywall',
        'Platform-specific, not one-size-fits-all': 'Específico por plataforma, no genérico',
        /* about.html — vision items */
        'Accessible to every creator, everywhere': 'Accesible para todos los creadores, en todas partes',
        'Expanding across every major platform': 'Expandiéndose a todas las plataformas principales',
        'Always up to date': 'Siempre actualizado',
        'Education over hype': 'Educación por encima del hype',
        /* calculator pages */
        '✓ Free · No sign-up · Instant results': '✓ Gratis · Sin registro · Resultados instantáneos',
        'Calculate Earnings': 'Calcular Ganancias',
        'Reset': 'Reiniciar',
        'Monthly Views': 'Vistas Mensuales',
        'Content Niche': 'Nicho de Contenido',
        'Your CPM ($)': 'Tu CPM ($)',
        'Monthly AdSense (RPM)': 'AdSense Mensual (RPM)',
        'Your RPM': 'Tu RPM',
        'Per 1 Million Views': 'Por 1 Millón de Vistas',
        'Annual Estimate': 'Estimación Anual',
        'How YouTube Calculates Creator Revenue': 'Cómo Calcula YouTube los Ingresos de Creadores',
        'Average YouTube CPM by Niche (2026)': 'CPM Promedio de YouTube por Nicho (2026)',
        'Factors That Affect Your YouTube Earnings': 'Factores que Afectan tus Ganancias de YouTube',
        'Want to understand the numbers?': '¿Quieres entender los números?',
        'Read our free in-depth guide explaining exactly how this platform pays creators.': 'Lee nuestra guía gratuita que explica exactamente cómo paga esta plataforma.',
        'Read the Guide →': 'Leer la Guía →',
        'More Calculators': 'Más Calculadoras',
        'Kalkil Pro': 'Kalkil Pro',
        'See all your income in one place': 'Ve todos tus ingresos en un solo lugar',
        'YouTube, Spotify, TikTok, Twitch and more — unified dashboard with benchmarks and projections.': 'YouTube, Spotify, TikTok, Twitch y más — dashboard unificado con benchmarks y proyecciones para creadores LATAM.',
        'Try Kalkil Pro Free →': 'Probar Kalkil Pro Gratis →',
        'Free to start · No credit card required': 'Gratis para empezar · Sin tarjeta de crédito',
        'CPM to RPM breakdown': 'Desglose CPM a RPM',
        'Shorts RPM vs long-form': 'RPM de Shorts vs formato largo',
        'Brand deal value': 'Valor de deal con marcas',
        'Creator Rewards + deals': 'Creator Rewards + deals',
      },
      /* h1 elements with inner HTML (br / em tags) */
      _htmlMap: {
        'Free Creator Earnings Calculators': 'Calculadoras Gratuitas de<br><em>Ganancias</em> para Creadores',
        'Learn How Creators Actually Make Money': 'Aprende Cómo Ganan Dinero<br>Los Creadores <em>de Verdad</em>',
        'Making Creator Income Transparent': 'Haciendo Transparente<br>el Ingreso <em>de Creadores</em>',
        'A creator economy where everyone knows the numbers': 'Una economía creativa donde <em>todos</em> conocen los números',
      },
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
      'how.step1.desc': 'Selecione entre YouTube, TikTok, Spotify, Instagram, Twitch, Patreon ou outras 8 plataformas. Cada calculadora foi desenvolvida para o modelo de pagamento daquela plataforma.',
      'how.step2': 'Insira Seus Números',
      'how.step2.desc': 'Digite sua contagem de visualizações, streams, seguidores ou inscritos. Ajuste para seu nicho, geografia da audiência e taxa de engajamento.',
      'how.step3': 'Obtenha Sua Estimativa',
      'how.step3.desc': 'Veja os ganhos mensais e anuais projetados instantaneamente. Acesse nossos guias para entender o contexto por trás dos números.',
      'guides.label': 'Saiba Mais', 'guides.h2': 'Guias de Economia Criativa',
      'guides.all': 'Ver todos os 30 guias →', 'guides.read': 'Ler Guia →',
      'footer.tagline': 'Calculadoras gratuitas de ganhos e guias para YouTube, TikTok, Spotify, Instagram, Twitch e mais. Sem cadastro. Sem paywall.',
      'footer.col1': 'Calculadoras', 'footer.col2': 'Guias Principais', 'footer.col3': 'Kalkil',
      'footer.all.calcs': 'Todas as Calculadoras →', 'footer.all.guides': 'Todos os Guias →',
      'footer.bottom': '© 2026 Kalkil · Calculadoras e Guias Gratuitos para Criadores',
      'footer.bottom2': 'Dados atualizados para 2026 · Sem cadastro necessário',

      _textMap: {
        '2026 Creator Economy Tools': 'Ferramentas para Criadores 2026',
        'Instant, accurate earnings estimates for every major creator platform — no sign-up, no paywalls, no guesswork.': 'Estimativas precisas e instantâneas para todas as plataformas — sem cadastro, sem paywall.',
        'All Tools': 'Todas', 'YouTube': 'YouTube', 'TikTok & Instagram': 'TikTok e Instagram',
        'Streaming': 'Streaming', 'Creator Economy': 'Economia Criativa',
        'YouTube Calculators': 'Calculadoras do YouTube',
        'Estimate AdSense earnings, CPM rates, Shorts revenue, and sponsorship potential.': 'Estime ganhos do AdSense, CPM, receita de Shorts e potencial de patrocínio.',
        '4 tools': '4 ferramentas',
        'TikTok & Instagram Calculators': 'Calculadoras de TikTok e Instagram',
        'Creator Rewards estimates, influencer sponsorship rates, and engagement benchmarks.': 'Estimativas de Creator Rewards, tarifas de patrocínio e métricas de engajamento.',
        'Streaming & Music Calculator': 'Calculadora de Streaming e Música',
        'Spotify royalty estimates for independent artists and labels.': 'Estimativas de royalties do Spotify para artistas independentes.',
        '1 tool': '1 ferramenta',
        'Creator Economy Tools': 'Ferramentas de Economia Criativa',
        'Twitch subscriptions, Patreon memberships, podcast CPM, influencer rates, and OnlyFans income.': 'Inscrições Twitch, assinaturas Patreon, CPM de podcast, tarifas de influencer e ganhos do OnlyFans.',
        '5 tools': '5 ferramentas',
        'YouTube · Most Used': 'YouTube · Mais Usado',
        'TikTok · Most Used': 'TikTok · Mais Usado',
        'Spotify · Featured': 'Spotify · Destaque',
        'Creator Economy · Most Used': 'Economia Criativa · Mais Usado',
        'YouTube Money Calculator': 'Calculadora de Ganhos do YouTube',
        'YouTube CPM Calculator': 'Calculadora de CPM do YouTube',
        'YouTube Shorts Earnings Calculator': 'Calculadora de Ganhos do YouTube Shorts',
        'YouTube Sponsorship Calculator': 'Calculadora de Patrocínios do YouTube',
        'TikTok Money Calculator': 'Calculadora de Ganhos do TikTok',
        'TikTok Creator Fund Calculator': 'Calculadora do Creator Fund do TikTok',
        'Instagram Earnings Calculator': 'Calculadora de Ganhos do Instagram',
        'Instagram Engagement Rate Calculator': 'Calculadora de Engajamento do Instagram',
        'Spotify Royalty Calculator': 'Calculadora de Royalties do Spotify',
        'Influencer Rate Calculator': 'Calculadora de Tarifas para Influencers',
        'Twitch Earnings Calculator': 'Calculadora de Ganhos do Twitch',
        'Podcast Revenue Calculator': 'Calculadora de Receita de Podcast',
        'Patreon Income Calculator': 'Calculadora de Renda do Patreon',
        'OnlyFans Earnings Calculator': 'Calculadora de Ganhos do OnlyFans',
        "The most comprehensive YouTube earnings estimator. Input your view count and niche CPM to instantly see projected AdSense revenue — monthly, annual, and per video. Includes RPM breakdown so you understand what you're actually keeping.": 'A calculadora de ganhos do YouTube mais completa para criadores brasileiros. Insira suas visualizações e CPM do nicho para projeções de AdSense instantâneas. O Brasil é o 3º maior mercado do YouTube — descubra o que seu canal vale.',
        "Estimate your total TikTok income — not just Creator Rewards, but sponsorship potential based on your follower count and niche. Most creators earn 10–100× more from brand deals than from the platform itself, and this calculator shows both.": 'Estime seus ganhos totais no TikTok — não só Creator Rewards, mas também o potencial de patrocínios. A maioria dos criadores ganha 10-100× mais com marcas do que com a plataforma em si.',
        "Estimate how much you earn from Spotify streams based on your listener geography, Premium vs. free-tier audience mix, and your distribution deal. Shows why 1 million streams from the US is worth far more than 1 million streams from developing markets.": 'Estime quanto você ganha com streams do Spotify. Mostra por que 1 milhão de streams dos EUA vale muito mais que 1 milhão do Brasil — e como maximizar sua receita de streaming.',
        'Free': 'Grátis',
        'Open Calculator →': 'Abrir Calculadora →',
        'Want to understand the numbers behind each tool?': 'Quer entender os números por trás de cada ferramenta?',
        'Our 30 free guides explain exactly how each platform calculates creator earnings — with real data and examples.': 'Nossos 30 guias gratuitos explicam exatamente como cada plataforma calcula os ganhos — com dados reais e exemplos.',
        'Browse All Guides →': 'Ver Todos os Guias →',
        "About Kalkil's Creator Calculators": 'Sobre as Calculadoras Kalkil para Criadores',
        '2026 Creator Economy Guides': 'Guias de Economia Criativa 2026',
        'Real earnings data for YouTube, TikTok, Instagram, Spotify, Twitch, and more — with free calculators for every platform.': 'Dados reais de ganhos para YouTube, TikTok, Instagram, Spotify, Twitch e mais — com calculadoras gratuitas para cada plataforma.',
        'Free guides': 'Guias gratuitos', 'Platforms covered': 'Plataformas cobertas',
        'YouTube Money': 'Ganhos do YouTube',
        'CPM, RPM, and real earnings data for every YouTube niche in 2026.': 'CPM, RPM e dados reais de ganhos para cada nicho do YouTube em 2026.',
        '5 guides': '5 guias',
        'TikTok Economy': 'Economia do TikTok',
        'Creator Rewards, brand deals, and how TikTok income actually works in 2026.': 'Creator Rewards, deals com marcas e como os ganhos do TikTok funcionam na prática.',
        'Instagram Influencers': 'Influencers do Instagram',
        'Sponsorship rates, Reels earnings, engagement benchmarks, and Instagram income in 2026.': 'Tarifas de patrocínio, ganhos de Reels, benchmarks de engajamento e renda do Instagram.',
        'Streaming & Music': 'Streaming e Música',
        'Spotify royalties, Apple Music rates, and streaming income for independent artists in 2026.': 'Royalties do Spotify, tarifas da Apple Music e renda de streaming para artistas independentes.',
        'Podcasts, Twitch, Patreon, OnlyFans, and building a full creator business in 2026.': 'Podcasts, Twitch, Patreon, OnlyFans e como construir um negócio de criador em 2026.',
        '10 guides': '10 guias',
        'How Much Does YouTube Pay Per 1,000 Views?': 'Quanto o YouTube Paga por 1.000 Visualizações?',
        'YouTube CPM by Country (2026 Global Rates)': 'CPM do YouTube por País (Taxas Globais 2026)',
        'How Much Do YouTube Shorts Pay Per View?': 'Quanto os YouTube Shorts Pagam por Visualização?',
        'How Much Do YouTubers Make Per Million Views?': 'Quanto os YouTubers Ganham por Milhão de Visualizações?',
        'YouTube Monetization Explained — Ads, Shorts & Sponsorships': 'Monetização do YouTube Explicada — Anúncios, Shorts e Patrocínios',
        'How Much Does TikTok Pay Per View?': 'Quanto o TikTok Paga por Visualização?',
        'TikTok Creator Fund Payments Explained': 'Pagamentos do Creator Fund do TikTok Explicados',
        'How TikTok Influencers Make Money': 'Como os Influencers do TikTok Ganham Dinheiro',
        'TikTok vs YouTube Earnings — Which Pays More?': 'TikTok vs YouTube — Qual Paga Mais?',
        'How Many Followers to Make Money on TikTok?': 'Quantos Seguidores Precisa para Ganhar no TikTok?',
        'Instagram Influencer Rates — 2026 Pricing Guide': 'Tarifas de Influencers do Instagram — Guia de Preços 2026',
        'How Much Do Instagram Reels Pay Creators?': 'Quanto os Instagram Reels Pagam aos Criadores?',
        'Instagram Engagement Rate Explained': 'Taxa de Engajamento do Instagram Explicada',
        'How Instagram Influencers Make Money': 'Como os Influencers do Instagram Ganham Dinheiro',
        'Instagram vs TikTok Earnings — Which Pays More?': 'Instagram vs TikTok — Qual Paga Mais?',
        'Spotify vs Apple Music Pay Per Stream': 'Spotify vs Apple Music: Pagamento por Stream',
        'How Much Do Musicians Make From Streaming?': 'Quanto os Músicos Ganham com Streaming?',
        'How Spotify Royalties Work': 'Como Funcionam os Royalties do Spotify',
        'Average Spotify Pay Per Stream 2026': 'Pagamento Médio do Spotify por Stream 2026',
        'How Streaming Revenue Is Calculated': 'Como a Receita de Streaming é Calculada',
        'How Creators Make Money Online — Every Income Stream': 'Como os Criadores Ganham Dinheiro Online',
        'How Much Do Podcasters Make in 2026?': 'Quanto os Podcasters Ganham em 2026?',
        'Podcast Advertising Rates Explained': 'Tarifas de Publicidade em Podcasts Explicadas',
        'How Much Do Twitch Streamers Make?': 'Quanto os Streamers do Twitch Ganham?',
        'How Much Do Twitch Streamers Make Per Sub?': 'Quanto os Streamers do Twitch Ganham por Inscrição?',
        'Patreon Earnings Guide 2026': 'Guia de Ganhos do Patreon 2026',
        'OnlyFans Earnings Explained': 'Ganhos do OnlyFans Explicados',
        'Creator Economy Growth Statistics 2026': 'Estatísticas de Crescimento da Economia Criativa 2026',
        'How to Build a Creator Business in 2026': 'Como Construir um Negócio de Criador em 2026',
        'Top Creator Income Streams Ranked': 'As Melhores Fontes de Renda para Criadores',
        'YouTube · Featured': 'YouTube · Destaque', 'TikTok · Featured': 'TikTok · Destaque',
        'Instagram · Featured': 'Instagram · Destaque', 'Streaming · Featured': 'Streaming · Destaque',
        'Creator Economy · Featured': 'Economia Criativa · Destaque',
        'Read Guide →': 'Ler Guia →',
        '8 min read': '8 min de leitura', '6 min read': '6 min de leitura',
        '5 min read': '5 min de leitura', '7 min read': '7 min de leitura',
        '9 min read': '9 min de leitura', '10 min read': '10 min de leitura',
        'About Kalkil': 'Sobre o Kalkil',
        'Free, accurate earnings calculators and guides for every major creator platform — so you always know what your content is worth.': 'Calculadoras de ganhos gratuitas e precisas para todas as plataformas — para que você sempre saiba o que seu conteúdo vale.',
        'Explore Calculators →': 'Explorar Calculadoras →', 'Read Guides →': 'Ler Guias →',
        '$0 Cost to use — always': '$0 Custo de uso — sempre',
        '14 Free calculators': '14 Calculadoras gratuitas',
        '30 Creator economy guides': '30 Guias de economia criativa',
        '6 Platforms covered': '6 Plataformas cobertas',
        'Our Mission': 'Nossa Missão',
        'Creator economy data should be free and honest': 'Dados da economia criativa devem ser gratuitos e honestos',
        'What Kalkil Offers': 'O Que o Kalkil Oferece',
        'Three tools to understand creator income': 'Três ferramentas para entender a renda de criadores',
        'The Creator Economy': 'A Economia Criativa',
        "A $500B industry most creators don't fully understand": 'Uma indústria de $500B que a maioria dos criadores não entende',
        'Our Vision': 'Nossa Visão',
        'Get Started': 'Começar',
        'Start with a free calculator': 'Comece com uma calculadora gratuita',
        'No account. No paywall. Pick your platform and see your estimated earnings in seconds.': 'Sem conta. Sem paywall. Escolha sua plataforma e veja seus ganhos estimados em segundos.',
        'Explore All 14 Calculators →': 'Explorar as 14 Calculadoras →',
        'Browse 30 Free Guides →': 'Ver os 30 Guias Gratuitos →',
        'Creator Earnings Calculators': 'Calculadoras de Ganhos para Criadores',
        'Creator Economy Guides': 'Guias de Economia Criativa',
        'Transparent Platform Insights': 'Dados Transparentes das Plataformas',
        'Explore all calculators →': 'Explorar todas as calculadoras →',
        'Browse all guides →': 'Ver todos os guias →',
        'See income streams guide →': 'Ver guia de fontes de renda →',
        'Real earnings data, not estimates pulled from thin air': 'Dados reais de ganhos, não estimativas inventadas',
        'Always free — no account, no paywall': 'Sempre gratuito — sem conta, sem paywall',
        'Platform-specific, not one-size-fits-all': 'Específico por plataforma, não genérico',
        'Accessible to every creator, everywhere': 'Acessível para todos os criadores, em qualquer lugar',
        'Expanding across every major platform': 'Expandindo para todas as principais plataformas',
        'Always up to date': 'Sempre atualizado',
        'Education over hype': 'Educação acima do hype',
        '✓ Free · No sign-up · Instant results': '✓ Grátis · Sem cadastro · Resultados instantâneos',
        'Calculate Earnings': 'Calcular Ganhos',
        'Reset': 'Reiniciar',
        'Monthly Views': 'Visualizações Mensais',
        'Content Niche': 'Nicho de Conteúdo',
        'Your CPM ($)': 'Seu CPM ($)',
        'Monthly AdSense (RPM)': 'AdSense Mensal (RPM)',
        'Your RPM': 'Seu RPM',
        'Per 1 Million Views': 'Por 1 Milhão de Visualizações',
        'Annual Estimate': 'Estimativa Anual',
        'How YouTube Calculates Creator Revenue': 'Como o YouTube Calcula a Receita dos Criadores',
        'Average YouTube CPM by Niche (2026)': 'CPM Médio do YouTube por Nicho (2026)',
        'Factors That Affect Your YouTube Earnings': 'Fatores que Afetam seus Ganhos no YouTube',
        'Want to understand the numbers?': 'Quer entender os números?',
        'Read our free in-depth guide explaining exactly how this platform pays creators.': 'Leia nosso guia gratuito que explica exatamente como esta plataforma paga os criadores.',
        'Read the Guide →': 'Ler o Guia →',
        'More Calculators': 'Mais Calculadoras',
        'Kalkil Pro': 'Kalkil Pro',
        'See all your income in one place': 'Veja toda a sua renda em um só lugar',
        'YouTube, Spotify, TikTok, Twitch and more — unified dashboard with benchmarks and projections.': 'YouTube, Spotify, TikTok, Twitch e mais — dashboard unificado com benchmarks e projeções para criadores brasileiros.',
        'Try Kalkil Pro Free →': 'Experimentar Kalkil Pro Grátis →',
        'Free to start · No credit card required': 'Grátis para começar · Sem cartão de crédito',
        'CPM to RPM breakdown': 'Detalhamento CPM para RPM',
        'Shorts RPM vs long-form': 'RPM de Shorts vs formato longo',
        'Brand deal value': 'Valor de deal com marcas',
        'Creator Rewards + deals': 'Creator Rewards + deals',
      },
      _htmlMap: {
        'Free Creator Earnings Calculators': 'Calculadoras Gratuitas de<br><em>Ganhos</em> para Criadores',
        'Learn How Creators Actually Make Money': 'Aprenda Como os Criadores<br>Ganham Dinheiro <em>de Verdade</em>',
        'Making Creator Income Transparent': 'Tornando a Renda dos<br>Criadores <em>Transparente</em>',
        'A creator economy where everyone knows the numbers': 'Uma economia criativa onde <em>todos</em> conhecem os números',
      },
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
      'how.step1.desc': "Choisissez parmi YouTube, TikTok, Spotify, Instagram, Twitch, Patreon ou 8 autres plateformes. Chaque calculateur est conçu pour le modèle de paiement de cette plateforme.",
      'how.step2': 'Entrez Vos Chiffres',
      'how.step2.desc': "Saisissez votre nombre de vues, streams, abonnés ou inscrits. Ajustez pour votre niche, la géographie de votre audience et votre taux d'engagement.",
      'how.step3': 'Obtenez Votre Estimation',
      'how.step3.desc': 'Consultez vos revenus mensuels et annuels projetés instantanément. Accédez à nos guides pour comprendre le contexte derrière les chiffres.',
      'guides.label': 'En Savoir Plus', 'guides.h2': 'Guides Économie Créative',
      'guides.all': 'Voir tous les 30 guides →', 'guides.read': 'Lire le Guide →',
      'footer.tagline': 'Calculateurs gratuits de revenus et guides pour YouTube, TikTok, Spotify, Instagram, Twitch et plus. Sans inscription. Sans paywall.',
      'footer.col1': 'Calculateurs', 'footer.col2': 'Guides Principaux', 'footer.col3': 'Kalkil',
      'footer.all.calcs': 'Tous les Calculateurs →', 'footer.all.guides': 'Tous les Guides →',
      'footer.bottom': '© 2026 Kalkil · Calculateurs et Guides Gratuits pour Créateurs',
      'footer.bottom2': 'Données mises à jour pour 2026 · Sans inscription requise',

      _textMap: {
        '2026 Creator Economy Tools': 'Outils pour Créateurs 2026',
        'Instant, accurate earnings estimates for every major creator platform — no sign-up, no paywalls, no guesswork.': 'Estimations instantanées et précises pour toutes les plateformes — sans inscription, sans paywall.',
        'All Tools': 'Tous', 'YouTube': 'YouTube', 'TikTok & Instagram': 'TikTok & Instagram',
        'Streaming': 'Streaming', 'Creator Economy': 'Économie Créative',
        'YouTube Calculators': 'Calculateurs YouTube',
        'Estimate AdSense earnings, CPM rates, Shorts revenue, and sponsorship potential.': 'Estimez les revenus AdSense, les taux CPM, les revenus Shorts et le potentiel sponsoring.',
        '4 tools': '4 outils',
        'TikTok & Instagram Calculators': 'Calculateurs TikTok & Instagram',
        'Creator Rewards estimates, influencer sponsorship rates, and engagement benchmarks.': "Estimations Creator Rewards, tarifs de sponsoring et benchmarks d'engagement.",
        'Streaming & Music Calculator': 'Calculateur Streaming & Musique',
        'Spotify royalty estimates for independent artists and labels.': 'Estimations royalties Spotify pour artistes indépendants.',
        '1 tool': '1 outil',
        'Creator Economy Tools': "Outils Économie Créative",
        'Twitch subscriptions, Patreon memberships, podcast CPM, influencer rates, and OnlyFans income.': 'Abonnements Twitch, adhésions Patreon, CPM podcast, tarifs influenceurs et revenus OnlyFans.',
        '5 tools': '5 outils',
        'YouTube · Most Used': 'YouTube · Le Plus Utilisé',
        'TikTok · Most Used': 'TikTok · Le Plus Utilisé',
        'Spotify · Featured': 'Spotify · À la Une',
        'Creator Economy · Most Used': 'Économie Créative · Le Plus Utilisé',
        'YouTube Money Calculator': 'Calculateur de Revenus YouTube',
        'YouTube CPM Calculator': 'Calculateur CPM YouTube',
        'YouTube Shorts Earnings Calculator': 'Calculateur Revenus YouTube Shorts',
        'YouTube Sponsorship Calculator': 'Calculateur Sponsoring YouTube',
        'TikTok Money Calculator': 'Calculateur de Revenus TikTok',
        'TikTok Creator Fund Calculator': 'Calculateur Creator Fund TikTok',
        'Instagram Earnings Calculator': 'Calculateur Revenus Instagram',
        'Instagram Engagement Rate Calculator': "Calculateur Taux d'Engagement Instagram",
        'Spotify Royalty Calculator': 'Calculateur Royalties Spotify',
        'Influencer Rate Calculator': 'Calculateur Tarifs Influenceurs',
        'Twitch Earnings Calculator': 'Calculateur Revenus Twitch',
        'Podcast Revenue Calculator': 'Calculateur Revenus Podcast',
        'Patreon Income Calculator': 'Calculateur Revenus Patreon',
        'OnlyFans Earnings Calculator': 'Calculateur Revenus OnlyFans',
        "The most comprehensive YouTube earnings estimator. Input your view count and niche CPM to instantly see projected AdSense revenue — monthly, annual, and per video. Includes RPM breakdown so you understand what you're actually keeping.": "Le calculateur de revenus YouTube le plus complet pour les créateurs francophones. Entrez vos vues et CPM de niche pour des projections AdSense instantanées. Aucun concurrent local ne propose cela en français.",
        "Estimate your total TikTok income — not just Creator Rewards, but sponsorship potential based on your follower count and niche. Most creators earn 10–100× more from brand deals than from the platform itself, and this calculator shows both.": "Estimez vos revenus TikTok totaux — pas seulement les Creator Rewards, mais aussi le potentiel de sponsoring. La plupart des créateurs gagnent 10-100× plus avec les marques qu'avec la plateforme elle-même.",
        'Free': 'Gratuit',
        'Open Calculator →': 'Ouvrir le Calculateur →',
        'Want to understand the numbers behind each tool?': 'Vous voulez comprendre les chiffres derrière chaque outil ?',
        'Our 30 free guides explain exactly how each platform calculates creator earnings — with real data and examples.': 'Nos 30 guides gratuits expliquent exactement comment chaque plateforme calcule les revenus — avec des données réelles.',
        'Browse All Guides →': 'Voir Tous les Guides →',
        "About Kalkil's Creator Calculators": 'À propos des Calculateurs Kalkil pour Créateurs',
        '2026 Creator Economy Guides': "Guides Économie Créative 2026",
        'Real earnings data for YouTube, TikTok, Instagram, Spotify, Twitch, and more — with free calculators for every platform.': 'Données réelles de revenus pour YouTube, TikTok, Instagram, Spotify, Twitch et plus — avec des calculateurs gratuits pour chaque plateforme.',
        'Free guides': 'Guides gratuits', 'Platforms covered': 'Plateformes couvertes',
        'YouTube Money': 'Revenus YouTube',
        'CPM, RPM, and real earnings data for every YouTube niche in 2026.': 'CPM, RPM et données réelles de revenus pour chaque niche YouTube en 2026.',
        '5 guides': '5 guides',
        'TikTok Economy': 'Économie TikTok',
        'Creator Rewards, brand deals, and how TikTok income actually works in 2026.': "Creator Rewards, deals avec marques et comment fonctionnent vraiment les revenus TikTok en 2026.",
        'Instagram Influencers': 'Influenceurs Instagram',
        'Sponsorship rates, Reels earnings, engagement benchmarks, and Instagram income in 2026.': "Tarifs de sponsoring, revenus Reels, benchmarks d'engagement et revenus Instagram.",
        'Streaming & Music': 'Streaming & Musique',
        'Spotify royalties, Apple Music rates, and streaming income for independent artists in 2026.': "Royalties Spotify, tarifs Apple Music et revenus streaming pour artistes indépendants.",
        'Podcasts, Twitch, Patreon, OnlyFans, and building a full creator business in 2026.': "Podcasts, Twitch, Patreon, OnlyFans et comment construire une vraie activité de créateur en 2026.",
        '10 guides': '10 guides',
        'How Much Does YouTube Pay Per 1,000 Views?': 'Combien YouTube Paie par 1 000 Vues ?',
        'YouTube CPM by Country (2026 Global Rates)': 'CPM YouTube par Pays (Taux Mondiaux 2026)',
        'How Much Do YouTube Shorts Pay Per View?': 'Combien les YouTube Shorts Paient par Vue ?',
        'How Much Do YouTubers Make Per Million Views?': 'Combien Gagnent les YouTubers par Million de Vues ?',
        'YouTube Monetization Explained — Ads, Shorts & Sponsorships': 'Monétisation YouTube Expliquée — Pubs, Shorts & Sponsoring',
        'How Much Does TikTok Pay Per View?': 'Combien TikTok Paie par Vue ?',
        'TikTok Creator Fund Payments Explained': 'Paiements du Creator Fund TikTok Expliqués',
        'How TikTok Influencers Make Money': 'Comment les Influenceurs TikTok Gagnent de l\'Argent',
        'TikTok vs YouTube Earnings — Which Pays More?': 'TikTok vs YouTube — Qui Paie le Plus ?',
        'How Many Followers to Make Money on TikTok?': 'Combien d\'Abonnés pour Gagner sur TikTok ?',
        'Instagram Influencer Rates — 2026 Pricing Guide': 'Tarifs Influenceurs Instagram — Guide des Prix 2026',
        'How Much Do Instagram Reels Pay Creators?': 'Combien les Instagram Reels Paient les Créateurs ?',
        'Instagram Engagement Rate Explained': "Taux d'Engagement Instagram Expliqué",
        'How Instagram Influencers Make Money': "Comment les Influenceurs Instagram Gagnent de l'Argent",
        'Instagram vs TikTok Earnings — Which Pays More?': 'Instagram vs TikTok — Qui Paie le Plus ?',
        'Spotify vs Apple Music Pay Per Stream': 'Spotify vs Apple Music : Paiement par Stream',
        'How Much Do Musicians Make From Streaming?': 'Combien les Musiciens Gagnent avec le Streaming ?',
        'How Spotify Royalties Work': 'Comment Fonctionnent les Royalties Spotify',
        'Average Spotify Pay Per Stream 2026': 'Paiement Moyen Spotify par Stream 2026',
        'How Streaming Revenue Is Calculated': 'Comment la Recette Streaming est Calculée',
        'How Creators Make Money Online — Every Income Stream': 'Comment les Créateurs Gagnent de l\'Argent en Ligne',
        'How Much Do Podcasters Make in 2026?': 'Combien Gagnent les Podcasteurs en 2026 ?',
        'Podcast Advertising Rates Explained': 'Tarifs Publicité Podcast Expliqués',
        'How Much Do Twitch Streamers Make?': 'Combien Gagnent les Streamers Twitch ?',
        'How Much Do Twitch Streamers Make Per Sub?': 'Combien Gagnent les Streamers Twitch par Abonnement ?',
        'Patreon Earnings Guide 2026': 'Guide des Revenus Patreon 2026',
        'OnlyFans Earnings Explained': 'Revenus OnlyFans Expliqués',
        'Creator Economy Growth Statistics 2026': "Statistiques de Croissance de l'Économie Créative 2026",
        'How to Build a Creator Business in 2026': 'Comment Construire une Activité de Créateur en 2026',
        'Top Creator Income Streams Ranked': 'Les Meilleures Sources de Revenus pour Créateurs',
        'YouTube · Featured': 'YouTube · À la Une', 'TikTok · Featured': 'TikTok · À la Une',
        'Instagram · Featured': 'Instagram · À la Une', 'Streaming · Featured': 'Streaming · À la Une',
        'Creator Economy · Featured': "Économie Créative · À la Une",
        'Read Guide →': 'Lire le Guide →',
        '8 min read': '8 min de lecture', '6 min read': '6 min de lecture',
        '5 min read': '5 min de lecture', '7 min read': '7 min de lecture',
        '9 min read': '9 min de lecture', '10 min read': '10 min de lecture',
        'About Kalkil': 'À propos de Kalkil',
        'Free, accurate earnings calculators and guides for every major creator platform — so you always know what your content is worth.': "Calculateurs de revenus gratuits et précis pour toutes les plateformes — pour que vous sachiez toujours ce que vaut votre contenu.",
        'Explore Calculators →': 'Explorer les Calculateurs →', 'Read Guides →': 'Lire les Guides →',
        '$0 Cost to use — always': '$0 Coût d\'utilisation — toujours',
        '14 Free calculators': '14 Calculateurs gratuits',
        '30 Creator economy guides': "30 Guides économie créative",
        '6 Platforms covered': '6 Plateformes couvertes',
        'Our Mission': 'Notre Mission',
        'Creator economy data should be free and honest': "Les données de l'économie créative doivent être gratuites et honnêtes",
        'What Kalkil Offers': 'Ce que Kalkil Propose',
        'Three tools to understand creator income': 'Trois outils pour comprendre les revenus des créateurs',
        'The Creator Economy': "L'Économie Créative",
        "A $500B industry most creators don't fully understand": "Une industrie de 500 milliards que la plupart des créateurs ne comprennent pas",
        'Our Vision': 'Notre Vision',
        'Get Started': 'Commencer',
        'Start with a free calculator': 'Commencez avec un calculateur gratuit',
        'No account. No paywall. Pick your platform and see your estimated earnings in seconds.': "Sans compte. Sans paywall. Choisissez votre plateforme et voyez vos revenus estimés en quelques secondes.",
        'Explore All 14 Calculators →': 'Explorer les 14 Calculateurs →',
        'Browse 30 Free Guides →': 'Voir les 30 Guides Gratuits →',
        'Creator Earnings Calculators': 'Calculateurs de Revenus pour Créateurs',
        'Creator Economy Guides': "Guides Économie Créative",
        'Transparent Platform Insights': 'Données Transparentes des Plateformes',
        'Explore all calculators →': 'Explorer tous les calculateurs →',
        'Browse all guides →': 'Voir tous les guides →',
        'See income streams guide →': 'Voir le guide des revenus →',
        'Real earnings data, not estimates pulled from thin air': 'Données réelles, pas des estimations inventées',
        'Always free — no account, no paywall': 'Toujours gratuit — sans compte, sans paywall',
        'Platform-specific, not one-size-fits-all': 'Spécifique à chaque plateforme, pas générique',
        'Accessible to every creator, everywhere': 'Accessible à tous les créateurs, partout',
        'Expanding across every major platform': 'Extension à toutes les plateformes majeures',
        'Always up to date': 'Toujours à jour',
        'Education over hype': "L'éducation plutôt que le marketing",
        '✓ Free · No sign-up · Instant results': '✓ Gratuit · Sans inscription · Résultats instantanés',
        'Calculate Earnings': 'Calculer les Revenus',
        'Reset': 'Réinitialiser',
        'Monthly Views': 'Vues Mensuelles',
        'Content Niche': 'Niche de Contenu',
        'Your CPM ($)': 'Votre CPM ($)',
        'Monthly AdSense (RPM)': 'AdSense Mensuel (RPM)',
        'Your RPM': 'Votre RPM',
        'Per 1 Million Views': 'Par 1 Million de Vues',
        'Annual Estimate': 'Estimation Annuelle',
        'How YouTube Calculates Creator Revenue': 'Comment YouTube Calcule les Revenus des Créateurs',
        'Average YouTube CPM by Niche (2026)': 'CPM Moyen YouTube par Niche (2026)',
        'Factors That Affect Your YouTube Earnings': 'Facteurs qui Affectent vos Revenus YouTube',
        'Want to understand the numbers?': 'Vous voulez comprendre les chiffres ?',
        'Read our free in-depth guide explaining exactly how this platform pays creators.': 'Lisez notre guide gratuit expliquant exactement comment cette plateforme paie les créateurs.',
        'Read the Guide →': 'Lire le Guide →',
        'More Calculators': 'Plus de Calculateurs',
        'Kalkil Pro': 'Kalkil Pro',
        'See all your income in one place': 'Voyez tous vos revenus en un seul endroit',
        'YouTube, Spotify, TikTok, Twitch and more — unified dashboard with benchmarks and projections.': 'YouTube, Spotify, TikTok, Twitch et plus — tableau de bord unifié avec benchmarks et projections pour créateurs francophones.',
        'Try Kalkil Pro Free →': 'Essayer Kalkil Pro Gratuitement →',
        'Free to start · No credit card required': 'Gratuit pour commencer · Sans carte bancaire',
        'CPM to RPM breakdown': 'Détail CPM vers RPM',
        'Shorts RPM vs long-form': 'RPM Shorts vs format long',
        'Brand deal value': 'Valeur deal marque',
        'Creator Rewards + deals': 'Creator Rewards + deals',
      },
      _htmlMap: {
        'Free Creator Earnings Calculators': 'Calculateurs Gratuits de<br><em>Revenus</em> pour Créateurs',
        'Learn How Creators Actually Make Money': 'Découvrez Comment les Créateurs<br>Gagnent <em>Vraiment</em> de l\'Argent',
        'Making Creator Income Transparent': 'Rendre Transparent<br>le Revenu des <em>Créateurs</em>',
        'A creator economy where everyone knows the numbers': "Une économie créative où <em>tout le monde</em> connaît les chiffres",
      },
    }
  };

  /* ─────────────────────────────────────────
     NAV LINK AUTO-TRANSLATION
  ───────────────────────────────────────── */
  var NAV_MAP = {
    'Home': 'nav.home', 'Inicio': 'nav.home', 'Início': 'nav.home', 'Accueil': 'nav.home',
    'Tools': 'nav.tools', 'Herramientas': 'nav.tools', 'Ferramentas': 'nav.tools', 'Outils': 'nav.tools',
    'Guides': 'nav.guides', 'Guías': 'nav.guides', 'Guias': 'nav.guides',
    'About': 'nav.about', 'Sobre Nosotros': 'nav.about', 'Sobre': 'nav.about', 'À propos': 'nav.about',
    'All Calculators': 'nav.cta', 'All Calculators →': 'nav.cta',
    'Read Guides': 'guides.label', 'Read Guides →': 'guides.label',
  };

  /* selectors to auto-translate via textMap */
  var TEXT_SELECTORS = [
    '.hero-eyebrow', '.hero-sub', '.cat-title', '.cat-desc', '.cat-count',
    '.cluster-title', '.cluster-desc', '.cluster-count',
    '.card-title', '.card-desc', '.card-badge', '.card-free',
    '.li', 'li', '.section-label', '.how-title', '.how-desc',
    '.guide-title', '.guide-desc', '.guide-read',
    '.stat-lbl', '.stat-label', '.footer-tagline',
    '.result-label', '.result-note', 'label',
    '.free-tag', '.open-btn', '.btn-primary', '.btn-outline',
    '.offer-title', '.offer-desc', '.offer-link',
    '.mission-title', '.mission-desc',
    '.vision-title', '.vision-desc',
    '.read-time', '.card-features li',
    'h3', '.cta-title', '.cta-desc',
    '.pro-overline', '.pro-note',
    '.related-title', '.related-desc',
  ].join(',');

  var HTML_SELECTORS = 'h1, h2';

  var currentLang = 'en';

  function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }

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
    if (document.getElementById('lang-switcher')) return;
    var navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    var div = document.createElement('div');
    div.id = 'lang-switcher';
    var lastLink = navLinks.querySelector('a.nav-cta') || navLinks.querySelector('a:last-child');
    if (lastLink) navLinks.insertBefore(div, lastLink);
    else navLinks.appendChild(div);
  }

  function apply(lang) {
    var t = T[lang];
    if (!t) return;

    /* 1. data-i18n attributes (home page) */
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) el.textContent = t[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    /* 2. Nav links auto-translation */
    document.querySelectorAll('.nav-links a').forEach(function(a) {
      var txt = norm(a.textContent);
      var key = NAV_MAP[txt];
      if (key && t[key]) a.textContent = t[key];
    });

    /* 3. textMap: auto-translate elements by English text content */
    if (lang !== 'en' && t._textMap) {
      var map = t._textMap;
      document.querySelectorAll(TEXT_SELECTORS).forEach(function(el) {
        if (el.hasAttribute('data-i18n') || el.hasAttribute('data-i18n-html')) return;
        /* skip if element has meaningful child elements (not just spans/em/br) */
        var hasBlockChildren = false;
        el.childNodes.forEach(function(n) {
          if (n.nodeType === 1 && ['DIV','P','UL','OL','H1','H2','H3','SECTION'].indexOf(n.tagName) !== -1) hasBlockChildren = true;
        });
        if (hasBlockChildren) return;
        var key = norm(el.textContent);
        if (map[key]) el.textContent = map[key];
      });

      /* 4. htmlMap: translate h1/h2 headings that have br/em inside */
      if (t._htmlMap) {
        document.querySelectorAll(HTML_SELECTORS).forEach(function(el) {
          if (el.hasAttribute('data-i18n') || el.hasAttribute('data-i18n-html')) return;
          var key = norm(el.textContent);
          if (t._htmlMap[key]) el.innerHTML = t._htmlMap[key];
        });
      }

      /* 5. Filter tabs (.ftab[data-cat]) — translate only text nodes, preserve count span */
      var ftabLabels = {
        es: { all: 'Todas', youtube: 'YouTube', social: 'TikTok e Instagram', streaming: 'Streaming', creator: 'Economía Creativa' },
        pt: { all: 'Todas', youtube: 'YouTube', social: 'TikTok e Instagram', streaming: 'Streaming', creator: 'Economia Criativa' },
        fr: { all: 'Tous', youtube: 'YouTube', social: 'TikTok & Instagram', streaming: 'Streaming', creator: 'Économie Créative' },
      };
      var ftab = ftabLabels[lang];
      if (ftab) {
        document.querySelectorAll('.ftab[data-cat]').forEach(function(btn) {
          var cat = btn.getAttribute('data-cat');
          if (!ftab[cat]) return;
          btn.childNodes.forEach(function(node) {
            if (node.nodeType === 3 && norm(node.textContent)) {
              node.textContent = ftab[cat] + ' ';
            }
          });
        });
      }
    }

    /* 6. Meta + html lang + URL */
    if (t['meta.title']) document.title = t['meta.title'];
    var descEl = document.querySelector('meta[name="description"]');
    if (descEl && t['meta.desc']) descEl.setAttribute('content', t['meta.desc']);
    document.documentElement.setAttribute('lang', lang);
    var url = new URL(window.location.href);
    if (lang === 'en') url.searchParams.delete('lang');
    else url.searchParams.set('lang', lang);
    history.replaceState({}, '', url.toString());

    /* 7. Switcher active state */
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
