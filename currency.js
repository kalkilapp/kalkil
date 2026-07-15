/**
 * Selector de moneda para las calculadoras — independiente del idioma de la interfaz.
 * Default: USD siempre (los creators piensan en USD porque así les paga la plataforma
 * de verdad, sin importar en qué idioma leen la página). El usuario puede cambiar a
 * cualquiera de las 8 monedas del continente americano + EUR; la elección se guarda en
 * localStorage y se mantiene entre calculadoras/idiomas.
 *
 * Tasas: open.er-api.com (gratis, sin key, actualiza diario), cacheadas 24h en
 * localStorage. Si la API falla, usa tasas aproximadas hardcodeadas como fallback —
 * mejor una cifra desactualizada que una calculadora rota.
 */
(function () {
  var CURRENCIES = {
    USD: { symbol: '$', locale: 'en-US', name: 'US Dollar' },
    CAD: { symbol: 'CA$', locale: 'en-CA', name: 'Canadian Dollar' },
    MXN: { symbol: '$', locale: 'es-MX', name: 'Mexican Peso' },
    COP: { symbol: '$', locale: 'es-CO', name: 'Colombian Peso' },
    ARS: { symbol: '$', locale: 'es-AR', name: 'Argentine Peso' },
    CLP: { symbol: '$', locale: 'es-CL', name: 'Chilean Peso' },
    PEN: { symbol: 'S/', locale: 'es-PE', name: 'Peruvian Sol' },
    BRL: { symbol: 'R$', locale: 'pt-BR', name: 'Brazilian Real' },
    EUR: { symbol: '€', locale: 'fr-FR', name: 'Euro' },
  };
  var FALLBACK_RATES = { USD: 1, CAD: 1.39, MXN: 17.5, COP: 4000, ARS: 1300, CLP: 950, PEN: 3.7, BRL: 5.5, EUR: 0.92 };
  var ZERO_DECIMAL = { COP: true, CLP: true }; // monedas sin decimales de uso práctico

  var RATES_KEY = 'kalkil-fx-rates';
  var RATES_TTL = 24 * 60 * 60 * 1000;
  var CURRENCY_KEY = 'kalkil-currency';

  function getCurrency() {
    try {
      var c = localStorage.getItem(CURRENCY_KEY);
      return c && CURRENCIES[c] ? c : 'USD';
    } catch (e) { return 'USD'; }
  }
  function setCurrency(code) {
    try { localStorage.setItem(CURRENCY_KEY, code); } catch (e) {}
  }

  function getCachedRates() {
    try {
      var raw = localStorage.getItem(RATES_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (Date.now() - data.timestamp > RATES_TTL) return null;
      return data.rates;
    } catch (e) { return null; }
  }
  function setCachedRates(rates) {
    try { localStorage.setItem(RATES_KEY, JSON.stringify({ rates: rates, timestamp: Date.now() })); } catch (e) {}
  }

  var ratesPromise = null;
  function loadRates() {
    var cached = getCachedRates();
    if (cached) return Promise.resolve(cached);
    if (ratesPromise) return ratesPromise;
    ratesPromise = fetch('https://open.er-api.com/v6/latest/USD')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var rates = (data && data.rates) || FALLBACK_RATES;
        setCachedRates(rates);
        return rates;
      })
      .catch(function () { return FALLBACK_RATES; });
    return ratesPromise;
  }

  function fmtMoney(usdAmount, rates) {
    var code = getCurrency();
    var cfg = CURRENCIES[code] || CURRENCIES.USD;
    var rate = (rates && rates[code]) || FALLBACK_RATES[code] || 1;
    var n = usdAmount * rate;
    var neg = n < 0;
    var abs = Math.abs(n);
    var decimals = ZERO_DECIMAL[code] ? 0 : 2;
    var out;
    if (abs >= 1000000) out = (abs / 1000000).toFixed(2) + 'M';
    else if (abs >= 1000) out = Math.round(abs).toLocaleString(cfg.locale);
    else out = abs.toFixed(decimals);
    return (neg ? '-' : '') + cfg.symbol + out;
  }

  var listeners = [];
  window.KalkilCurrency = {
    CURRENCIES: CURRENCIES,
    get: getCurrency,
    onChange: function (fn) { listeners.push(fn); },
    format: function (usdAmount) {
      return fmtMoney(usdAmount, getCachedRates());
    },
    renderSelector: function (containerId) {
      var container = document.getElementById(containerId);
      if (!container) return;
      var current = getCurrency();
      var html = '<label class="currency-select-label">' +
        (document.documentElement.lang === 'es' ? 'Moneda' : document.documentElement.lang === 'pt' ? 'Moeda' : document.documentElement.lang === 'fr' ? 'Devise' : 'Currency') +
        '</label><select id="kalkil-currency-select" class="currency-select">';
      Object.keys(CURRENCIES).forEach(function (code) {
        html += '<option value="' + code + '"' + (code === current ? ' selected' : '') + '>' + code + '</option>';
      });
      html += '</select>';
      container.innerHTML = html;
      document.getElementById('kalkil-currency-select').addEventListener('change', function (e) {
        setCurrency(e.target.value);
        listeners.forEach(function (fn) { fn(e.target.value); });
      });
    },
  };

  // precarga tasas apenas carga la página; cuando llegan (o si ya estaban cacheadas),
  // dispara los listeners una vez para refrescar cualquier resultado ya calculado
  loadRates().then(function () {
    listeners.forEach(function (fn) { fn(getCurrency()); });
  });
})();
