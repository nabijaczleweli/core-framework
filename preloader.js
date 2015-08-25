// The MIT License (MIT)

// Copyright (c) 2015 nabijaczleweli

//  Permission is hereby granted, free of charge, to any person obtaining a
//  copy of this software and associated documentation files (the "Software"),
//  to deal in the Software without restriction, including without limitation
//  the rights to use, copy, modify, merge, publish, distribute, sublicense,
//  and/or sell copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
//  OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//  DEALINGS IN THE SOFTWARE.


export default class preloader {
	static getTimestamp() {
		return (window.performance.now || window.performance.webkitNow || Date.now).call(window.performance);
	}

	constructor(onCompl, ...images) {
		this.onComplete = onCompl;
		this.config = {
			cache: true,
			parallel: true,
		};
		this.time = {
			start: 0,
			end: 0,
		};
		this.total = 0;
		this.images = [];
		this._queue = [];

		if(onCompl && images) {
			this.enqueue(...images);
			this.preload();
		}
	}

	enqueue(...elements) {
		this._queue = this._queue.concat(elements.map(elem => ((typeof elem === 'string') ? {source: elem} : elem)));
		return this;
	}

	_finish(index, image) {
		--this.total;
		this.images.forEach(img => {
			if(img.index == index)
				img.size = {
					width: image.width,
					height: image.heigth,
				};
		});

		if(!this.total) {	
			this.time.end = new Date().getTime();
			this.onComplete({
				time: Math.round(this.time.end - this.time.start),
				images: this.images
			});
		}
	}

	preload(cbk) {
		this.onComplete = cbk || this.onComplete;
		this.time.start = preloader.getTimestamp();
		this.total = this._queue.length;
		for(let index = this.total; --index;) {
			let image = new Image();
			this.images.push({
				index,
				image,
				size: {
					width: 0,
					height: 0
				}
			});
			image.onload = image.onerror = image.onabort = (() => this._finish(index, image));
			image.src = this._queue[index].source + (this.config.cache ? '' : ('?__preloader_cache_invalidator=' + preloader.getTimestamp()));
		}
	}

	preloadCSSImages(cbk) {
		this.enqueue(...this.getCSSImages()).preload(cbk);
	}

	_getCSSRules() {
		const allrules = [];
		const collectorRaw = rules => {
			rules.forEach(rule => {
				allrules.push({
					rule,
					selectorText: rule.selectorText || null,
					declaration: rule.cssText || rule.style.cssText
				});

				collector(rule.styleSheet || {});
			});
		};
		const collector = sheet => collectorRaw(sheet.rules || sheet.cssRules || []);

		document.forEach(sheet => {
			collector(sheet.rules || sheet.cssRules);
			(sheet.imports || []).forEach(collector);
		});

		return allrules;
	}

	_getCSSImages() {
		return this._getCSSRules().reduce((prev, cur) => prev.concat(cur.declaration.match(/[^(|'"]+.(jpg|jpeg|gif|png|apng|bmp)\)?/ig)), []);  // formats from https://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support
	}
}

/*
                getCssImages: function() {
                    var rules = this.getCssRules(), i = rules.length, images = [], regex = new RegExp("[^(|'\"]+.(gif|jpg|jpeg|png)\\)?", "ig");
                    while (i--) {
                        var img = rules[i].declaration.match(regex);
                        if (img && img.length) {
                            if (1 == img.length) {
                                images.push(img);
                            } else {
                                for (var i in img) {
                                    images.push(img[i]);
                                }
                            }
                        }
                    }
                    return images;
                }
                preloadCssImages: function(callback) {
                    var images = this.getCssImages();
                    this.queue(images).preload(callback);
                },
                getCssRules: function() {
                    var collection = [], data = {};
                    var Collect = {
                        rules: function(rules) {
                            var rule = rules.length;
                            while (rule--) {
                                data = {
                                    rule: rules[rule],
                                    selectorText: !rules[rule].selectorText ? null : rules[rule].selectorText,
                                    declaration: rules[rule].cssText ? rules[rule].cssText : rules[rule].style.cssText
                                };
                                collection.push(data);
                                var symlink = rules[rule].styleSheet || null;
                                if (symlink) {
                                    Collect.rules(symlink.cssRules);
                                }
                            }
                        }
                    };
                    var i = document.styleSheets.length;
                    while (i--) {
                        var sheet = {
                            rules: document.styleSheets[i].rules || document.styleSheets[i].cssRules,
                            imports: document.styleSheets[i].imports || []
                        };
                        Collect.rules(sheet.rules);
                        for (x = 0; x < sheet.imports.length; x++) {
                            Collect.rules(sheet.imports[x].rules || sheet.imports[x].cssRules);
                        }
                    }
                    return collection;
                },
            };
        }()
    });*/

