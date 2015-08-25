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

			this.onComplete = onCompl;
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
			key: '_finish',
			value: function _finish(index, image) {
				--this.total;
				(this.images.find(function (img) {
					return img.index == index;
				}) || {}).size = {
					width: image.width,
					height: image.heigth
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
			key: '_getCSSRules',
			value: function _getCSSRules() {
				var allrules = [];
				var collectorRaw = function collectorRaw(rules) {
					Array.from(rules).forEach(function (rule) {
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

				Array.from(document.styleSheets).forEach(function (sheet) {
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
					return images.splice.apply(images, [0, 0].concat(_toConsumableArray(rule.declaration.match(/[^(|'"]+.(jpg|jpeg|gif|png|apng|bmp)\)?/ig))));
				});
				return images;
			}
		}]);

		return preloader;
	})();

	module.exports = preloader;
});

//# sourceMappingURL=data:application/json;base64,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SSxJQUFJO0FBQ3ZDLGtCQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU87T0FDL0MsQ0FBQyxDQUFDOztBQUVILGVBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDO01BQ2pDLENBQUMsQ0FBQztLQUNILENBQUM7QUFDRixRQUFNLFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBRyxLQUFLO1lBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7S0FBQSxDQUFDOztBQUU3RSxTQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLLEVBQUk7QUFDakQsY0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pCLE1BQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUEsQ0FBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDekMsQ0FBQyxDQUFDOztBQUVILFdBQU8sUUFBUSxDQUFDO0lBQ2hCOzs7VUFFWSx5QkFBRztBQUNmLFFBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUFJLE1BQU0sQ0FBQyxNQUFNLE1BQUEsQ0FBYixNQUFNLEdBQVEsQ0FBQyxFQUFFLENBQUMsNEJBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsMkNBQTJDLENBQUMsR0FBQztLQUFBLENBQUMsQ0FBQztBQUNqSSxXQUFPLE1BQU0sQ0FBQztJQUNkOzs7U0FsR21CLFNBQVM7OztrQkFBVCxTQUFTIiwiZmlsZSI6InByZWxvYWRlci5lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuLy8gQ29weXJpZ2h0IChjKSAyMDE1IG5hYmlqYWN6bGV3ZWxpXG5cbi8vICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSxcbi8vICB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uXG4vLyAgdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4vLyAgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4vLyAgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vICBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuLy8gIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbi8vICBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgcHJlbG9hZGVyIHtcblx0c3RhdGljIGdldFRpbWVzdGFtcCgpIHtcblx0XHRyZXR1cm4gKHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgfHwgd2luZG93LnBlcmZvcm1hbmNlLndlYmtpdE5vdyB8fCBEYXRlLm5vdykuY2FsbCh3aW5kb3cucGVyZm9ybWFuY2UpO1xuXHR9XG5cblx0Y29uc3RydWN0b3Iob25Db21wbCwgLi4uaW1hZ2VzKSB7XG5cdFx0dGhpcy5vbkNvbXBsZXRlID0gb25Db21wbDtcblx0XHR0aGlzLmNvbmZpZyA9IHtcblx0XHRcdGNhY2hlOiB0cnVlLFxuXHRcdH07XG5cdFx0dGhpcy50aW1lID0ge1xuXHRcdFx0c3RhcnQ6IDAsXG5cdFx0XHRlbmQ6IDAsXG5cdFx0fTtcblx0XHR0aGlzLnRvdGFsID0gMDtcblx0XHR0aGlzLmltYWdlcyA9IFtdO1xuXHRcdHRoaXMuX3F1ZXVlID0gW107XG5cblx0XHRpZihvbkNvbXBsICYmIGltYWdlcyAmJiBpbWFnZXMubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLmVucXVldWUoLi4uaW1hZ2VzKTtcblx0XHRcdHRoaXMucHJlbG9hZCgpO1xuXHRcdH1cblx0fVxuXG5cdGVucXVldWUoLi4uZWxlbWVudHMpIHtcblx0XHR0aGlzLl9xdWV1ZS5zcGxpY2UoMCwgMCwgLi4uZWxlbWVudHMubWFwKGVsZW0gPT4gKHR5cGVvZiBlbGVtID09PSAnc3RyaW5nJykgPyB7c291cmNlOiBlbGVtfSA6IGVsZW0pKTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdF9maW5pc2goaW5kZXgsIGltYWdlKSB7XG5cdFx0LS10aGlzLnRvdGFsO1xuXHRcdCh0aGlzLmltYWdlcy5maW5kKGltZyA9PiBpbWcuaW5kZXggPT0gaW5kZXgpIHx8IHt9KS5zaXplID0ge1xuXHRcdFx0d2lkdGg6IGltYWdlLndpZHRoLFxuXHRcdFx0aGVpZ2h0OiBpbWFnZS5oZWlndGgsXG5cdFx0fTtcblxuXHRcdGlmKCF0aGlzLnRvdGFsKSB7XHRcblx0XHRcdHRoaXMudGltZS5lbmQgPSBwcmVsb2FkZXIuZ2V0VGltZXN0YW1wKCk7XG5cdFx0XHR0aGlzLm9uQ29tcGxldGUoe1xuXHRcdFx0XHR0aW1lOiBNYXRoLnJvdW5kKHRoaXMudGltZS5lbmQgLSB0aGlzLnRpbWUuc3RhcnQpLFxuXHRcdFx0XHRpbWFnZXM6IHRoaXMuaW1hZ2VzLFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0cHJlbG9hZChjYmspIHtcblx0XHR0aGlzLm9uQ29tcGxldGUgPSBjYmsgfHwgdGhpcy5vbkNvbXBsZXRlO1xuXHRcdHRoaXMudGltZS5zdGFydCA9IHByZWxvYWRlci5nZXRUaW1lc3RhbXAoKTtcblx0XHR0aGlzLnRvdGFsID0gdGhpcy5fcXVldWUubGVuZ3RoO1xuXHRcdHRoaXMuX3F1ZXVlLmZvckVhY2gocXVldWVkID0+IHtcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuaW1hZ2VzLmxlbmd0aDtcblx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXG5cdFx0XHR0aGlzLmltYWdlcy5wdXNoKHtcblx0XHRcdFx0aW5kZXgsXG5cdFx0XHRcdGltYWdlLFxuXHRcdFx0XHRzaXplOiB7XG5cdFx0XHRcdFx0d2lkdGg6IDAsXG5cdFx0XHRcdFx0aGVpZ2h0OiAwLFxuXHRcdFx0XHR9LFxuXHRcdFx0fSk7XG5cdFx0XHRpbWFnZS5vbmxvYWQgPSBpbWFnZS5vbmVycm9yID0gaW1hZ2Uub25hYm9ydCA9ICgpID0+IHRoaXMuX2ZpbmlzaChpbmRleCwgaW1hZ2UpO1xuXHRcdFx0aW1hZ2Uuc3JjID0gcXVldWVkLnNvdXJjZSArICh0aGlzLmNvbmZpZy5jYWNoZSA/ICcnIDogKCc/X19wcmVsb2FkZXJfY2FjaGVfaW52YWxpZGF0b3I9JyArIHByZWxvYWRlci5nZXRUaW1lc3RhbXAoKSkpO1xuXHRcdH0pO1xuXHRcdHRoaXMuX3F1ZXVlLmxlbmd0aCA9IDA7XG5cdH1cblxuXHRwcmVsb2FkQ1NTSW1hZ2VzKGNiaykge1xuXHRcdHRoaXMuZW5xdWV1ZSguLi50aGlzLl9nZXRDU1NJbWFnZXMoKSkucHJlbG9hZChjYmspO1xuXHR9XG5cblx0X2dldENTU1J1bGVzKCkge1xuXHRcdGNvbnN0IGFsbHJ1bGVzID0gW107XG5cdFx0Y29uc3QgY29sbGVjdG9yUmF3ID0gcnVsZXMgPT4ge1xuXHRcdFx0QXJyYXkuZnJvbShydWxlcykuZm9yRWFjaChydWxlID0+IHtcblx0XHRcdFx0YWxscnVsZXMucHVzaCh7XG5cdFx0XHRcdFx0cnVsZSxcblx0XHRcdFx0XHRzZWxlY3RvclRleHQ6IHJ1bGUuc2VsZWN0b3JUZXh0IHx8IG51bGwsXG5cdFx0XHRcdFx0ZGVjbGFyYXRpb246IHJ1bGUuY3NzVGV4dCB8fCBydWxlLnN0eWxlLmNzc1RleHQsXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGNvbGxlY3RvcihydWxlLnN0eWxlU2hlZXQgfHwge30pO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRjb25zdCBjb2xsZWN0b3IgPSBzaGVldCA9PiBjb2xsZWN0b3JSYXcoc2hlZXQucnVsZXMgfHwgc2hlZXQuY3NzUnVsZXMgfHwgW10pO1xuXG5cdFx0QXJyYXkuZnJvbShkb2N1bWVudC5zdHlsZVNoZWV0cykuZm9yRWFjaChzaGVldCA9PiB7XG5cdFx0XHRjb2xsZWN0b3Ioc2hlZXQpO1xuXHRcdFx0KHNoZWV0LmltcG9ydHMgfHwgW10pLmZvckVhY2goY29sbGVjdG9yKTtcblx0XHR9KTtcblxuXHRcdHJldHVybiBhbGxydWxlcztcblx0fVxuXG5cdF9nZXRDU1NJbWFnZXMoKSB7XG5cdFx0Y29uc3QgaW1hZ2VzID0gW107XG5cdFx0dGhpcy5fZ2V0Q1NTUnVsZXMoKS5mb3JFYWNoKHJ1bGUgPT4gaW1hZ2VzLnNwbGljZSgwLCAwLCAuLi5ydWxlLmRlY2xhcmF0aW9uLm1hdGNoKC9bXih8J1wiXSsuKGpwZ3xqcGVnfGdpZnxwbmd8YXBuZ3xibXApXFwpPy9pZykpKTsgIC8vIGZvcm1hdHMgZnJvbSBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Db21wYXJpc29uX29mX3dlYl9icm93c2VycyNJbWFnZV9mb3JtYXRfc3VwcG9ydFxuXHRcdHJldHVybiBpbWFnZXM7XG5cdH1cbn1cblxuIl19