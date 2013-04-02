#! /bin/bash

[ -f require.js ] || wget 'http://requirejs.org/docs/release/2.1.5/comments/require.js'

./min.sh noexport
r.js -o baseUrl=. name=example-closure out=example-closure.one.js optimize=none \
        paths.requireLib=require include=requireLib

# Uncomment to see "orginal" var and property names.
#debug='--debug --formatting PRETTY_PRINT'

closure --js example-closure.one.js --js_output_file example-closure.min.js \
        --language_in ECMASCRIPT5_STRICT $debug \
        --compilation_level ADVANCED_OPTIMIZATIONS
