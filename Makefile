# The MIT License (MIT)

# Copyright (c) 2015 nabijaczleweli

# Permission is hereby granted, free of charge, to any person obtaining a copy of
# this software and associated documentation files (the "Software"), to deal in
# the Software without restriction, including without limitation the rights to
# use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
# the Software, and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
# FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
# COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
# IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


.PHONY : minify es5 clean

ifeq "$(OS)" "Windows_NT"
DEVNULL := nul
else
DEVNULL := /dev/null
endif

# Requires babel and minifyjs (both can be obtained via npm)

all : es5 minify

minify :
	minifyjs --minify --level=2 --input preloader.es5.js --output preloader.es5.min.js 2>$(DEVNULL) || :
	cat preloader.js | awk "{gsub(/\\/\\/.*/, \"\"); print}" | awk "{gsub(/^\\s+/, \" \"); print}" | grep -v "^[[:space:]]*$$" | sed -r ":a; s%(.*)/\*.*\*/%\1%; ta; /\/\*/ !b; N; ba" | sed -r 's/[[:space:]]*//' | tr -d "\\n" | sed "s/{[[:space:]]/{/g" | sed "s/[[:space:]]{/{/g" | sed "s/}[[:space:]]/}/g" | sed "s/[[:space:]]}/}/g" | sed "s/;[[:space:]]/;/g" | sed "s/[[:space:]]=/=/g" | sed "s/=[[:space:]]/=/g" | sed "s/[[:space:]]+[[:space:]]/+/g" | sed "s/[[:space:]]-[[:space:]]/-/g" | sed "s=[[:space:]]/[[:space:]]=/=g" | sed "s/[[:space:]]*||[[:space:]]*/||/g" | sed "s/[[:space:]]+?[[:space:]]+/?/g" > preloader.min.js

es5 : 
	babel --no-comments --modules umd --source-maps inline --out-file preloader.es5.js preloader.js

clean :
	rm -f preloader.*.js

