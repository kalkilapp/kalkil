#!/usr/bin/env bash
# Sección 9: overflow de nav en mobile 375px.
# Causa exacta: `nav` y `.nav-links` son flex SIN flex-wrap en los 3 lugares donde vive
# el nav (index.html inline <style>, tools/calc-style.css, guides/guide-style.css). No
# existe hamburger menu en ningún archivo del repo (verificado: cero coincidencias de
# "hamburger|mobile-menu|menu-toggle|nav-toggle" en todo el proyecto). Con marca + 4 links
# + botón CTA (+ selector de idioma en home) en una sola fila sin wrap, a 375px no entra.
#
# Fix mínimo (sin construir un menú hamburguesa — eso sería sobre-ingeniería para esta
# etapa): permitir que el nav haga wrap a una segunda línea en vez de desbordar.

set -euo pipefail
cd "$(dirname "$0")/.."

# 1) index.html — nav inline styles
perl -pi -e "s/(\.nav-links \{ display: flex; gap: 32px; align-items: center; \})/.nav-links { display: flex; gap: 32px; align-items: center; flex-wrap: wrap; row-gap: 10px; justify-content: flex-end; }/" index.html
# el nuevo breakpoint 480px se agrega DESPUES del bloque 600px existente (que también
# matchea a 375px) para que gane en el cascade — si va antes, la regla `.nav-links{gap:16px}`
# del bloque 600px lo pisa por orden de fuente, sin importar que 480px sea más específico
perl -0777 -pi -e "s/(\@media \(max-width: 600px\) \{.*?\.nav-links \{ gap: 16px; \}\n    \})/\1\n    \@media (max-width: 480px) {\n      .nav-links { gap: 10px; justify-content: center; }\n    }/s" index.html

# 2) tools/calc-style.css
perl -pi -e "s/(\.nav-links \{ display: flex; gap: 28px; align-items: center; \})/.nav-links { display: flex; gap: 28px; align-items: center; flex-wrap: wrap; row-gap: 8px; justify-content: flex-end; }/" tools/calc-style.css
# ya existe `.nav-links { gap: 14px; }` dentro de @media(max-width:480px) — se reemplaza
# en vez de duplicar la regla para no pelear con el cascade (la última gana y anularía el fix)
perl -pi -e "s/\.nav-links \{ gap: 14px; \}/.nav-links { gap: 10px; justify-content: center; }/" tools/calc-style.css

# 3) guides/guide-style.css — nav-links aquí es un <div> normal (no flex), los <a> son
#    inline y ya wrappean solos; el riesgo es el propio `nav` (flex, sin wrap) empujando
#    contenido fuera de pantalla en vez de crecer en altura.
perl -0777 -pi -e "s/(nav \{\n  display: flex;\n  justify-content: space-between;\n  align-items: center;)/\1\n  flex-wrap: wrap;\n  row-gap: 8px;/" guides/guide-style.css

echo "Aplicado. Diff:"
git diff --stat index.html tools/calc-style.css guides/guide-style.css 2>/dev/null || true
