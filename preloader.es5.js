(function (global, factory) {
	if (typeof define === 'function' && define.amd) {
		define(['exports', 'module'], factory);
	} else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
		factory(exports, module);
	} else {
		var mod = {
			exports: {}
		};
		factory(mod.exports, mod);
		global.preloader = mod.exports;
	}
})(this, function (exports, module) {
	'use strict';

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

			this.onComplete = onCompl || function () {};
			this.config = {
				cache: true
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

			if (onCompl && images && images.length) {
				this.enqueue.apply(this, images);
				this.preload();
			}
		}

		_createClass(preloader, [{
			key: 'enqueue',
			value: function enqueue() {
				var _queue;

				for (var _len2 = arguments.length, elements = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
					elements[_key2] = arguments[_key2];
				}

				(_queue = this._queue).splice.apply(_queue, [0, 0].concat(_toConsumableArray(elements.map(function (elem) {
					return typeof elem === 'string' ? { source: elem } : elem;
				}))));
				return this;
			}
		}, {
			key: 'preload',
			value: function preload(cbk) {
				var _this = this;

				this.onComplete = cbk || this.onComplete;
				this.time.start = preloader.getTimestamp();
				this.total = this._queue.length;
				this._queue.forEach(function (queued) {
					var index = _this.images.length;
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
					image.src = queued.source + (_this.config.cache ? '' : '?__preloader_cache_invalidator=' + preloader.getTimestamp());
				});
				this._queue.length = 0;
			}
		}, {
			key: 'preloadCSSImages',
			value: function preloadCSSImages(cbk) {
				this.enqueue.apply(this, _toConsumableArray(this._getCSSImages())).preload(cbk);
			}
		}, {
			key: '_finish',
			value: function _finish(index, image) {
				--this.total;
				(this.images.find(function (img) {
					return img.index == index;
				}) || {}).size = {
					width: image.width,
					height: image.height
				};

				if (!this.total) {
					this.time.end = preloader.getTimestamp();
					this.onComplete({
						time: Math.round(this.time.end - this.time.start),
						images: this.images
					});
				}
			}
		}, {
			key: '_getCSSRules',
			value: function _getCSSRules() {
				var allrules = [];
				var safeRules = function safeRules(sheet) {
					try {
						return sheet.rules || sheet.cssRules || [];
					} catch (e) {
						if (e.name !== 'SecurityError') throw e;
						return [];
					}
				};
				var collectorRaw = function collectorRaw(rules) {
					Array.prototype.forEach.call(rules, function (rule) {
						allrules.push({
							rule: rule,
							selectorText: rule.selectorText || null,
							declaration: rule.cssText || rule.style.cssText
						});

						collector(rule.styleSheet || {});
					});
				};
				var collector = function collector(sheet) {
					return collectorRaw(safeRules(sheet));
				};

				Array.prototype.forEach.call(document.styleSheets, function (sheet) {
					collector(sheet);
					(sheet.imports || []).forEach(collector);
				});

				return allrules;
			}
		}, {
			key: '_getCSSImages',
			value: function _getCSSImages() {
				var images = [];
				this._getCSSRules().forEach(function (rule) {
					return images.splice.apply(images, [0, 0].concat(_toConsumableArray(rule.declaration.match(/[^(|'"]+.(jpg|jpeg|gif|png|apng|bmp)\)?/ig) || [])));
				});
				return images;
			}
		}]);

		return preloader;
	})();

	module.exports = preloader;
});

//# sourceMappingURL=data:application/json;base64,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VyxDQUFDLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxJQUFJLEVBQUUsR0FBRTtLQUFBLENBQUMsQ0FBQztBQUN6SSxXQUFPLE1BQU0sQ0FBQztJQUNkOzs7U0EzR21CLFNBQVM7OztrQkFBVCxTQUFTIiwiZmlsZSI6InByZWxvYWRlci5lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuLy8gQ29weXJpZ2h0IChjKSAyMDE1IG5hYmlqYWN6bGV3ZWxpXG5cbi8vICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSxcbi8vICB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uXG4vLyAgdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4vLyAgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4vLyAgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vICBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuLy8gIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbi8vICBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgcHJlbG9hZGVyIHtcblx0c3RhdGljIGdldFRpbWVzdGFtcCgpIHtcblx0XHRyZXR1cm4gKHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgfHwgd2luZG93LnBlcmZvcm1hbmNlLndlYmtpdE5vdyB8fCBEYXRlLm5vdykuY2FsbCh3aW5kb3cucGVyZm9ybWFuY2UpO1xuXHR9XG5cblx0Y29uc3RydWN0b3Iob25Db21wbCwgLi4uaW1hZ2VzKSB7XG5cdFx0dGhpcy5vbkNvbXBsZXRlID0gb25Db21wbCB8fCAoKSA9PiB7fTtcblx0XHR0aGlzLmNvbmZpZyA9IHtcblx0XHRcdGNhY2hlOiB0cnVlLFxuXHRcdH07XG5cdFx0dGhpcy50aW1lID0ge1xuXHRcdFx0c3RhcnQ6IDAsXG5cdFx0XHRlbmQ6IDAsXG5cdFx0fTtcblx0XHR0aGlzLnRvdGFsID0gMDtcblx0XHR0aGlzLmltYWdlcyA9IFtdO1xuXHRcdHRoaXMuX3F1ZXVlID0gW107XG5cblx0XHRpZihvbkNvbXBsICYmIGltYWdlcyAmJiBpbWFnZXMubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLmVucXVldWUoLi4uaW1hZ2VzKTtcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xuXHRcdH1cblx0fVxuXG5cdGVucXVldWUoLi4uZWxlbWVudHMpIHtcblx0XHR0aGlzLl9xdWV1ZS5zcGxpY2UoMCwgMCwgLi4uZWxlbWVudHMubWFwKGVsZW0gPT4gKHR5cGVvZiBlbGVtID09PSAnc3RyaW5nJykgPyB7c291cmNlOiBlbGVtfSA6IGVsZW0pKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHByZWxvYWQoY2JrKSB7XG5cdFx0dGhpcy5vbkNvbXBsZXRlID0gY2JrIHx8IHRoaXMub25Db21wbGV0ZTtcblx0XHR0aGlzLnRpbWUuc3RhcnQgPSBwcmVsb2FkZXIuZ2V0VGltZXN0YW1wKCk7XG5cdFx0dGhpcy50b3RhbCA9IHRoaXMuX3F1ZXVlLmxlbmd0aDtcblx0XHR0aGlzLl9xdWV1ZS5mb3JFYWNoKHF1ZXVlZCA9PiB7XG5cdFx0XHRsZXQgaW5kZXggPSB0aGlzLmltYWdlcy5sZW5ndGg7XG5cdFx0XHRsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblxuXHRcdFx0dGhpcy5pbWFnZXMucHVzaCh7XG5cdFx0XHRcdGluZGV4LFxuXHRcdFx0XHRpbWFnZSxcblx0XHRcdFx0c2l6ZToge1xuXHRcdFx0XHRcdHdpZHRoOiAwLFxuXHRcdFx0XHRcdGhlaWdodDogMCxcblx0XHRcdFx0fSxcblx0XHRcdH0pO1xuXHRcdFx0aW1hZ2Uub25sb2FkID0gaW1hZ2Uub25lcnJvciA9IGltYWdlLm9uYWJvcnQgPSAoKSA9PiB0aGlzLl9maW5pc2goaW5kZXgsIGltYWdlKTtcblx0XHRcdGltYWdlLnNyYyA9IHF1ZXVlZC5zb3VyY2UgKyAodGhpcy5jb25maWcuY2FjaGUgPyAnJyA6ICgnP19fcHJlbG9hZGVyX2NhY2hlX2ludmFsaWRhdG9yPScgKyBwcmVsb2FkZXIuZ2V0VGltZXN0YW1wKCkpKTtcblx0XHR9KTtcblx0XHR0aGlzLl9xdWV1ZS5sZW5ndGggPSAwO1xuXHR9XG5cblx0cHJlbG9hZENTU0ltYWdlcyhjYmspIHtcblx0XHR0aGlzLmVucXVldWUoLi4udGhpcy5fZ2V0Q1NTSW1hZ2VzKCkpLnByZWxvYWQoY2JrKTtcblx0fVxuXG5cdF9maW5pc2goaW5kZXgsIGltYWdlKSB7XG5cdFx0LS10aGlzLnRvdGFsO1xuXHRcdCh0aGlzLmltYWdlcy5maW5kKGltZyA9PiBpbWcuaW5kZXggPT0gaW5kZXgpIHx8IHt9KS5zaXplID0ge1xuXHRcdFx0d2lkdGg6IGltYWdlLndpZHRoLFxuXHRcdFx0aGVpZ2h0OiBpbWFnZS5oZWlnaHQsXG5cdFx0fTtcblxuXHRcdGlmKCF0aGlzLnRvdGFsKSB7XG5cdFx0XHR0aGlzLnRpbWUuZW5kID0gcHJlbG9hZGVyLmdldFRpbWVzdGFtcCgpO1xuXHRcdFx0dGhpcy5vbkNvbXBsZXRlKHtcblx0XHRcdFx0dGltZTogTWF0aC5yb3VuZCh0aGlzLnRpbWUuZW5kIC0gdGhpcy50aW1lLnN0YXJ0KSxcblx0XHRcdFx0aW1hZ2VzOiB0aGlzLmltYWdlcyxcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cdF9nZXRDU1NSdWxlcygpIHtcblx0XHRjb25zdCBhbGxydWxlcyA9IFtdO1xuXHRcdGNvbnN0IHNhZmVSdWxlcyA9IHNoZWV0ID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdHJldHVybiBzaGVldC5ydWxlcyB8fCBzaGVldC5jc3NSdWxlcyB8fCBbXTtcblx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRpZihlLm5hbWUgIT09ICdTZWN1cml0eUVycm9yJylcblx0XHRcdFx0XHR0aHJvdyBlO1xuXHRcdFx0XHRyZXR1cm4gW107XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRjb25zdCBjb2xsZWN0b3JSYXcgPSBydWxlcyA9PiB7XG5cdFx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHJ1bGVzLCBydWxlID0+IHtcblx0XHRcdFx0YWxscnVsZXMucHVzaCh7XG5cdFx0XHRcdFx0cnVsZSxcblx0XHRcdFx0XHRzZWxlY3RvclRleHQ6IHJ1bGUuc2VsZWN0b3JUZXh0IHx8IG51bGwsXG5cdFx0XHRcdFx0ZGVjbGFyYXRpb246IHJ1bGUuY3NzVGV4dCB8fCBydWxlLnN0eWxlLmNzc1RleHQsXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGNvbGxlY3RvcihydWxlLnN0eWxlU2hlZXQgfHwge30pO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRjb25zdCBjb2xsZWN0b3IgPSBzaGVldCA9PiBjb2xsZWN0b3JSYXcoc2FmZVJ1bGVzKHNoZWV0KSk7XG5cblx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKGRvY3VtZW50LnN0eWxlU2hlZXRzLCBzaGVldCA9PiB7XG5cdFx0XHRjb2xsZWN0b3Ioc2hlZXQpO1xuXHRcdFx0KHNoZWV0LmltcG9ydHMgfHwgW10pLmZvckVhY2goY29sbGVjdG9yKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBhbGxydWxlcztcblx0fVxuXG5cdF9nZXRDU1NJbWFnZXMoKSB7XG5cdFx0Y29uc3QgaW1hZ2VzID0gW107XG5cdFx0dGhpcy5fZ2V0Q1NTUnVsZXMoKS5mb3JFYWNoKHJ1bGUgPT4gaW1hZ2VzLnNwbGljZSgwLCAwLCAuLi4ocnVsZS5kZWNsYXJhdGlvbi5tYXRjaCgvW14ofCdcIl0rLihqcGd8anBlZ3xnaWZ8cG5nfGFwbmd8Ym1wKVxcKT8vaWcpIHx8IFtdKSkpOyAgLy8gZm9ybWF0cyBmcm9tIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvbXBhcmlzb25fb2Zfd2ViX2Jyb3dzZXJzI0ltYWdlX2Zvcm1hdF9zdXBwb3J0XG5cdFx0cmV0dXJuIGltYWdlcztcblx0fVxufVxuXG4iXX0=