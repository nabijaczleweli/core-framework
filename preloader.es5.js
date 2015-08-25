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
					return collectorRaw(sheet.rules || sheet.cssRules || []);
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

//# sourceMappingURL=data:application/json;base64,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WSxJQUFJLElBQUk7QUFDdkMsa0JBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTztPQUMvQyxDQUFDLENBQUM7O0FBRUgsZUFBUyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLENBQUM7TUFDakMsQ0FBQyxDQUFDO0tBQ0gsQ0FBQztBQUNGLFFBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFHLEtBQUs7WUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztLQUFBLENBQUM7O0FBRTdFLFNBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFVBQUEsS0FBSyxFQUFJO0FBQzNELGNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqQixNQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFBLENBQUUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ3pDLENBQUMsQ0FBQzs7QUFFSCxXQUFPLFFBQVEsQ0FBQztJQUNoQjs7O1VBRVkseUJBQUc7QUFDZixRQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7WUFBSSxNQUFNLENBQUMsTUFBTSxNQUFBLENBQWIsTUFBTSxHQUFRLENBQUMsRUFBRSxDQUFDLDRCQUFLLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxDQUFDLEdBQUM7S0FBQSxDQUFDLENBQUM7QUFDakksV0FBTyxNQUFNLENBQUM7SUFDZDs7O1NBbEdtQixTQUFTOzs7a0JBQVQsU0FBUyIsImZpbGUiOiJwcmVsb2FkZXIuZXM1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbi8vIENvcHlyaWdodCAoYykgMjAxNSBuYWJpamFjemxld2VsaVxuXG4vLyAgUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vICBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksXG4vLyAgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvblxuLy8gIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLFxuLy8gIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZVxuLy8gIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyAgYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vICBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vICBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vICBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyAgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkdcbi8vICBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSXG4vLyAgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIHByZWxvYWRlciB7XG5cdHN0YXRpYyBnZXRUaW1lc3RhbXAoKSB7XG5cdFx0cmV0dXJuICh3aW5kb3cucGVyZm9ybWFuY2Uubm93IHx8IHdpbmRvdy5wZXJmb3JtYW5jZS53ZWJraXROb3cgfHwgRGF0ZS5ub3cpLmNhbGwod2luZG93LnBlcmZvcm1hbmNlKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKG9uQ29tcGwsIC4uLmltYWdlcykge1xuXHRcdHRoaXMub25Db21wbGV0ZSA9IG9uQ29tcGw7XG5cdFx0dGhpcy5jb25maWcgPSB7XG5cdFx0XHRjYWNoZTogdHJ1ZSxcblx0XHR9O1xuXHRcdHRoaXMudGltZSA9IHtcblx0XHRcdHN0YXJ0OiAwLFxuXHRcdFx0ZW5kOiAwLFxuXHRcdH07XG5cdFx0dGhpcy50b3RhbCA9IDA7XG5cdFx0dGhpcy5pbWFnZXMgPSBbXTtcblx0XHR0aGlzLl9xdWV1ZSA9IFtdO1xuXG5cdFx0aWYob25Db21wbCAmJiBpbWFnZXMgJiYgaW1hZ2VzLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5lbnF1ZXVlKC4uLmltYWdlcyk7XG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcblx0XHR9XG5cdH1cblxuXHRlbnF1ZXVlKC4uLmVsZW1lbnRzKSB7XG5cdFx0dGhpcy5fcXVldWUuc3BsaWNlKDAsIDAsIC4uLmVsZW1lbnRzLm1hcChlbGVtID0+ICh0eXBlb2YgZWxlbSA9PT0gJ3N0cmluZycpID8ge3NvdXJjZTogZWxlbX0gOiBlbGVtKSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRwcmVsb2FkKGNiaykge1xuXHRcdHRoaXMub25Db21wbGV0ZSA9IGNiayB8fCB0aGlzLm9uQ29tcGxldGU7XG5cdFx0dGhpcy50aW1lLnN0YXJ0ID0gcHJlbG9hZGVyLmdldFRpbWVzdGFtcCgpO1xuXHRcdHRoaXMudG90YWwgPSB0aGlzLl9xdWV1ZS5sZW5ndGg7XG5cdFx0dGhpcy5fcXVldWUuZm9yRWFjaChxdWV1ZWQgPT4ge1xuXHRcdFx0bGV0IGluZGV4ID0gdGhpcy5pbWFnZXMubGVuZ3RoO1xuXHRcdFx0bGV0IGltYWdlID0gbmV3IEltYWdlKCk7XG5cblx0XHRcdHRoaXMuaW1hZ2VzLnB1c2goe1xuXHRcdFx0XHRpbmRleCxcblx0XHRcdFx0aW1hZ2UsXG5cdFx0XHRcdHNpemU6IHtcblx0XHRcdFx0XHR3aWR0aDogMCxcblx0XHRcdFx0XHRoZWlnaHQ6IDAsXG5cdFx0XHRcdH0sXG5cdFx0XHR9KTtcblx0XHRcdGltYWdlLm9ubG9hZCA9IGltYWdlLm9uZXJyb3IgPSBpbWFnZS5vbmFib3J0ID0gKCkgPT4gdGhpcy5fZmluaXNoKGluZGV4LCBpbWFnZSk7XG5cdFx0XHRpbWFnZS5zcmMgPSBxdWV1ZWQuc291cmNlICsgKHRoaXMuY29uZmlnLmNhY2hlID8gJycgOiAoJz9fX3ByZWxvYWRlcl9jYWNoZV9pbnZhbGlkYXRvcj0nICsgcHJlbG9hZGVyLmdldFRpbWVzdGFtcCgpKSk7XG5cdFx0fSk7XG5cdFx0dGhpcy5fcXVldWUubGVuZ3RoID0gMDtcblx0fVxuXG5cdHByZWxvYWRDU1NJbWFnZXMoY2JrKSB7XG5cdFx0dGhpcy5lbnF1ZXVlKC4uLnRoaXMuX2dldENTU0ltYWdlcygpKS5wcmVsb2FkKGNiayk7XG5cdH1cblxuXHRfZmluaXNoKGluZGV4LCBpbWFnZSkge1xuXHRcdC0tdGhpcy50b3RhbDtcblx0XHQodGhpcy5pbWFnZXMuZmluZChpbWcgPT4gaW1nLmluZGV4ID09IGluZGV4KSB8fCB7fSkuc2l6ZSA9IHtcblx0XHRcdHdpZHRoOiBpbWFnZS53aWR0aCxcblx0XHRcdGhlaWdodDogaW1hZ2UuaGVpZ2h0LFxuXHRcdH07XG5cblx0XHRpZighdGhpcy50b3RhbCkge1xuXHRcdFx0dGhpcy50aW1lLmVuZCA9IHByZWxvYWRlci5nZXRUaW1lc3RhbXAoKTtcblx0XHRcdHRoaXMub25Db21wbGV0ZSh7XG5cdFx0XHRcdHRpbWU6IE1hdGgucm91bmQodGhpcy50aW1lLmVuZCAtIHRoaXMudGltZS5zdGFydCksXG5cdFx0XHRcdGltYWdlczogdGhpcy5pbWFnZXMsXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRfZ2V0Q1NTUnVsZXMoKSB7XG5cdFx0Y29uc3QgYWxscnVsZXMgPSBbXTtcblx0XHRjb25zdCBjb2xsZWN0b3JSYXcgPSBydWxlcyA9PiB7XG5cdFx0XHRBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHJ1bGVzLCBydWxlID0+IHtcblx0XHRcdFx0YWxscnVsZXMucHVzaCh7XG5cdFx0XHRcdFx0cnVsZSxcblx0XHRcdFx0XHRzZWxlY3RvclRleHQ6IHJ1bGUuc2VsZWN0b3JUZXh0IHx8IG51bGwsXG5cdFx0XHRcdFx0ZGVjbGFyYXRpb246IHJ1bGUuY3NzVGV4dCB8fCBydWxlLnN0eWxlLmNzc1RleHQsXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGNvbGxlY3RvcihydWxlLnN0eWxlU2hlZXQgfHwge30pO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRjb25zdCBjb2xsZWN0b3IgPSBzaGVldCA9PiBjb2xsZWN0b3JSYXcoc2hlZXQucnVsZXMgfHwgc2hlZXQuY3NzUnVsZXMgfHwgW10pO1xuXG5cdFx0QXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbChkb2N1bWVudC5zdHlsZVNoZWV0cywgc2hlZXQgPT4ge1xuXHRcdFx0Y29sbGVjdG9yKHNoZWV0KTtcblx0XHRcdChzaGVldC5pbXBvcnRzIHx8IFtdKS5mb3JFYWNoKGNvbGxlY3Rvcik7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gYWxscnVsZXM7XG5cdH1cblxuXHRfZ2V0Q1NTSW1hZ2VzKCkge1xuXHRcdGNvbnN0IGltYWdlcyA9IFtdO1xuXHRcdHRoaXMuX2dldENTU1J1bGVzKCkuZm9yRWFjaChydWxlID0+IGltYWdlcy5zcGxpY2UoMCwgMCwgLi4ucnVsZS5kZWNsYXJhdGlvbi5tYXRjaCgvW14ofCdcIl0rLihqcGd8anBlZ3xnaWZ8cG5nfGFwbmd8Ym1wKVxcKT8vaWcpKSk7ICAvLyBmb3JtYXRzIGZyb20gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQ29tcGFyaXNvbl9vZl93ZWJfYnJvd3NlcnMjSW1hZ2VfZm9ybWF0X3N1cHBvcnRcblx0XHRyZXR1cm4gaW1hZ2VzO1xuXHR9XG59XG5cbiJdfQ==
