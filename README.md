*core-preloader* is a simple library for preloading images, either manually specified or from currently loaded CSS.

## Usage ##

##### Constructor #####
```JavaScript
new preloader([onComplete[, ...images]])
```
  * `onComplete`<sub>(opt)</sub>: the single-argument function, called after loading the last image finishes
    - `...images`<sub>(opt)</sub>: images to be preloaded, each of type `string` or `Object` with the structure: `{source: string}`
  * Sufficient for most use cases

##### Adding images to be preloaded #####
```JavaScript
prel.enqueue([...images])
```
  * `...images`<sub>(opt)</sub>: images to be preloaded, each of type `string` or `Object` with the structure: `{source: string}`
    - returns: `this`
  * Adds all `...images` to the queue of images to preload

##### Perform preload #####
```JavaScript
prel.preload([onComplete])
```
  * `onComplete`<sub>(opt)</sub>: the single-argument function, called after loading the last image finishes
    - returns: nothing
  * Preloads all currently queued images

##### Preload all images from from currently loaded CSS ######
```JavaScript
prel.preloadCSSImages([onComplete])
```
  * `onComplete`<sub>(opt)</sub>: the single-argument function, called after loading the last image finishes
    - returns: nothing
  * Queues all images from currently loaded CSS (accessible via `document.styleSheets`) and preloads them

##### Current callback function #####
```JavaScript
prel.onComplete[ = newFunc]
```
  * `newFunc`<sub>(opt)</sub>: the single-argument function to be called after preloading finishes
  * Never falsy
  * Equivalent to `() => {}` by default

##### Configuration #####
```JavaScript
prel.config.cache
```
  * *debug option*, `boolean`: whether to bypass cache when preloading
    - default: `true`

### Utilities ###

##### Current time #####
```JavaScript
preloader.getTimestamp()
```
  * returns: `number`, specifying the current time in some way
  * Millisecond or sub-millisecond resolution
  * Usable only for delta time

### Callback function specification ###

Callable with one argument of type `Object`, with the following key-value pairs:
  * `time` <sub>(`number`)</sub>: time in milliseconds elapsed between the call to `preload()` and when the last image loaded
  * `images` <sub>(`Array<Object>`)</sub>: an array of `Object`s of the following spec:
    - `image` <sub>(`Image`)</sub>: the preloaded `Image` 
    - `index` <sub>(`number`)</sub>: 0-based sequentially-assigned index of the preloaded `Image`
    - `size` <sub>(`Object`)</sub>: an `Object` describing the `Image`'s size, of the following spec:
      * `width` <sub>(`number`)</sub>: identical to `Image`'s `width` property
      * `height` <sub>(`number`)</sub>: identical to `Image`'s `height` property

Returns: *ignored*  
Called from the `preloader` instance

## Examples ##
##### Preload manually-supplied images #####

```JavaScript
new preloader((ev) => console.log(`Preloaded ${ev.images.length} images in ${ev.time}ms`),
  '/assets/background-dark.png',
  'http://i.imgur.com/aOwZche.png'
);
```
OR
```JavaScript
new preloader().enqueue(
  '/assets/background-dark.png',
  'http://i.imgur.com/aOwZche.png'
).preload((ev) => console.log(`Preloaded ${ev.images.length} images in ${ev.time}ms`));
```
OR
```JavaScript
new preloader((ev) => console.log(`Preloaded ${ev.images.length} images in ${ev.time}ms`)).enqueue(
  '/assets/background-dark.png',
  'http://i.imgur.com/aOwZche.png'
).preload();
```
Prints:  
> Preloaded 2 images in 110ms

##### Preload images from CSS #####

```CSS
.class1 {
  background: url('/assets/background.png');
}
.class2 {
  background: url('/assets/background-dank.png');
}
```
```JavaScript
let prel = new preloader((ev) => console.log(`Preloaded ${ev.images.length} images from CSS in ${ev.time}ms`));
prel.preloadCSSImages();
```
OR
```JavaScript
let prel = new preloader;
prel.preloadCSSImages((ev) => console.log(`Preloaded ${ev.images.length} images from CSS in ${ev.time}ms`));
```
Prints
> Preloaded 2 images from CSS in 2026ms
