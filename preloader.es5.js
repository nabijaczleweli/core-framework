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
					return images.splice.apply(images, [0, 0].concat(_toConsumableArray(rule.declaration.match(/[^(|'"]+.(jpg|jpeg|gif|png|apng|bmp)\)?/ig))));
				});
				return images;
			}
		}]);

		return preloader;
	})();

	module.exports = preloader;
});

//# sourceMappingURL=data:application/json;base64,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QywyQ0FBMkMsQ0FBQyxHQUFDO0tBQUEsQ0FBQyxDQUFDO0FBQ2pJLFdBQU8sTUFBTSxDQUFDO0lBQ2Q7OztTQTNHbUIsU0FBUzs7O2tCQUFULFNBQVMiLCJmaWxlIjoicHJlbG9hZGVyLmVzNS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTUgbmFiaWphY3psZXdlbGlcblxuLy8gIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyAgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLFxuLy8gIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb25cbi8vICB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSxcbi8vICBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGVcbi8vICBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vICBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vICBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyAgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyAgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyAgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HXG4vLyAgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUlxuLy8gIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBwcmVsb2FkZXIge1xuXHRzdGF0aWMgZ2V0VGltZXN0YW1wKCkge1xuXHRcdHJldHVybiAod2luZG93LnBlcmZvcm1hbmNlLm5vdyB8fCB3aW5kb3cucGVyZm9ybWFuY2Uud2Via2l0Tm93IHx8IERhdGUubm93KS5jYWxsKHdpbmRvdy5wZXJmb3JtYW5jZSk7XG5cdH1cblxuXHRjb25zdHJ1Y3RvcihvbkNvbXBsLCAuLi5pbWFnZXMpIHtcblx0XHR0aGlzLm9uQ29tcGxldGUgPSBvbkNvbXBsO1xuXHRcdHRoaXMuY29uZmlnID0ge1xuXHRcdFx0Y2FjaGU6IHRydWUsXG5cdFx0fTtcblx0XHR0aGlzLnRpbWUgPSB7XG5cdFx0XHRzdGFydDogMCxcblx0XHRcdGVuZDogMCxcblx0XHR9O1xuXHRcdHRoaXMudG90YWwgPSAwO1xuXHRcdHRoaXMuaW1hZ2VzID0gW107XG5cdFx0dGhpcy5fcXVldWUgPSBbXTtcblxuXHRcdGlmKG9uQ29tcGwgJiYgaW1hZ2VzICYmIGltYWdlcy5sZW5ndGgpIHtcblx0XHRcdHRoaXMuZW5xdWV1ZSguLi5pbWFnZXMpO1xuXHRcdFx0dGhpcy5wcmVsb2FkKCk7XG5cdFx0fVxuXHR9XG5cblx0ZW5xdWV1ZSguLi5lbGVtZW50cykge1xuXHRcdHRoaXMuX3F1ZXVlLnNwbGljZSgwLCAwLCAuLi5lbGVtZW50cy5tYXAoZWxlbSA9PiAodHlwZW9mIGVsZW0gPT09ICdzdHJpbmcnKSA/IHtzb3VyY2U6IGVsZW19IDogZWxlbSkpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0cHJlbG9hZChjYmspIHtcblx0XHR0aGlzLm9uQ29tcGxldGUgPSBjYmsgfHwgdGhpcy5vbkNvbXBsZXRlO1xuXHRcdHRoaXMudGltZS5zdGFydCA9IHByZWxvYWRlci5nZXRUaW1lc3RhbXAoKTtcblx0XHR0aGlzLnRvdGFsID0gdGhpcy5fcXVldWUubGVuZ3RoO1xuXHRcdHRoaXMuX3F1ZXVlLmZvckVhY2gocXVldWVkID0+IHtcblx0XHRcdGxldCBpbmRleCA9IHRoaXMuaW1hZ2VzLmxlbmd0aDtcblx0XHRcdGxldCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuXG5cdFx0XHR0aGlzLmltYWdlcy5wdXNoKHtcblx0XHRcdFx0aW5kZXgsXG5cdFx0XHRcdGltYWdlLFxuXHRcdFx0XHRzaXplOiB7XG5cdFx0XHRcdFx0d2lkdGg6IDAsXG5cdFx0XHRcdFx0aGVpZ2h0OiAwLFxuXHRcdFx0XHR9LFxuXHRcdFx0fSk7XG5cdFx0XHRpbWFnZS5vbmxvYWQgPSBpbWFnZS5vbmVycm9yID0gaW1hZ2Uub25hYm9ydCA9ICgpID0+IHRoaXMuX2ZpbmlzaChpbmRleCwgaW1hZ2UpO1xuXHRcdFx0aW1hZ2Uuc3JjID0gcXVldWVkLnNvdXJjZSArICh0aGlzLmNvbmZpZy5jYWNoZSA/ICcnIDogKCc/X19wcmVsb2FkZXJfY2FjaGVfaW52YWxpZGF0b3I9JyArIHByZWxvYWRlci5nZXRUaW1lc3RhbXAoKSkpO1xuXHRcdH0pO1xuXHRcdHRoaXMuX3F1ZXVlLmxlbmd0aCA9IDA7XG5cdH1cblxuXHRwcmVsb2FkQ1NTSW1hZ2VzKGNiaykge1xuXHRcdHRoaXMuZW5xdWV1ZSguLi50aGlzLl9nZXRDU1NJbWFnZXMoKSkucHJlbG9hZChjYmspO1xuXHR9XG5cblx0X2ZpbmlzaChpbmRleCwgaW1hZ2UpIHtcblx0XHQtLXRoaXMudG90YWw7XG5cdFx0KHRoaXMuaW1hZ2VzLmZpbmQoaW1nID0+IGltZy5pbmRleCA9PSBpbmRleCkgfHwge30pLnNpemUgPSB7XG5cdFx0XHR3aWR0aDogaW1hZ2Uud2lkdGgsXG5cdFx0XHRoZWlnaHQ6IGltYWdlLmhlaWdodCxcblx0XHR9O1xuXG5cdFx0aWYoIXRoaXMudG90YWwpIHtcblx0XHRcdHRoaXMudGltZS5lbmQgPSBwcmVsb2FkZXIuZ2V0VGltZXN0YW1wKCk7XG5cdFx0XHR0aGlzLm9uQ29tcGxldGUoe1xuXHRcdFx0XHR0aW1lOiBNYXRoLnJvdW5kKHRoaXMudGltZS5lbmQgLSB0aGlzLnRpbWUuc3RhcnQpLFxuXHRcdFx0XHRpbWFnZXM6IHRoaXMuaW1hZ2VzLFxuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0X2dldENTU1J1bGVzKCkge1xuXHRcdGNvbnN0IGFsbHJ1bGVzID0gW107XG5cdFx0Y29uc3Qgc2FmZVJ1bGVzID0gc2hlZXQgPT4ge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0cmV0dXJuIHNoZWV0LnJ1bGVzIHx8IHNoZWV0LmNzc1J1bGVzIHx8IFtdO1xuXHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdGlmKGUubmFtZSAhPT0gJ1NlY3VyaXR5RXJyb3InKVxuXHRcdFx0XHRcdHRocm93IGU7XG5cdFx0XHRcdHJldHVybiBbXTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdGNvbnN0IGNvbGxlY3RvclJhdyA9IHJ1bGVzID0+IHtcblx0XHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwocnVsZXMsIHJ1bGUgPT4ge1xuXHRcdFx0XHRhbGxydWxlcy5wdXNoKHtcblx0XHRcdFx0XHRydWxlLFxuXHRcdFx0XHRcdHNlbGVjdG9yVGV4dDogcnVsZS5zZWxlY3RvclRleHQgfHwgbnVsbCxcblx0XHRcdFx0XHRkZWNsYXJhdGlvbjogcnVsZS5jc3NUZXh0IHx8IHJ1bGUuc3R5bGUuY3NzVGV4dCxcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Y29sbGVjdG9yKHJ1bGUuc3R5bGVTaGVldCB8fCB7fSk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdGNvbnN0IGNvbGxlY3RvciA9IHNoZWV0ID0+IGNvbGxlY3RvclJhdyhzYWZlUnVsZXMoc2hlZXQpKTtcblxuXHRcdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQuc3R5bGVTaGVldHMsIHNoZWV0ID0+IHtcblx0XHRcdGNvbGxlY3RvcihzaGVldCk7XG5cdFx0XHQoc2hlZXQuaW1wb3J0cyB8fCBbXSkuZm9yRWFjaChjb2xsZWN0b3IpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGFsbHJ1bGVzO1xuXHR9XG5cblx0X2dldENTU0ltYWdlcygpIHtcblx0XHRjb25zdCBpbWFnZXMgPSBbXTtcblx0XHR0aGlzLl9nZXRDU1NSdWxlcygpLmZvckVhY2gocnVsZSA9PiBpbWFnZXMuc3BsaWNlKDAsIDAsIC4uLnJ1bGUuZGVjbGFyYXRpb24ubWF0Y2goL1teKHwnXCJdKy4oanBnfGpwZWd8Z2lmfHBuZ3xhcG5nfGJtcClcXCk/L2lnKSkpOyAgLy8gZm9ybWF0cyBmcm9tIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvbXBhcmlzb25fb2Zfd2ViX2Jyb3dzZXJzI0ltYWdlX2Zvcm1hdF9zdXBwb3J0XG5cdFx0cmV0dXJuIGltYWdlcztcblx0fVxufVxuXG4iXX0=