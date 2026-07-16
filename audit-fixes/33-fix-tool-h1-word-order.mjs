#!/usr/bin/env node
/**
 * Verificación final antes de cerrar todo el trabajo de internacionalización — al
 * probar el switcher de idioma en vivo se notó que el H1 de algunas calculadoras
 * suena mal ("Royalties do Spotify Calculadora" en vez de "Calculadora de Royalties
 * do Spotify"). Investigado: es un bug sistemático en la plantilla original usada
 * para traducir las 14 calculadoras — presente en LOS TRES idiomas (ES/PT/FR), no
 * introducido en esta sesión. Dos patrones de error:
 *
 *   1. Orden de palabras invertido: el <em> (la palabra en verde) quedó pegado a
 *      "Calculadora/Calculateur" en vez de al final de la frase, dejando el nombre
 *      de la plataforma o el sustantivo principal antes que el propio "Calculadora".
 *   2. Doble espacio o espacio después del <em> de apertura (artefacto de
 *      concatenación de strings en el proceso de traducción original).
 *
 * Uso: node audit-fixes/33-fix-tool-h1-word-order.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '..');

const FIXES = {
  'pt/tools/calculadora-fundo-criadores-tiktok.html':
    ['<h1>Ganhos do TikTok <em>Calculadora</em></h1>', '<h1>Calculadora de <em>Ganhos do TikTok</em></h1>'],
  'pt/tools/calculadora-ganhos-instagram.html':
    ['<h1>Ganhos do Instagram <em>Calculadora</em></h1>', '<h1>Calculadora de <em>Ganhos do Instagram</em></h1>'],
  'pt/tools/calculadora-ganhos-twitch.html':
    ['<h1>Ganhos do Twitch <em>Calculadora</em></h1>', '<h1>Calculadora de <em>Ganhos do Twitch</em></h1>'],
  'pt/tools/calculadora-royalties-spotify.html':
    ['<h1>Royalties do Spotify <em>Calculadora</em></h1>', '<h1>Calculadora de <em>Royalties do Spotify</em></h1>'],
  'pt/tools/calculadora-youtube-shorts.html':
    ['<h1>YouTube Shorts <em>Calculadora</em></h1>', '<h1>Calculadora do <em>YouTube Shorts</em></h1>'],
  'pt/tools/calculadora-dinheiro-youtube.html':
    ['<h1>Calculadora de Ganhos do  <em>YouTube</em></h1>', '<h1>Calculadora de Ganhos do <em>YouTube</em></h1>'],
  'pt/tools/calculadora-tarifa-influenciador.html':
    ['<h1>Calculadora de Tarifas para  <em>Influenciadores</em></h1>', '<h1>Calculadora de Tarifas para <em>Influenciadores</em></h1>'],
  'pt/tools/calculadora-taxa-engajamento-instagram.html':
    ['<h1>Calculadora de Engajamento <em> do Instagram</em></h1>', '<h1>Calculadora de Engajamento <em>do Instagram</em></h1>'],

  'es/tools/calculadora-fondo-creadores-tiktok.html':
    ['<h1>Ingresos de TikTok <em>Calculadora</em></h1>', '<h1>Calculadora de <em>Ingresos de TikTok</em></h1>'],
  'es/tools/calculadora-ganancias-instagram.html':
    ['<h1>Ganancias de Instagram <em>Calculadora</em></h1>', '<h1>Calculadora de <em>Ganancias de Instagram</em></h1>'],
  'es/tools/calculadora-ganancias-twitch.html':
    ['<h1>Ganancias de Twitch <em>Calculadora</em></h1>', '<h1>Calculadora de <em>Ganancias de Twitch</em></h1>'],
  'es/tools/calculadora-regalias-spotify.html':
    ['<h1>Regalías de Spotify <em>Calculadora</em></h1>', '<h1>Calculadora de <em>Regalías de Spotify</em></h1>'],
  'es/tools/calculadora-youtube-shorts.html':
    ['<h1>YouTube Shorts <em>Calculadora</em></h1>', '<h1>Calculadora de <em>YouTube Shorts</em></h1>'],
  'es/tools/calculadora-dinero-tiktok.html':
    [/<h1>Calculadora de Ingresos de  <em>TikTok<\/em><\/h1>/, '<h1>Calculadora de Ingresos de <em>TikTok</em></h1>'],
  'es/tools/calculadora-dinero-youtube.html':
    [/<h1>Calculadora de Ingresos de  <em>YouTube<\/em><\/h1>/, '<h1>Calculadora de Ingresos de <em>YouTube</em></h1>'],
  'es/tools/calculadora-engagement-instagram.html':
    ['<h1>Calculadora de Engagement <em> de Instagram</em></h1>', '<h1>Calculadora de Engagement <em>de Instagram</em></h1>'],
  'es/tools/calculadora-tarifas-influencer.html':
    ['<h1>Calculadora de Tarifas para  <em>Influencers</em></h1>', '<h1>Calculadora de Tarifas para <em>Influencers</em></h1>'],

  'fr/tools/calculateur-fonds-createurs-tiktok.html':
    ['<h1>Revenus TikTok <em>Calculateur</em></h1>', '<h1>Calculateur de <em>Revenus TikTok</em></h1>'],
  'fr/tools/calculateur-revenus-instagram.html':
    ['<h1>Revenus Instagram <em>Calculateur</em></h1>', '<h1>Calculateur de <em>Revenus Instagram</em></h1>'],
  'fr/tools/calculateur-revenus-twitch.html':
    ['<h1>Revenus Twitch <em>Calculateur</em></h1>', '<h1>Calculateur de <em>Revenus Twitch</em></h1>'],
  'fr/tools/calculateur-royalties-spotify.html':
    ['<h1>Redevances Spotify <em>Calculateur</em></h1>', '<h1>Calculateur de <em>Redevances Spotify</em></h1>'],
  'fr/tools/calculateur-youtube-shorts.html':
    ['<h1>YouTube Shorts <em>Calculateur</em></h1>', '<h1>Calculateur <em>YouTube Shorts</em></h1>'],
  'fr/tools/calculateur-revenus-youtube.html':
    ['<h1>Calculateur de Revenus  <em>YouTube</em></h1>', '<h1>Calculateur de Revenus <em>YouTube</em></h1>'],
  'fr/tools/calculateur-tarif-influenceur.html':
    ['<h1>Calculateur de Tarifs pour  <em>Influenceurs</em></h1>', '<h1>Calculateur de Tarifs pour <em>Influenceurs</em></h1>'],
  'fr/tools/calculateur-taux-engagement-instagram.html':
    ["<h1>Calculateur de Taux d'Engagement <em> Instagram</em></h1>", "<h1>Calculateur de Taux d'Engagement <em>Instagram</em></h1>"],
};

let fixed = 0;
for (const [rel, [oldStr, newStr]] of Object.entries(FIXES)) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { console.log(`[SKIP] no existe ${rel}`); continue; }
  let html = fs.readFileSync(abs, 'utf8');
  const before = html;
  if (oldStr instanceof RegExp) html = html.replace(oldStr, newStr);
  else html = html.split(oldStr).join(newStr);
  if (html === before) { console.log(`[WARN] ${rel}: el H1 esperado no se encontró, sin cambios`); continue; }
  fs.writeFileSync(abs, html, 'utf8');
  fixed++;
}
console.log(`${fixed}/${Object.keys(FIXES).length} archivos corregidos`);
