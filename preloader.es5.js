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

				/*	preloadCSSImages(cbk) {
    		this.queue(this.getCSSImages()).preload(cbk);
    	}*/

				//TODO: implement getting CSS images	

				/*
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
				}]);

				return preloader;
})();

exports['default'] = preloader;
module.exports = exports['default'];

//# sourceMappingURL=data:application/json;base64,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QyxLQUFLLEdBQUcsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzNDLGdCQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOztrQ0FDeEIsS0FBSztBQUNaLG9CQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0FBQ3hCLHNCQUFLLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDaEIseUJBQUssRUFBTCxLQUFLO0FBQ0wseUJBQUssRUFBTCxLQUFLO0FBQ0wsd0JBQUksRUFBRTtBQUNMLDZCQUFLLEVBQUUsQ0FBQztBQUNSLDhCQUFNLEVBQUUsQ0FBQztxQkFDVDtpQkFDRCxDQUFDLENBQUM7QUFDSCxxQkFBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUk7MkJBQU0sTUFBSyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQztpQkFBQSxBQUFDLENBQUM7QUFDbEYscUJBQUssQ0FBQyxHQUFHLEdBQUcsTUFBSyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQUssTUFBTSxDQUFDLEtBQUssR0FBRyxFQUFFLEdBQUksaUNBQWlDLEdBQUcsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLEFBQUMsQ0FBQzs7O0FBWG5JLGlCQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxLQUFLLEdBQUc7c0JBQTlCLEtBQUs7YUFZWjtTQUNEOzs7V0FuRW1CLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6InByZWxvYWRlci5lczUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuLy8gQ29weXJpZ2h0IChjKSAyMDE1IG5hYmlqYWN6bGV3ZWxpXG5cbi8vICBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSxcbi8vICB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uXG4vLyAgdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsXG4vLyAgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlXG4vLyAgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyAgVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vICBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyAgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vICBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lOR1xuLy8gIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVJcbi8vICBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgcHJlbG9hZGVyIHtcblx0c3RhdGljIGdldFRpbWVzdGFtcCgpIHtcblx0XHRjb25zdCBwZXJmbm93ID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdyB8fCB3aW5kb3cucGVyZm9ybWFuY2Uud2Via2l0Tm93O1xuXHRcdHJldHVybiBwZXJmbm93ID8gcGVyZm5vdy5jYWxsKHdpbmRvdy5wZXJmb3JtYW5jZSkgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKG9uQ29tcGwsIC4uLmltYWdlcykge1xuXHRcdHRoaXMub25Db21wbGV0ZSA9IG9uQ29tcGw7XG5cdFx0dGhpcy5jb25maWcgPSB7XG5cdFx0XHRjYWNoZTogdHJ1ZSxcblx0XHRcdHBhcmFsbGVsOiB0cnVlLFxuXHRcdH07XG5cdFx0dGhpcy50aW1lID0ge1xuXHRcdFx0c3RhcnQ6IDAsXG5cdFx0XHRlbmQ6IDAsXG5cdFx0fTtcblx0XHR0aGlzLnRvdGFsID0gMDtcblx0XHR0aGlzLmltYWdlcyA9IFtdO1xuXHRcdHRoaXMuX3F1ZXVlID0gW107XG5cblx0XHRpZihvbkNvbXBsICYmIGltYWdlcykge1xuXHRcdFx0dGhpcy5lbnF1ZXVlKC4uLmltYWdlcyk7XG5cdFx0XHR0aGlzLnByZWxvYWQoKTtcblx0XHR9XG5cdH1cblxuXHRlbnF1ZXVlKC4uLmVsZW1lbnRzKSB7XG5cdFx0dGhpcy5fcXVldWUgPSB0aGlzLl9xdWV1ZS5jb25jYXQoZWxlbWVudHMubWFwKGVsZW0gPT4gKCh0eXBlb2YgZWxlbSA9PT0gJ3N0cmluZycpID8ge3NvdXJjZTogZWxlbX0gOiBlbGVtKSkpO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0X2ZpbmlzaChpbmRleCwgaW1hZ2UpIHtcblx0XHQtLXRoaXMudG90YWw7XG5cdFx0dGhpcy5pbWFnZXMuZm9yRWFjaChpbWcgPT4ge1xuXHRcdFx0aWYoaW1nLmluZGV4ID09IGluZGV4KVxuXHRcdFx0XHRpbWcuc2l6ZSA9IHtcblx0XHRcdFx0XHR3aWR0aDogaW1hZ2Uud2lkdGgsXG5cdFx0XHRcdFx0aGVpZ2h0OiBpbWFnZS5oZWlndGgsXG5cdFx0XHRcdH07XG5cdFx0fSk7XG5cblx0XHRpZighdGhpcy50b3RhbCkge1x0XG5cdFx0XHR0aGlzLnRpbWUuZW5kID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cdFx0XHR0aGlzLm9uQ29tcGxldGUoe1xuXHRcdFx0XHR0aW1lOiBNYXRoLnJvdW5kKHRoaXMudGltZS5lbmQgLSB0aGlzLnRpbWUuc3RhcnQpLFxuXHRcdFx0XHRpbWFnZXM6IHRoaXMuaW1hZ2VzXG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRwcmVsb2FkKGNiaykge1xuXHRcdHRoaXMub25Db21wbGV0ZSA9IGNiayB8fCB0aGlzLm9uQ29tcGxldGU7XG5cdFx0dGhpcy50aW1lLnN0YXJ0ID0gcHJlbG9hZGVyLmdldFRpbWVzdGFtcCgpO1xuXHRcdHRoaXMudG90YWwgPSB0aGlzLl9xdWV1ZS5sZW5ndGg7XG5cdFx0Zm9yKGxldCBpbmRleCA9IHRoaXMudG90YWw7IC0taW5kZXg7KSB7XG5cdFx0XHRsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcblx0XHRcdHRoaXMuaW1hZ2VzLnB1c2goe1xuXHRcdFx0XHRpbmRleCxcblx0XHRcdFx0aW1hZ2UsXG5cdFx0XHRcdHNpemU6IHtcblx0XHRcdFx0XHR3aWR0aDogMCxcblx0XHRcdFx0XHRoZWlnaHQ6IDBcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRpbWFnZS5vbmxvYWQgPSBpbWFnZS5vbmVycm9yID0gaW1hZ2Uub25hYm9ydCA9ICgoKSA9PiB0aGlzLl9maW5pc2goaW5kZXgsIGltYWdlKSk7XG5cdFx0XHRpbWFnZS5zcmMgPSB0aGlzLl9xdWV1ZVtpbmRleF0uc291cmNlICsgKHRoaXMuY29uZmlnLmNhY2hlID8gJycgOiAoJz9fX3ByZWxvYWRlcl9jYWNoZV9pbnZhbGlkYXRvcj0nICsgcHJlbG9hZGVyLmdldFRpbWVzdGFtcCgpKSk7XG5cdFx0fVxuXHR9XG59XG5cbi8qXHRwcmVsb2FkQ1NTSW1hZ2VzKGNiaykge1xuXHRcdHRoaXMucXVldWUodGhpcy5nZXRDU1NJbWFnZXMoKSkucHJlbG9hZChjYmspO1xuXHR9Ki9cblxuLy9UT0RPOiBpbXBsZW1lbnQgZ2V0dGluZyBDU1MgaW1hZ2VzXHRcblxuLypcbiAgICAgICAgICAgICAgICBwcmVsb2FkQ3NzSW1hZ2VzOiBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2VzID0gdGhpcy5nZXRDc3NJbWFnZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5xdWV1ZShpbWFnZXMpLnByZWxvYWQoY2FsbGJhY2spO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ2V0Q3NzUnVsZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29sbGVjdGlvbiA9IFtdLCBkYXRhID0ge307XG4gICAgICAgICAgICAgICAgICAgIHZhciBDb2xsZWN0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcnVsZXM6IGZ1bmN0aW9uKHJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJ1bGUgPSBydWxlcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHJ1bGUtLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcnVsZTogcnVsZXNbcnVsZV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvclRleHQ6ICFydWxlc1tydWxlXS5zZWxlY3RvclRleHQgPyBudWxsIDogcnVsZXNbcnVsZV0uc2VsZWN0b3JUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjbGFyYXRpb246IHJ1bGVzW3J1bGVdLmNzc1RleHQgPyBydWxlc1tydWxlXS5jc3NUZXh0IDogcnVsZXNbcnVsZV0uc3R5bGUuY3NzVGV4dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsZWN0aW9uLnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzeW1saW5rID0gcnVsZXNbcnVsZV0uc3R5bGVTaGVldCB8fCBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3ltbGluaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sbGVjdC5ydWxlcyhzeW1saW5rLmNzc1J1bGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSBkb2N1bWVudC5zdHlsZVNoZWV0cy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzaGVldCA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBydWxlczogZG9jdW1lbnQuc3R5bGVTaGVldHNbaV0ucnVsZXMgfHwgZG9jdW1lbnQuc3R5bGVTaGVldHNbaV0uY3NzUnVsZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1wb3J0czogZG9jdW1lbnQuc3R5bGVTaGVldHNbaV0uaW1wb3J0cyB8fCBbXVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbGxlY3QucnVsZXMoc2hlZXQucnVsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh4ID0gMDsgeCA8IHNoZWV0LmltcG9ydHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xsZWN0LnJ1bGVzKHNoZWV0LmltcG9ydHNbeF0ucnVsZXMgfHwgc2hlZXQuaW1wb3J0c1t4XS5jc3NSdWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRDc3NJbWFnZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcnVsZXMgPSB0aGlzLmdldENzc1J1bGVzKCksIGkgPSBydWxlcy5sZW5ndGgsIGltYWdlcyA9IFtdLCByZWdleCA9IG5ldyBSZWdFeHAoXCJbXih8J1xcXCJdKy4oZ2lmfGpwZ3xqcGVnfHBuZylcXFxcKT9cIiwgXCJpZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGktLSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltZyA9IHJ1bGVzW2ldLmRlY2xhcmF0aW9uLm1hdGNoKHJlZ2V4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbWcgJiYgaW1nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgxID09IGltZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VzLnB1c2goaW1nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGltZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VzLnB1c2goaW1nW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW1hZ2VzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0oKVxuICAgIH0pOyovXG5cbiJdfQ==
