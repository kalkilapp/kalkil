#!/usr/bin/env bash
# Sección 6: 3 archivos (no 2) sin snippet de GA — confirmado con:
#   grep -rL "gtag\|G-" --include="*.html" .
# Root cause: copy-paste manual del <head>; alguien olvidó pegar el bloque gtag en estos 3.
# No hay ninguna variable de entorno ni gate de dominio que condicione el snippet — es
# simplemente texto pegado (o no) en cada archivo. Ver sección 7 del reporte para el punto
# sobre por qué esto también significa que NO hay filtro de preview/localhost en código.

set -euo pipefail
cd "$(dirname "$0")/.."

SNIPPET_FILE="$(mktemp)"
export SNIPPET_FILE
trap 'rm -f "$SNIPPET_FILE"' EXIT
cat > "$SNIPPET_FILE" <<'EOF'
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-LG3D9JJE2T"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-LG3D9JJE2T');
</script>
EOF

FILES=(
  "tools/influencer-rate-calculator.html"
  "guides/how-much-does-youtube-pay-per-1000-views.html"
  "guides/how-instagram-influencers-make-money.html"
)

for f in "${FILES[@]}"; do
  if grep -q "gtag(" "$f"; then
    echo "[SKIP] $f ya tiene GA"
    continue
  fi
  # Insertar justo antes de </head>
  perl -0777 -pi -e 'BEGIN { local $/; open F, "<", $ENV{SNIPPET_FILE}; $s = <F>; } s#</head>#$s</head>#' "$f"
  echo "[FIXED] $f"
done
