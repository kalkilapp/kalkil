#!/usr/bin/env bash
# Sección 6: cero eventos custom en GA4, solo automáticos. Las 14 calculadoras ya tienen
# GA instalado (gtag config) y una función calc() consistente — es el punto natural de
# menor fricción para instrumentar sin tocar la lógica de cálculo de cada una.
#
# Inserta gtag('event', 'calculator_result_viewed', {...}) como PRIMERA línea dentro de
# function calc(){ ... } en cada uno de los 14 archivos de tools/. No depende de nombres
# de variables internos (que difieren entre calculadoras), así que es seguro de aplicar
# igual en las 14 sin revisar cada una a mano.

set -euo pipefail
cd "$(dirname "$0")/.."

for f in tools/*.html; do
  slug=$(basename "$f" .html)
  if grep -q "calculator_result_viewed" "$f"; then
    echo "[SKIP] $f ya instrumentado"
    continue
  fi
  if ! grep -q "function calc(){" "$f"; then
    echo "[WARN] $f no tiene function calc() — revisar a mano"
    continue
  fi
  perl -pi -e "s/function calc\(\)\{/function calc(){\n      gtag('event','calculator_result_viewed',{calculator:'${slug}'});/" "$f"
  echo "[FIXED] $f"
done
