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
			var perfnow = window.performance.now || window.performance.webkitNow;
			return perfnow ? perfnow.call(window.performance) : new Date().getTime();
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

//# sourceMappingURL=data:application/json;base64,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LFVBQUksRUFBSixJQUFJO0FBQ0osa0JBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUk7QUFDdkMsaUJBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztNQUMvQyxDQUFDLENBQUM7O0FBRUgsY0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLENBQUM7S0FDakMsQ0FBQyxDQUFDO0lBQ0gsQ0FBQztBQUNGLE9BQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFHLEtBQUs7V0FBSSxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztJQUFBLENBQUM7O0FBRTdFLFdBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDekIsYUFBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pDLEtBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUEsQ0FBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDOztBQUVILFVBQU8sUUFBUSxDQUFDO0dBQ2hCOzs7U0FFWSx5QkFBRztBQUNmLFVBQU8sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBRSxHQUFHO1dBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0lBQUEsQ0FBQyxDQUFDO0dBQ2xJOzs7UUFsR21CLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6InByZWxvYWRlci5lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuLy8gQ29weXJpZ2h0IChjKSAyMDE1IG5hYmlqYWN6bGV3ZWxpXG5cbi8vICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSxcbi8vICB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uXG4vLyAgdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4vLyAgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4vLyAgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vICBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuLy8gIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbi8vICBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgcHJlbG9hZGVyIHtcblx0c3RhdGljIGdldFRpbWVzdGFtcCgpIHtcblx0XHRjb25zdCBwZXJmbm93ID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdyB8fCB3aW5kb3cucGVyZm9ybWFuY2Uud2Via2l0Tm93O1xuXHRcdHJldHVybiBwZXJmbm93ID8gcGVyZm5vdy5jYWxsKHdpbmRvdy5wZXJmb3JtYW5jZSkgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKG9uQ29tcGwsIC4uLmltYWdlcykge1xuXHRcdHRoaXMub25Db21wbGV0ZSA9IG9uQ29tcGw7XG5cdFx0dGhpcy5jb25maWcgPSB7XG5cdFx0XHRjYWNoZTogdHJ1ZSxcblx0XHRcdHBhcmFsbGVsOiB0cnVlLFxuXHRcdH07XG5cdFx0dGhpcy50aW1lID0ge1xuXHRcdFx0c3RhcnQ6IDAsXG5cdFx0XHRlbmQ6IDAsXG5cdFx0fTtcblx0XHR0aGlzLnRvdGFsID0gMDtcblx0XHR0aGlzLmltYWdlcyA9IFtdO1xuXHRcdHRoaXMuX3F1ZXVlID0gW107XG5cblx0XHRpZihvbkNvbXBsICYmIGltYWdlcykge1xuXHRcdFx0dGhpcy5lbnF1ZXVlKC4uLmltYWdlcyk7XG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcblx0XHR9XG5cdH1cblxuXHRlbnF1ZXVlKC4uLmVsZW1lbnRzKSB7XG5cdFx0dGhpcy5fcXVldWUgPSB0aGlzLl9xdWV1ZS5jb25jYXQoZWxlbWVudHMubWFwKGVsZW0gPT4gKCh0eXBlb2YgZWxlbSA9PT0gJ3N0cmluZycpID8ge3NvdXJjZTogZWxlbX0gOiBlbGVtKSkpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0X2ZpbmlzaChpbmRleCwgaW1hZ2UpIHtcblx0XHQtLXRoaXMudG90YWw7XG5cdFx0dGhpcy5pbWFnZXMuZm9yRWFjaChpbWcgPT4ge1xuXHRcdFx0aWYoaW1nLmluZGV4ID09IGluZGV4KVxuXHRcdFx0XHRpbWcuc2l6ZSA9IHtcblx0XHRcdFx0XHR3aWR0aDogaW1hZ2Uud2lkdGgsXG5cdFx0XHRcdFx0aGVpZ2h0OiBpbWFnZS5oZWlndGgsXG5cdFx0XHRcdH07XG5cdFx0fSk7XG5cblx0XHRpZighdGhpcy50b3RhbCkge1x0XG5cdFx0XHR0aGlzLnRpbWUuZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHR0aGlzLm9uQ29tcGxldGUoe1xuXHRcdFx0XHR0aW1lOiBNYXRoLnJvdW5kKHRoaXMudGltZS5lbmQgLSB0aGlzLnRpbWUuc3RhcnQpLFxuXHRcdFx0XHRpbWFnZXM6IHRoaXMuaW1hZ2VzXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRwcmVsb2FkKGNiaykge1xuXHRcdHRoaXMub25Db21wbGV0ZSA9IGNiayB8fCB0aGlzLm9uQ29tcGxldGU7XG5cdFx0dGhpcy50aW1lLnN0YXJ0ID0gcHJlbG9hZGVyLmdldFRpbWVzdGFtcCgpO1xuXHRcdHRoaXMudG90YWwgPSB0aGlzLl9xdWV1ZS5sZW5ndGg7XG5cdFx0Zm9yKGxldCBpbmRleCA9IHRoaXMudG90YWw7IC0taW5kZXg7KSB7XG5cdFx0XHRsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblx0XHRcdHRoaXMuaW1hZ2VzLnB1c2goe1xuXHRcdFx0XHRpbmRleCxcblx0XHRcdFx0aW1hZ2UsXG5cdFx0XHRcdHNpemU6IHtcblx0XHRcdFx0XHR3aWR0aDogMCxcblx0XHRcdFx0XHRoZWlnaHQ6IDBcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpbWFnZS5vbmxvYWQgPSBpbWFnZS5vbmVycm9yID0gaW1hZ2Uub25hYm9ydCA9ICgoKSA9PiB0aGlzLl9maW5pc2goaW5kZXgsIGltYWdlKSk7XG5cdFx0XHRpbWFnZS5zcmMgPSB0aGlzLl9xdWV1ZVtpbmRleF0uc291cmNlICsgKHRoaXMuY29uZmlnLmNhY2hlID8gJycgOiAoJz9fX3ByZWxvYWRlcl9jYWNoZV9pbnZhbGlkYXRvcj0nICsgcHJlbG9hZGVyLmdldFRpbWVzdGFtcCgpKSk7XG5cdFx0fVxuXHR9XG5cblx0cHJlbG9hZENTU0ltYWdlcyhjYmspIHtcblx0XHR0aGlzLmVucXVldWUoLi4udGhpcy5nZXRDU1NJbWFnZXMoKSkucHJlbG9hZChjYmspO1xuXHR9XG5cblx0X2dldENTU1J1bGVzKCkge1xuXHRcdGNvbnN0IGFsbHJ1bGVzID0gW107XG5cdFx0Y29uc3QgY29sbGVjdG9yUmF3ID0gcnVsZXMgPT4ge1xuXHRcdFx0cnVsZXMuZm9yRWFjaChydWxlID0+IHtcblx0XHRcdFx0YWxscnVsZXMucHVzaCh7XG5cdFx0XHRcdFx0cnVsZSxcblx0XHRcdFx0XHRzZWxlY3RvclRleHQ6IHJ1bGUuc2VsZWN0b3JUZXh0IHx8IG51bGwsXG5cdFx0XHRcdFx0ZGVjbGFyYXRpb246IHJ1bGUuY3NzVGV4dCB8fCBydWxlLnN0eWxlLmNzc1RleHRcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Y29sbGVjdG9yKHJ1bGUuc3R5bGVTaGVldCB8fCB7fSk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdGNvbnN0IGNvbGxlY3RvciA9IHNoZWV0ID0+IGNvbGxlY3RvclJhdyhzaGVldC5ydWxlcyB8fCBzaGVldC5jc3NSdWxlcyB8fCBbXSk7XG5cblx0XHRkb2N1bWVudC5mb3JFYWNoKHNoZWV0ID0+IHtcblx0XHRcdGNvbGxlY3RvcihzaGVldC5ydWxlcyB8fCBzaGVldC5jc3NSdWxlcyk7XG5cdFx0XHQoc2hlZXQuaW1wb3J0cyB8fCBbXSkuZm9yRWFjaChjb2xsZWN0b3IpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGFsbHJ1bGVzO1xuXHR9XG5cblx0X2dldENTU0ltYWdlcygpIHtcblx0XHRyZXR1cm4gdGhpcy5fZ2V0Q1NTUnVsZXMoKS5yZWR1Y2UoKHByZXYsIGN1cikgPT4gcHJldi5jb25jYXQoY3VyLmRlY2xhcmF0aW9uLm1hdGNoKC9bXih8J1wiXSsuKGpwZ3xqcGVnfGdpZnxwbmd8YXBuZ3xibXApXFwpPy9pZykpKTsgIC8vIGZvcm1hdHMgZnJvbSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db21wYXJpc29uX29mX3dlYl9icm93c2VycyNJbWFnZV9mb3JtYXRfc3VwcG9ydFxuXHR9XG59XG5cbi8qXG4gICAgICAgICAgICAgICAgZ2V0Q3NzSW1hZ2VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJ1bGVzID0gdGhpcy5nZXRDc3NSdWxlcygpLCBpID0gcnVsZXMubGVuZ3RoLCBpbWFnZXMgPSBbXSwgcmVnZXggPSBuZXcgUmVnRXhwKFwiW14ofCdcXFwiXSsuKGdpZnxqcGd8anBlZ3xwbmcpXFxcXCk/XCIsIFwiaWdcIik7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbWcgPSBydWxlc1tpXS5kZWNsYXJhdGlvbi5tYXRjaChyZWdleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1nICYmIGltZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoMSA9PSBpbWcubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlcy5wdXNoKGltZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBpbWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlcy5wdXNoKGltZ1tpXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGltYWdlcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJlbG9hZENzc0ltYWdlczogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlcyA9IHRoaXMuZ2V0Q3NzSW1hZ2VzKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucXVldWUoaW1hZ2VzKS5wcmVsb2FkKGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldENzc1J1bGVzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbGxlY3Rpb24gPSBbXSwgZGF0YSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICB2YXIgQ29sbGVjdCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGVzOiBmdW5jdGlvbihydWxlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBydWxlID0gcnVsZXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChydWxlLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJ1bGU6IHJ1bGVzW3J1bGVdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JUZXh0OiAhcnVsZXNbcnVsZV0uc2VsZWN0b3JUZXh0ID8gbnVsbCA6IHJ1bGVzW3J1bGVdLnNlbGVjdG9yVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY2xhcmF0aW9uOiBydWxlc1tydWxlXS5jc3NUZXh0ID8gcnVsZXNbcnVsZV0uY3NzVGV4dCA6IHJ1bGVzW3J1bGVdLnN0eWxlLmNzc1RleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sbGVjdGlvbi5wdXNoKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3ltbGluayA9IHJ1bGVzW3J1bGVdLnN0eWxlU2hlZXQgfHwgbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN5bWxpbmspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbGxlY3QucnVsZXMoc3ltbGluay5jc3NSdWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gZG9jdW1lbnQuc3R5bGVTaGVldHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2hlZXQgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVsZXM6IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLnJ1bGVzIHx8IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmNzc1J1bGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcG9ydHM6IGRvY3VtZW50LnN0eWxlU2hlZXRzW2ldLmltcG9ydHMgfHwgW11cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBDb2xsZWN0LnJ1bGVzKHNoZWV0LnJ1bGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoeCA9IDA7IHggPCBzaGVldC5pbXBvcnRzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sbGVjdC5ydWxlcyhzaGVldC5pbXBvcnRzW3hdLnJ1bGVzIHx8IHNoZWV0LmltcG9ydHNbeF0uY3NzUnVsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KClcbiAgICB9KTsqL1xuXG4iXX0=