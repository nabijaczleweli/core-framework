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
		const perfnow = window.performance.now || window.performance.webkitNow;
		return perfnow ? perfnow.call(window.performance) : new Date().getTime();
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

		if(onCompl && images.length) {
			this.enqueue(...images);
			this.preload();
		}
	}

	enqueue(...elements) {
		this._queue = this._queue.concat(elements.map(elem => {(typeof elem === 'string') ? {source: elem} : elem}));
		return this;
	}

	finish(index, image) {
		--this.total;
		this.images.forEach(img => {
			if(img.index == index)
				img.size = {
					width: image.width,
					height: image.heigth,
				}
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
			image.onload = image.onerror = image.onabort = (() => this.finish(index, image));
			image.src = this._queue[index].source + (this.config.cache ? ('?__preloader_cache_invalidator=' + preloader.getTimestamp()) : '');
		}
	}
}

/*	preloadCSSImages(cbk) {
		this.queue(this.getCSSImages()).preload(cbk);
	}*/

//TODO: implement getting CSS images	

/*
            return {
                onComplete: function(ui) {},
                images: function() {
                    return images;
                },
                reset: function() {
                    queue = [];
                    images = [];
                    total = 0;
                    return this;
                },
                queue: function(element) {
                    if (Core.pattern.isString(element)) {
                        queue.push({
                            source: element
                        });
                    } else {
                        $.each(element, function(index, element) {
                            queue.push(element);
                        });
                    }
                    return this;
                },
                finish: function(event, index, image) {
                    total--;
                    $.each(images, function(x, i) {
                        if (i.index == index) {
                            i.size = {
                                width: image.width,
                                height: image.height
                            };
                        }
                    });
                    if (0 == total) {
                        time.end = new Date().getTime();
                        this.onComplete.apply(this, [ {
                            time: ((time.end - time.start) / 1e3).toPrecision(2),
                            images: images
                        } ]);
                    }
                },
                preload: function(callback) {
                    this.onComplete = callback || this.onComplete;
                    time.start = new Date().getTime();
                    total = i = queue.length;
                    while (i--) {
                        var image = new Image();
                        images.push({
                            index: i,
                            image: image,
                            size: {
                                width: 0,
                                height: 0
                            }
                        });
                        image.onload = Core.delegate(this, this.finish, [ i, image ]);
                        image.onerror = Core.delegate(this, this.finish, [ i, image ]);
                        image.onabort = Core.delegate(this, this.finish, [ i, image ]);
                        image.src = config.cache ? queue[i].source : queue[i].source + "?u=" + new Date().getTime();
                    }
                },
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
            };
        }()
    });*/

