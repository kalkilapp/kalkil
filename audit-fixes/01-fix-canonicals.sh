#!/usr/bin/env bash
# Fix root cause: 47 páginas sin <link rel="canonical">, 10 con dominio erróneo kalkil.com,
# + JSON-LD de index.html apuntando a kalkil.com.
# No hay plantilla compartida (head hardcodeado en cada uno de los 58 HTML), así que el fix
# tiene que tocar archivo por archivo. Este script automatiza esa pasada única.
#
# Uso:
#   cd /Users/ostin/Desktop/Kalkil
#   bash audit-fixes/01-fix-canonicals.sh          # aplica
#   bash audit-fixes/01-fix-canonicals.sh --dry-run # solo muestra qué haría

set -euo pipefail
DOMAIN="https://kalkilapp.com"
DRY_RUN=false
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=true

cd "$(dirname "$0")/.."

fix_file() {
  local file="$1"
  local urlpath="$2"   # ej: "" para home, "tools.html", "guides/foo.html"
  local canonical="${DOMAIN}/${urlpath}"

  if grep -q 'rel="canonical"' "$file"; then
    # Ya tiene canonical: corregir solo si domain está mal
    if grep -q 'rel="canonical"[^>]*kalkil\.com' "$file"; then
      if $DRY_RUN; then
        echo "[FIX DOMAIN] $file"
      else
        sed -i '' -E 's#(rel="canonical"[^>]*href=")https://kalkil\.com#\1https://kalkilapp.com#' "$file"
        echo "[FIXED DOMAIN] $file -> $canonical"
      fi
    fi
  else
    # No tiene canonical: insertarlo después de la línea del viewport meta
    if $DRY_RUN; then
      echo "[INSERT] $file -> $canonical"
    else
      # inserta después de la primera línea que matchea el viewport meta
      perl -0pi -e "s#(<meta name=\"viewport\"[^>]*>\n)#\$1  <link rel=\"canonical\" href=\"${canonical}\">\n#" "$file"
      echo "[INSERTED] $file -> $canonical"
    fi
  fi
}

# Home
fix_file "index.html" ""

# Nivel raíz
for f in tools.html guides.html about.html; do
  fix_file "$f" "$f"
done

# Guides
for f in guides/*.html; do
  [[ "$(basename "$f")" == "guide-style.css" ]] && continue
  fix_file "$f" "$f"
done

# Tools
for f in tools/*.html; do
  fix_file "$f" "$f"
done

echo ""
echo "=== JSON-LD de index.html (dominio erróneo en Organization/WebSite schema) ==="
if $DRY_RUN; then
  grep -n "kalkil\.com" index.html | grep -v "kalkilapp\.com" || echo "  (nada que corregir)"
else
  sed -i '' 's#https://kalkil\.com#https://kalkilapp.com#g' index.html
  echo "  Corregido en index.html (líneas del bloque application/ld+json)"
fi

if ! $DRY_RUN; then
  echo ""
  echo "Verificación post-fix:"
  echo "  Archivos SIN canonical: $(grep -rL 'rel="canonical"' --include='*.html' . | grep -v 'open index.html' | wc -l | tr -d ' ')"
  echo "  Archivos con canonical apuntando a kalkil.com (mal): $(grep -rn 'rel=\"canonical\"' --include='*.html' . | grep 'kalkil\.com' | grep -v 'kalkilapp\.com' | wc -l | tr -d ' ')"
fi
