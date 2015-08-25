*core-preloader* is a simple library for preloading images, either manually specified or from currently loaded CSS.

## Usage ##

1. Constructor
	* `new preloader([onComplete[, ...images]])`
		- `onComplete`<sub>(opt)</sub>: the single-argument function, called after loading the last image finishes
		- `...images`<sub>(opt)</sub>: images to be preloaded, each of type `string` or `Object` with the structure: `{source: string}`
	* Sufficient for most use cases
2. Adding images to be preloaded
	* `prel.enqueue([...images])`
		- `...images`<sub>(opt)</sub>: images to be preloaded, each of type `string` or `Object` with the structure: `{source: string}`
		- returns: `this`
	* Adds all `...images` to the queue of images to preload
3. Perform preload
	* `prel.preload([onComplete])`
		- `onComplete`<sub>(opt)</sub>: the single-argument function, called after loading the last image finishes
		- returns: nothing
	* Preloads all currently queued images
4. Preload all images from from currently loaded CSS
	* `prel.preloadCSSImages([onComplete])`
		- `onComplete`<sub>(opt)</sub>: the single-argument function, called after loading the last image finishes
		- returns: nothing
	* Queues all images from currently loaded CSS (accessible via `document.styleSheets`) and preloads them
5. Configuration
	* `prel.config.cache`
		- *debug option*, `boolean`: whether to bypass cache when preloading
		- default: `true`

### Utilities ###

1. Current time
	* `preloader.getTimestamp()`
		- returns: `number`, specifying the current time in some way
	* Millisecond or sub-millisecond resolution
	* Usable only for delta time

### Callback function specification ###
1. Callable with one argument
2. The argument is of type `Object`, with the following key-value pairs:
	* `time` <sub>(`number`)</sub>: time in milliseconds elapsed between the call to `preload()` and when the last image loaded
	* `images` <sub>(`Array<Object>`)</sub>: an array of `Object`s of the following spec:
		- `image` <sub>(`Image`)</sub>: the preloaded `Image` 
		- `index` <sub>(`number`)</sub>: 0-based sequentially-assigned index of the preloaded `Image`
		- `size` <sub>(`Object`)</sub>: an `Object` describing the `Image`'s size, of the following spec:
			* `width` <sub>(`number`)</sub>: identical to `Image`'s `width` property
			* `height` <sub>(`number`)</sub>: identical to `Image`'s `height` property
3. Returns: *ignored*
4. Called from the `preloader` instance
