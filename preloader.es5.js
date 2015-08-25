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

'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var preloader = (function () {
	_createClass(preloader, null, [{
		key: 'getTimestamp',
		value: function getTimestamp() {
			return (window.performance.now || window.performance.webkitNow || Date.now).call(window.performance);
		}
	}]);

	function preloader(onCompl) {
		_classCallCheck(this, preloader);

		this.onComplete = onCompl;
		this.config = {
			cache: true,
			parallel: true
		};
		this.time = {
			start: 0,
			end: 0
		};
		this.total = 0;
		this.images = [];
		this._queue = [];

		for (var _len = arguments.length, images = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			images[_key - 1] = arguments[_key];
		}

		if (onCompl && images) {
			this.enqueue.apply(this, images);
			this.preload();
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

	_createClass(preloader, [{
		key: 'enqueue',
		value: function enqueue() {
			for (var _len2 = arguments.length, elements = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				elements[_key2] = arguments[_key2];
			}

			this._queue = this._queue.concat(elements.map(function (elem) {
				return typeof elem === 'string' ? { source: elem } : elem;
			}));
			return this;
		}
	}, {
		key: '_finish',
		value: function _finish(index, image) {
			--this.total;
			this.images.forEach(function (img) {
				if (img.index == index) img.size = {
					width: image.width,
					height: image.heigth
				};
			});

			if (!this.total) {
				this.time.end = new Date().getTime();
				this.onComplete({
					time: Math.round(this.time.end - this.time.start),
					images: this.images
				});
			}
		}
	}, {
		key: 'preload',
		value: function preload(cbk) {
			var _this = this;

			this.onComplete = cbk || this.onComplete;
			this.time.start = preloader.getTimestamp();
			this.total = this._queue.length;

			var _loop = function (index) {
				var image = new Image();
				_this.images.push({
					index: index,
					image: image,
					size: {
						width: 0,
						height: 0
					}
				});
				image.onload = image.onerror = image.onabort = function () {
					return _this._finish(index, image);
				};
				image.src = _this._queue[index].source + (_this.config.cache ? '' : '?__preloader_cache_invalidator=' + preloader.getTimestamp());
			};

			for (var index = this.total; --index;) {
				_loop(index);
			}
		}
	}, {
		key: 'preloadCSSImages',
		value: function preloadCSSImages(cbk) {
			this.enqueue.apply(this, _toConsumableArray(this.getCSSImages())).preload(cbk);
		}
	}, {
		key: '_getCSSRules',
		value: function _getCSSRules() {
			var allrules = [];
			var collectorRaw = function collectorRaw(rules) {
				rules.forEach(function (rule) {
					allrules.push({
						rule: rule,
						selectorText: rule.selectorText || null,
						declaration: rule.cssText || rule.style.cssText
					});

					collector(rule.styleSheet || {});
				});
			};
			var collector = function collector(sheet) {
				return collectorRaw(sheet.rules || sheet.cssRules || []);
			};

			document.forEach(function (sheet) {
				collector(sheet.rules || sheet.cssRules);
				(sheet.imports || []).forEach(collector);
			});

			return allrules;
		}
	}, {
		key: '_getCSSImages',
		value: function _getCSSImages() {
			return this._getCSSRules().reduce(function (prev, cur) {
				return prev.concat(cur.declaration.match(/[^(|'"]+.(jpg|jpeg|gif|png|apng|bmp)\)?/ig));
			}); // formats from https://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support
		}
	}]);

	return preloader;
})();

exports['default'] = preloader;
module.exports = exports['default'];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZWxvYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUJxQixTQUFTO2NBQVQsU0FBUzs7U0FDVix3QkFBRztBQUNyQixVQUFPLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQSxDQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7R0FDckc7OztBQUVVLFVBTFMsU0FBUyxDQUtqQixPQUFPLEVBQWE7d0JBTFosU0FBUzs7QUFNNUIsTUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFDMUIsTUFBSSxDQUFDLE1BQU0sR0FBRztBQUNiLFFBQUssRUFBRSxJQUFJO0FBQ1gsV0FBUSxFQUFFLElBQUk7R0FDZCxDQUFDO0FBQ0YsTUFBSSxDQUFDLElBQUksR0FBRztBQUNYLFFBQUssRUFBRSxDQUFDO0FBQ1IsTUFBRyxFQUFFLENBQUM7R0FDTixDQUFDO0FBQ0YsTUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZixNQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQixNQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7b0NBWk0sTUFBTTtBQUFOLFNBQU07OztBQWM3QixNQUFHLE9BQU8sSUFBSSxNQUFNLEVBQUU7QUFDckIsT0FBSSxDQUFDLE9BQU8sTUFBQSxDQUFaLElBQUksRUFBWSxNQUFNLENBQUMsQ0FBQztBQUN4QixPQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDZjtFQUNEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztjQXZCbUIsU0FBUzs7U0F5QnRCLG1CQUFjO3NDQUFWLFFBQVE7QUFBUixZQUFROzs7QUFDbEIsT0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTtXQUFLLEFBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxHQUFJLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyxHQUFHLElBQUk7SUFBQyxDQUFDLENBQUMsQ0FBQztBQUM3RyxVQUFPLElBQUksQ0FBQztHQUNaOzs7U0FFTSxpQkFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQ3JCLEtBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNiLE9BQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQzFCLFFBQUcsR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLEVBQ3BCLEdBQUcsQ0FBQyxJQUFJLEdBQUc7QUFDVixVQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7QUFDbEIsV0FBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO0tBQ3BCLENBQUM7SUFDSCxDQUFDLENBQUM7O0FBRUgsT0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZixRQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxVQUFVLENBQUM7QUFDZixTQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztBQUNqRCxXQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07S0FDbkIsQ0FBQyxDQUFDO0lBQ0g7R0FDRDs7O1NBRU0saUJBQUMsR0FBRyxFQUFFOzs7QUFDWixPQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQ3pDLE9BQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUMzQyxPQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOzt5QkFDeEIsS0FBSztBQUNaLFFBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDeEIsVUFBSyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2hCLFVBQUssRUFBTCxLQUFLO0FBQ0wsVUFBSyxFQUFMLEtBQUs7QUFDTCxTQUFJLEVBQUU7QUFDTCxXQUFLLEVBQUUsQ0FBQztBQUNSLFlBQU0sRUFBRSxDQUFDO01BQ1Q7S0FDRCxDQUFDLENBQUM7QUFDSCxTQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sR0FBSTtZQUFNLE1BQUssT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7S0FBQSxBQUFDLENBQUM7QUFDbEYsU0FBSyxDQUFDLEdBQUcsR0FBRyxNQUFLLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBSyxNQUFNLENBQUMsS0FBSyxHQUFHLEVBQUUsR0FBSSxpQ0FBaUMsR0FBRyxTQUFTLENBQUMsWUFBWSxFQUFFLENBQUMsQUFBQyxDQUFDOzs7QUFYbkksUUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsS0FBSyxHQUFHO1VBQTlCLEtBQUs7SUFZWjtHQUNEOzs7U0FFZSwwQkFBQyxHQUFHLEVBQUU7QUFDckIsT0FBSSxDQUFDLE9BQU8sTUFBQSxDQUFaLElBQUkscUJBQVksSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ2xEOzs7U0FFVyx3QkFBRztBQUNkLE9BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNwQixPQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBRyxLQUFLLEVBQUk7QUFDN0IsU0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUksRUFBSTtBQUNyQixhQUFRLENBQUMsSUFBSSxDQUFDO0FBQ2IsVUFBSSxFQUFKLElBQUk7QUFDSixrQkFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSTtBQUN2QyxpQkFBVyxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO01BQy9DLENBQUMsQ0FBQzs7QUFFSCxjQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNqQyxDQUFDLENBQUM7SUFDSCxDQUFDO0FBQ0YsT0FBTSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUcsS0FBSztXQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0lBQUEsQ0FBQzs7QUFFN0UsV0FBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUN6QixhQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekMsS0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQSxDQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUM7O0FBRUgsVUFBTyxRQUFRLENBQUM7R0FDaEI7OztTQUVZLHlCQUFHO0FBQ2YsVUFBTyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLEdBQUc7V0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFBQSxDQUFDLENBQUM7R0FDbEk7OztRQWpHbUIsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoicHJlbG9hZGVyLmVzNS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTUgbmFiaWphY3psZXdlbGlcblxuLy8gIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyAgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLFxuLy8gIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb25cbi8vICB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSxcbi8vICBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbi8vICBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyAgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyAgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyAgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HXG4vLyAgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUlxuLy8gIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBwcmVsb2FkZXIge1xuXHRzdGF0aWMgZ2V0VGltZXN0YW1wKCkge1xuXHRcdHJldHVybiAod2luZG93LnBlcmZvcm1hbmNlLm5vdyB8fCB3aW5kb3cucGVyZm9ybWFuY2Uud2Via2l0Tm93IHx8IERhdGUubm93KS5jYWxsKHdpbmRvdy5wZXJmb3JtYW5jZSk7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcihvbkNvbXBsLCAuLi5pbWFnZXMpIHtcblx0XHR0aGlzLm9uQ29tcGxldGUgPSBvbkNvbXBsO1xuXHRcdHRoaXMuY29uZmlnID0ge1xuXHRcdFx0Y2FjaGU6IHRydWUsXG5cdFx0XHRwYXJhbGxlbDogdHJ1ZSxcblx0XHR9O1xuXHRcdHRoaXMudGltZSA9IHtcblx0XHRcdHN0YXJ0OiAwLFxuXHRcdFx0ZW5kOiAwLFxuXHRcdH07XG5cdFx0dGhpcy50b3RhbCA9IDA7XG5cdFx0dGhpcy5pbWFnZXMgPSBbXTtcblx0XHR0aGlzLl9xdWV1ZSA9IFtdO1xuXG5cdFx0aWYob25Db21wbCAmJiBpbWFnZXMpIHtcblx0XHRcdHRoaXMuZW5xdWV1ZSguLi5pbWFnZXMpO1xuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XG5cdFx0fVxuXHR9XG5cblx0ZW5xdWV1ZSguLi5lbGVtZW50cykge1xuXHRcdHRoaXMuX3F1ZXVlID0gdGhpcy5fcXVldWUuY29uY2F0KGVsZW1lbnRzLm1hcChlbGVtID0+ICgodHlwZW9mIGVsZW0gPT09ICdzdHJpbmcnKSA/IHtzb3VyY2U6IGVsZW19IDogZWxlbSkpKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdF9maW5pc2goaW5kZXgsIGltYWdlKSB7XG5cdFx0LS10aGlzLnRvdGFsO1xuXHRcdHRoaXMuaW1hZ2VzLmZvckVhY2goaW1nID0+IHtcblx0XHRcdGlmKGltZy5pbmRleCA9PSBpbmRleClcblx0XHRcdFx0aW1nLnNpemUgPSB7XG5cdFx0XHRcdFx0d2lkdGg6IGltYWdlLndpZHRoLFxuXHRcdFx0XHRcdGhlaWdodDogaW1hZ2UuaGVpZ3RoLFxuXHRcdFx0XHR9O1xuXHRcdH0pO1xuXG5cdFx0aWYoIXRoaXMudG90YWwpIHtcdFxuXHRcdFx0dGhpcy50aW1lLmVuZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRcdFx0dGhpcy5vbkNvbXBsZXRlKHtcblx0XHRcdFx0dGltZTogTWF0aC5yb3VuZCh0aGlzLnRpbWUuZW5kIC0gdGhpcy50aW1lLnN0YXJ0KSxcblx0XHRcdFx0aW1hZ2VzOiB0aGlzLmltYWdlc1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0cHJlbG9hZChjYmspIHtcblx0XHR0aGlzLm9uQ29tcGxldGUgPSBjYmsgfHwgdGhpcy5vbkNvbXBsZXRlO1xuXHRcdHRoaXMudGltZS5zdGFydCA9IHByZWxvYWRlci5nZXRUaW1lc3RhbXAoKTtcblx0XHR0aGlzLnRvdGFsID0gdGhpcy5fcXVldWUubGVuZ3RoO1xuXHRcdGZvcihsZXQgaW5kZXggPSB0aGlzLnRvdGFsOyAtLWluZGV4Oykge1xuXHRcdFx0bGV0IGltYWdlID0gbmV3IEltYWdlKCk7XG5cdFx0XHR0aGlzLmltYWdlcy5wdXNoKHtcblx0XHRcdFx0aW5kZXgsXG5cdFx0XHRcdGltYWdlLFxuXHRcdFx0XHRzaXplOiB7XG5cdFx0XHRcdFx0d2lkdGg6IDAsXG5cdFx0XHRcdFx0aGVpZ2h0OiAwXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0aW1hZ2Uub25sb2FkID0gaW1hZ2Uub25lcnJvciA9IGltYWdlLm9uYWJvcnQgPSAoKCkgPT4gdGhpcy5fZmluaXNoKGluZGV4LCBpbWFnZSkpO1xuXHRcdFx0aW1hZ2Uuc3JjID0gdGhpcy5fcXVldWVbaW5kZXhdLnNvdXJjZSArICh0aGlzLmNvbmZpZy5jYWNoZSA/ICcnIDogKCc/X19wcmVsb2FkZXJfY2FjaGVfaW52YWxpZGF0b3I9JyArIHByZWxvYWRlci5nZXRUaW1lc3RhbXAoKSkpO1xuXHRcdH1cblx0fVxuXG5cdHByZWxvYWRDU1NJbWFnZXMoY2JrKSB7XG5cdFx0dGhpcy5lbnF1ZXVlKC4uLnRoaXMuZ2V0Q1NTSW1hZ2VzKCkpLnByZWxvYWQoY2JrKTtcblx0fVxuXG5cdF9nZXRDU1NSdWxlcygpIHtcblx0XHRjb25zdCBhbGxydWxlcyA9IFtdO1xuXHRcdGNvbnN0IGNvbGxlY3RvclJhdyA9IHJ1bGVzID0+IHtcblx0XHRcdHJ1bGVzLmZvckVhY2gocnVsZSA9PiB7XG5cdFx0XHRcdGFsbHJ1bGVzLnB1c2goe1xuXHRcdFx0XHRcdHJ1bGUsXG5cdFx0XHRcdFx0c2VsZWN0b3JUZXh0OiBydWxlLnNlbGVjdG9yVGV4dCB8fCBudWxsLFxuXHRcdFx0XHRcdGRlY2xhcmF0aW9uOiBydWxlLmNzc1RleHQgfHwgcnVsZS5zdHlsZS5jc3NUZXh0XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGNvbGxlY3RvcihydWxlLnN0eWxlU2hlZXQgfHwge30pO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRjb25zdCBjb2xsZWN0b3IgPSBzaGVldCA9PiBjb2xsZWN0b3JSYXcoc2hlZXQucnVsZXMgfHwgc2hlZXQuY3NzUnVsZXMgfHwgW10pO1xuXG5cdFx0ZG9jdW1lbnQuZm9yRWFjaChzaGVldCA9PiB7XG5cdFx0XHRjb2xsZWN0b3Ioc2hlZXQucnVsZXMgfHwgc2hlZXQuY3NzUnVsZXMpO1xuXHRcdFx0KHNoZWV0LmltcG9ydHMgfHwgW10pLmZvckVhY2goY29sbGVjdG9yKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBhbGxydWxlcztcblx0fVxuXG5cdF9nZXRDU1NJbWFnZXMoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2dldENTU1J1bGVzKCkucmVkdWNlKChwcmV2LCBjdXIpID0+IHByZXYuY29uY2F0KGN1ci5kZWNsYXJhdGlvbi5tYXRjaCgvW14ofCdcIl0rLihqcGd8anBlZ3xnaWZ8cG5nfGFwbmd8Ym1wKVxcKT8vaWcpKSk7ICAvLyBmb3JtYXRzIGZyb20gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29tcGFyaXNvbl9vZl93ZWJfYnJvd3NlcnMjSW1hZ2VfZm9ybWF0X3N1cHBvcnRcblx0fVxufVxuXG4vKlxuICAgICAgICAgICAgICAgIGdldENzc0ltYWdlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBydWxlcyA9IHRoaXMuZ2V0Q3NzUnVsZXMoKSwgaSA9IHJ1bGVzLmxlbmd0aCwgaW1hZ2VzID0gW10sIHJlZ2V4ID0gbmV3IFJlZ0V4cChcIlteKHwnXFxcIl0rLihnaWZ8anBnfGpwZWd8cG5nKVxcXFwpP1wiLCBcImlnXCIpO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW1nID0gcnVsZXNbaV0uZGVjbGFyYXRpb24ubWF0Y2gocmVnZXgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGltZyAmJiBpbWcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKDEgPT0gaW1nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZXMucHVzaChpbWcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gaW1nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZXMucHVzaChpbWdbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbWFnZXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByZWxvYWRDc3NJbWFnZXM6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZXMgPSB0aGlzLmdldENzc0ltYWdlcygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnF1ZXVlKGltYWdlcykucHJlbG9hZChjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRDc3NSdWxlczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2xsZWN0aW9uID0gW10sIGRhdGEgPSB7fTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIENvbGxlY3QgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBydWxlczogZnVuY3Rpb24ocnVsZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcnVsZSA9IHJ1bGVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAocnVsZS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWxlOiBydWxlc1tydWxlXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yVGV4dDogIXJ1bGVzW3J1bGVdLnNlbGVjdG9yVGV4dCA/IG51bGwgOiBydWxlc1tydWxlXS5zZWxlY3RvclRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbjogcnVsZXNbcnVsZV0uY3NzVGV4dCA/IHJ1bGVzW3J1bGVdLmNzc1RleHQgOiBydWxlc1tydWxlXS5zdHlsZS5jc3NUZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24ucHVzaChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN5bWxpbmsgPSBydWxlc1tydWxlXS5zdHlsZVNoZWV0IHx8IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzeW1saW5rKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xsZWN0LnJ1bGVzKHN5bWxpbmsuY3NzUnVsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IGRvY3VtZW50LnN0eWxlU2hlZXRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNoZWV0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGVzOiBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5ydWxlcyB8fCBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5jc3NSdWxlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbXBvcnRzOiBkb2N1bWVudC5zdHlsZVNoZWV0c1tpXS5pbXBvcnRzIHx8IFtdXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgQ29sbGVjdC5ydWxlcyhzaGVldC5ydWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHggPSAwOyB4IDwgc2hlZXQuaW1wb3J0cy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbGxlY3QucnVsZXMoc2hlZXQuaW1wb3J0c1t4XS5ydWxlcyB8fCBzaGVldC5pbXBvcnRzW3hdLmNzc1J1bGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSgpXG4gICAgfSk7Ki9cblxuIl19