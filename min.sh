src='url.js'
dest="${1:-url.min.js}"
min='true'

if [ "$min" != 'true' ] ; then
	m="$(cat "$src")"
elif which closure &>/dev/null ; then
	m="$(closure --language_in ECMASCRIPT5 --js "$src" \
	             --compilation_level ADVANCED_OPTIMIZATIONS
	    )"
#elif which uglifyjs &>/dev/null ; then
#	m="$(uglifyjs "$src" -c -m --screw-ie8)"
else
	echo "Error: No minifier found.  Copping to dest."
	m="$(cat "$src")"
fi

m="(function(){$m})();"

echo "$m" > "$dest"

if which node &>/dev/null; then
	echo "Built, running tests..."
	node "test.js"
else
	echo "Node not found, skipping tests."
fi
