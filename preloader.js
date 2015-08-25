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
		};
		this.time = {
			start: 0,
			end: 0,
		};
		this.total = 0;
		this.images = [];
		this._queue = [];

		if(onCompl && images && images.length) {
			this.enqueue(...images);
			this.preload();
		}
	}

	enqueue(...elements) {
		if(elements)
			this._queue.splice(0, 0, ...elements.map(elem => (typeof elem === 'string') ? {source: elem} : elem));
		return this;
	}

	preload(cbk) {
		this.onComplete = cbk || this.onComplete;
		this.time.start = preloader.getTimestamp();
		this.total = this._queue.length;
		this._queue.forEach(queued => {
			let index = this.images.length;
			let image = new Image();

			this.images.push({
				index,
				image,
				size: {
					width: 0,
					height: 0,
				},
			});
			image.onload = image.onerror = image.onabort = () => this._finish(index, image);
			image.src = queued.source + (this.config.cache ? '' : ('?__preloader_cache_invalidator=' + preloader.getTimestamp()));
		});
		this._queue.length = 0;
	}

	preloadCSSImages(cbk) {
		this.enqueue(...this._getCSSImages()).preload(cbk);
	}

	_finish(index, image) {
		--this.total;
		(this.images.find(img => img.index == index) || {}).size = {
			width: image.width,
			height: image.height,
		};

		if(!this.total) {
			this.time.end = preloader.getTimestamp();
			this.onComplete({
				time: Math.round(this.time.end - this.time.start),
				images: this.images,
			});
		}
	}

	_getCSSRules() {
		const allrules = [];
		const safeRules = sheet => {
			try {
				return sheet.rules || sheet.cssRules || [];
			} catch(e) {
				if(e.name !== 'SecurityError')
					throw e;
				return [];
			}
		};
		const collectorRaw = rules => {
			Array.prototype.forEach.call(rules, rule => {
				allrules.push({
					rule,
					selectorText: rule.selectorText || null,
					declaration: rule.cssText || rule.style.cssText,
				});

				collector(rule.styleSheet || {});
			});
		};
		const collector = sheet => collectorRaw(safeRules(sheet));

		Array.prototype.forEach.call(document.styleSheets, sheet => {
			collector(sheet);
			(sheet.imports || []).forEach(collector);
		});

		return allrules;
	}

	_getCSSImages() {
		const images = [];
		this._getCSSRules().forEach(rule => images.splice(0, 0, ...rule.declaration.match(/[^(|'"]+.(jpg|jpeg|gif|png|apng|bmp)\)?/ig)));  // formats from https://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support
		return images;
	}
}

