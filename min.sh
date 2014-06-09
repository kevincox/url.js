src='url.js'
dest='url.min.js'
min="${1:-true}"

#debug='--debug --formatting PRETTY_PRINT'

if [ "$min" == 'noexport' ] ; then
	m="$(perl -pe 's/\["([A-Za-z_]+)"\]/.$1/g; s/"([A-Za-z_]+)":/$1:/g' "$src")"
elif [ "$min" != 'true' ] ; then
	m="$(cat "$src")"
elif which uglifyjs &>/dev/null ; then
	m="$(uglifyjs "$src" -cm --screw-ie8 \
	               --source-map url.min.js.map --source-map-include-sources
	    )"
elif which closure &>/dev/null ; then
	m="$(closure --language_in ECMASCRIPT5_STRICT --js "$src" \
	             $debug \
	             --compilation_level ADVANCED_OPTIMIZATIONS \
	             --create_source_map url.min.js.map --source_map_format V3
	    )"
else
	echo "Error: No minifier found.  Copping to dest."
	m="$(cat "$src")"
fi

#m="(function(){$m})();"

echo "$m" > "$dest"
