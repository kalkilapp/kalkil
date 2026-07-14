#!/usr/bin/env bash
# Necesario para que el pre-render (08-generate-i18n-pages.mjs) sea correcto en runtime:
# hoy detect() prioriza ?lang= > localStorage > navigator.language > 'en'. Una vez que
# existan /es/, /pt/, /fr/ como HTML real, si un usuario visita /es/index.html directo
# (sin ?lang=es en la URL) y tiene localStorage['kalkil-lang']='en' de una visita previa,
# i18n.js reescribiría la página ya-en-español de vuelta a inglés en el cliente — un
# render flash + contenido inconsistente con lo que Google indexó en esa URL.
# Fix: el prefijo de path (/es/, /pt/, /fr/) manda sobre todo lo demás cuando existe.

set -euo pipefail
cd "$(dirname "$0")/.."

perl -0777 -pi -e "s/(function detect\(\) \{\n)(    var p = new URLSearchParams)/\1    var path = window.location.pathname.match(\/^\\\\\/(es|pt|fr)\\\\\/\/);\n    if (path) { _save(path[1]); return path[1]; }\n\2/" i18n.js

echo "Verificación:"
sed -n '/function detect/,/^  }/p' i18n.js
