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


.PHONY : minify clean


minify :
	cat preloader.js | awk "{gsub(/\\/\\/.*/, \"\"); print}" | awk "{gsub(/^\\s+/, \" \"); print}" | grep -v "^[[:space:]]*$$" | sed -r ":a; s%(.*)/\*.*\*/%\1%; ta; /\/\*/ !b; N; ba" | tr -d "\\n" | sed "s/{[[:space:]]/{/g" | sed "s/[[:space:]]{/{/g" | sed "s/}[[:space:]]/}/g" | sed "s/[[:space:]]}/}/g" | sed "s/;[[:space:]]/;/g" | sed "s/[[:space:]]=/=/g" | sed "s/=[[:space:]]/=/g" | sed "s/[[:space:]]+[[:space:]]/+/g" | sed "s/[[:space:]]-[[:space:]]/-/g" | sed "s=[[:space:]]/[[:space:]]=/=g"> preloader.min.js

#	minifyjs --minify --level=0 --engine uglify --input preloader.js --output preloader.min.js

clean :
	rm -f preloader.min.js

