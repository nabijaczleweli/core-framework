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
			}, []); // formats from https://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support
		}
	}]);

	return preloader;
})();

exports['default'] = preloader;
module.exports = exports['default'];

//# sourceMappingURL=data:application/json;base64,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LElBQUksSUFBSTtBQUN2QyxpQkFBVyxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPO01BQy9DLENBQUMsQ0FBQzs7QUFFSCxjQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUNqQyxDQUFDLENBQUM7SUFDSCxDQUFDO0FBQ0YsT0FBTSxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUcsS0FBSztXQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO0lBQUEsQ0FBQzs7QUFFN0UsV0FBUSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUssRUFBSTtBQUN6QixhQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekMsS0FBQyxLQUFLLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQSxDQUFFLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUM7O0FBRUgsVUFBTyxRQUFRLENBQUM7R0FDaEI7OztTQUVZLHlCQUFHO0FBQ2YsVUFBTyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLEdBQUc7V0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7SUFBQSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ3RJOzs7UUFqR21CLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6InByZWxvYWRlci5lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuLy8gQ29weXJpZ2h0IChjKSAyMDE1IG5hYmlqYWN6bGV3ZWxpXG5cbi8vICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSxcbi8vICB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uXG4vLyAgdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4vLyAgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4vLyAgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vICBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuLy8gIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbi8vICBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgcHJlbG9hZGVyIHtcblx0c3RhdGljIGdldFRpbWVzdGFtcCgpIHtcblx0XHRyZXR1cm4gKHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgfHwgd2luZG93LnBlcmZvcm1hbmNlLndlYmtpdE5vdyB8fCBEYXRlLm5vdykuY2FsbCh3aW5kb3cucGVyZm9ybWFuY2UpO1xuXHR9XG5cblx0Y29uc3RydWN0b3Iob25Db21wbCwgLi4uaW1hZ2VzKSB7XG5cdFx0dGhpcy5vbkNvbXBsZXRlID0gb25Db21wbDtcblx0XHR0aGlzLmNvbmZpZyA9IHtcblx0XHRcdGNhY2hlOiB0cnVlLFxuXHRcdFx0cGFyYWxsZWw6IHRydWUsXG5cdFx0fTtcblx0XHR0aGlzLnRpbWUgPSB7XG5cdFx0XHRzdGFydDogMCxcblx0XHRcdGVuZDogMCxcblx0XHR9O1xuXHRcdHRoaXMudG90YWwgPSAwO1xuXHRcdHRoaXMuaW1hZ2VzID0gW107XG5cdFx0dGhpcy5fcXVldWUgPSBbXTtcblxuXHRcdGlmKG9uQ29tcGwgJiYgaW1hZ2VzKSB7XG5cdFx0XHR0aGlzLmVucXVldWUoLi4uaW1hZ2VzKTtcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xuXHRcdH1cblx0fVxuXG5cdGVucXVldWUoLi4uZWxlbWVudHMpIHtcblx0XHR0aGlzLl9xdWV1ZSA9IHRoaXMuX3F1ZXVlLmNvbmNhdChlbGVtZW50cy5tYXAoZWxlbSA9PiAoKHR5cGVvZiBlbGVtID09PSAnc3RyaW5nJykgPyB7c291cmNlOiBlbGVtfSA6IGVsZW0pKSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRfZmluaXNoKGluZGV4LCBpbWFnZSkge1xuXHRcdC0tdGhpcy50b3RhbDtcblx0XHR0aGlzLmltYWdlcy5mb3JFYWNoKGltZyA9PiB7XG5cdFx0XHRpZihpbWcuaW5kZXggPT0gaW5kZXgpXG5cdFx0XHRcdGltZy5zaXplID0ge1xuXHRcdFx0XHRcdHdpZHRoOiBpbWFnZS53aWR0aCxcblx0XHRcdFx0XHRoZWlnaHQ6IGltYWdlLmhlaWd0aCxcblx0XHRcdFx0fTtcblx0XHR9KTtcblxuXHRcdGlmKCF0aGlzLnRvdGFsKSB7XHRcblx0XHRcdHRoaXMudGltZS5lbmQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0XHRcdHRoaXMub25Db21wbGV0ZSh7XG5cdFx0XHRcdHRpbWU6IE1hdGgucm91bmQodGhpcy50aW1lLmVuZCAtIHRoaXMudGltZS5zdGFydCksXG5cdFx0XHRcdGltYWdlczogdGhpcy5pbWFnZXNcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdHByZWxvYWQoY2JrKSB7XG5cdFx0dGhpcy5vbkNvbXBsZXRlID0gY2JrIHx8IHRoaXMub25Db21wbGV0ZTtcblx0XHR0aGlzLnRpbWUuc3RhcnQgPSBwcmVsb2FkZXIuZ2V0VGltZXN0YW1wKCk7XG5cdFx0dGhpcy50b3RhbCA9IHRoaXMuX3F1ZXVlLmxlbmd0aDtcblx0XHRmb3IobGV0IGluZGV4ID0gdGhpcy50b3RhbDsgLS1pbmRleDspIHtcblx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXHRcdFx0dGhpcy5pbWFnZXMucHVzaCh7XG5cdFx0XHRcdGluZGV4LFxuXHRcdFx0XHRpbWFnZSxcblx0XHRcdFx0c2l6ZToge1xuXHRcdFx0XHRcdHdpZHRoOiAwLFxuXHRcdFx0XHRcdGhlaWdodDogMFxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGltYWdlLm9ubG9hZCA9IGltYWdlLm9uZXJyb3IgPSBpbWFnZS5vbmFib3J0ID0gKCgpID0+IHRoaXMuX2ZpbmlzaChpbmRleCwgaW1hZ2UpKTtcblx0XHRcdGltYWdlLnNyYyA9IHRoaXMuX3F1ZXVlW2luZGV4XS5zb3VyY2UgKyAodGhpcy5jb25maWcuY2FjaGUgPyAnJyA6ICgnP19fcHJlbG9hZGVyX2NhY2hlX2ludmFsaWRhdG9yPScgKyBwcmVsb2FkZXIuZ2V0VGltZXN0YW1wKCkpKTtcblx0XHR9XG5cdH1cblxuXHRwcmVsb2FkQ1NTSW1hZ2VzKGNiaykge1xuXHRcdHRoaXMuZW5xdWV1ZSguLi50aGlzLmdldENTU0ltYWdlcygpKS5wcmVsb2FkKGNiayk7XG5cdH1cblxuXHRfZ2V0Q1NTUnVsZXMoKSB7XG5cdFx0Y29uc3QgYWxscnVsZXMgPSBbXTtcblx0XHRjb25zdCBjb2xsZWN0b3JSYXcgPSBydWxlcyA9PiB7XG5cdFx0XHRydWxlcy5mb3JFYWNoKHJ1bGUgPT4ge1xuXHRcdFx0XHRhbGxydWxlcy5wdXNoKHtcblx0XHRcdFx0XHRydWxlLFxuXHRcdFx0XHRcdHNlbGVjdG9yVGV4dDogcnVsZS5zZWxlY3RvclRleHQgfHwgbnVsbCxcblx0XHRcdFx0XHRkZWNsYXJhdGlvbjogcnVsZS5jc3NUZXh0IHx8IHJ1bGUuc3R5bGUuY3NzVGV4dFxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHRjb2xsZWN0b3IocnVsZS5zdHlsZVNoZWV0IHx8IHt9KTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0Y29uc3QgY29sbGVjdG9yID0gc2hlZXQgPT4gY29sbGVjdG9yUmF3KHNoZWV0LnJ1bGVzIHx8IHNoZWV0LmNzc1J1bGVzIHx8IFtdKTtcblxuXHRcdGRvY3VtZW50LmZvckVhY2goc2hlZXQgPT4ge1xuXHRcdFx0Y29sbGVjdG9yKHNoZWV0LnJ1bGVzIHx8IHNoZWV0LmNzc1J1bGVzKTtcblx0XHRcdChzaGVldC5pbXBvcnRzIHx8IFtdKS5mb3JFYWNoKGNvbGxlY3Rvcik7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gYWxscnVsZXM7XG5cdH1cblxuXHRfZ2V0Q1NTSW1hZ2VzKCkge1xuXHRcdHJldHVybiB0aGlzLl9nZXRDU1NSdWxlcygpLnJlZHVjZSgocHJldiwgY3VyKSA9PiBwcmV2LmNvbmNhdChjdXIuZGVjbGFyYXRpb24ubWF0Y2goL1teKHwnXCJdKy4oanBnfGpwZWd8Z2lmfHBuZ3xhcG5nfGJtcClcXCk/L2lnKSksIFtdKTsgIC8vIGZvcm1hdHMgZnJvbSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db21wYXJpc29uX29mX3dlYl9icm93c2VycyNJbWFnZV9mb3JtYXRfc3VwcG9ydFxuXHR9XG59XG5cbi8qXG4gICAgICAgICAgICAgICAgZ2V0Q3NzSW1hZ2VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJ1bGVzID0gdGhpcy5nZXRDc3NSdWxlcygpLCBpID0gcnVsZXMubGVuZ3RoLCBpbWFnZXMgPSBbXSwgcmVnZXggPSBuZXcgUmVnRXhwKFwiW14ofCdcXFwiXSsuKGdpZnxqcGd8anBlZ3xwbmcpXFxcXCk/XCIsIFwiaWdcIik7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbWcgPSBydWxlc1tpXS5kZWNsYXJhdGlvbi5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1nICYmIGltZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoMSA9PSBpbWcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlcy5wdXNoKGltZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBpbWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlcy5wdXNoKGltZ1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGltYWdlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJlbG9hZENzc0ltYWdlczogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlcyA9IHRoaXMuZ2V0Q3NzSW1hZ2VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVldWUoaW1hZ2VzKS5wcmVsb2FkKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldENzc1J1bGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbGxlY3Rpb24gPSBbXSwgZGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgQ29sbGVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGVzOiBmdW5jdGlvbihydWxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBydWxlID0gcnVsZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChydWxlLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGU6IHJ1bGVzW3J1bGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JUZXh0OiAhcnVsZXNbcnVsZV0uc2VsZWN0b3JUZXh0ID8gbnVsbCA6IHJ1bGVzW3J1bGVdLnNlbGVjdG9yVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uOiBydWxlc1tydWxlXS5jc3NUZXh0ID8gcnVsZXNbcnVsZV0uY3NzVGV4dCA6IHJ1bGVzW3J1bGVdLnN0eWxlLmNzc1RleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3ltbGluayA9IHJ1bGVzW3J1bGVdLnN0eWxlU2hlZXQgfHwgbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN5bWxpbmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbGxlY3QucnVsZXMoc3ltbGluay5jc3NSdWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2hlZXQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVsZXM6IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLnJ1bGVzIHx8IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmNzc1J1bGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydHM6IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmltcG9ydHMgfHwgW11cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBDb2xsZWN0LnJ1bGVzKHNoZWV0LnJ1bGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoeCA9IDA7IHggPCBzaGVldC5pbXBvcnRzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sbGVjdC5ydWxlcyhzaGVldC5pbXBvcnRzW3hdLnJ1bGVzIHx8IHNoZWV0LmltcG9ydHNbeF0uY3NzUnVsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KClcbiAgICB9KTsqL1xuXG4iXX0=