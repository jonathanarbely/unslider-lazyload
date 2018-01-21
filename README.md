# Unslider - Lazyloading & Thumbnails Plugin

[![npm version](https://badge.fury.io/js/unslider-lazyload.svg)](https://badge.fury.io/js/unslider-lazyload)

The `unslider-lazyload` plugin for `unslider.js` extends your slider with lazyloading functionality, enables sourceset usage and introduces Thumbnails.

This plugin has been thoroughly tested in a production environment for quite some time now, making it fit for open source release and peace-of-mind usage.

##### [Demo °1 - Multidimensional Array with Sourcesets](https://jsfiddle.net/jarbely/ofbLm6cq/)
##### [Demo °2 - Onedimensional Array (soon)](#)
##### [Demo °3 - Multiple Sliders together (soon)](#)

:part_alternation_mark:

### Let's talk Performance

Unslider Lazyload makes use of the following techniques so save bandwith and boost your sites performance:

1. Most obviously by lazyloading every slide uporn interaction
2. The first two slides of each slider instance are loaded upon entering the viewport
3. Upon first interacting with the slider (through clicking or swiping), the third image is lazyloaded in the background (one new image loaded per interaction going forward), until all images have been lazyloaded
4. Through the use of sourcesets, you can define multiple sets of images per slider and define tresholds, in order to load a specific image resolution at a specific viewport width
5. All Thubmnails are also lazyloaded when entering the viewport in sets of seven images per loading cycle
6. Thumbnails are hidden on mobile devices (as their using them on smartphones becomes a hassle) and all relevant JS listeners are stopped or removed, further speeding things up
7. Thumbnails are defined in a seperate array, which let's you implement small res images

To se all of this in action, head over to the demo and inspect the page with Chromes Network tool.


### Thumbnails

Nails to thumb on. No seriously, you know what these are and what they do. See the demo to get an impression.

### How To Init

I strongly recommend running this repo locally and playing with it for a bit before implementing. Pleace continue to read through this readme to learn how.

`unsliderLazyLoad( images[array], imagesThumb[array], description[array], alt[array], instance[int], sliderName[object], toggleThumbnails[boolean] )`

Note: Init at the end of the body-tag, directly after Unslider.

| PARAMETERS  |  |
| ------------- | ------------- |
images:  | A one- or multi-dimensional array containing the URLs to the images that should be displayed - should be sorted in a descending manner (ie. biggest res to lowest res)
description:  | An array containing Strings that are used in the title-tag of each image
alt:  | An array containing Strings that are used in the alt-tag of each image (including Thumbnails)
instance:  | If multiple lazy loaded Unslider-Galleries are initialized, give each of them an incrementing index starting with zer0
sliderName:  | The variable you've used to init Unslider (e.g. slider, like in: slider = $('#unslider').unslider())
imagesThumb:  | Optional - An array containing the URLs to the Thumbnails that should be displayed, prefferably in a lower resolution

Global Namespace: ull_

### Prerequisites

All prerequisites come bundled with the plugin. This includes a modified version of Unslider.js (as it's not being actively developed anymore) and swiping functionality. Using this plugin requires at least basic understanding of JavaScript and SCSS. This is all the more true until I come up with a proper documentation and/or a step-by-step guide. The Demos aren't really finished and lack proper reponsiveness. So even though the Plugin is considered v.1.0.0, the demos are a WIP.

### Cloning & Installing

These instructions will get you a copy of the project and up and running implementing and testing this plugin to your hearts desire.

You need to have gulp CLI, git and NPM installed globally on your machine. Then you can simply clone this repo and do:

```
npm install
```

Please note that this package runs well on Windows machines and has not been tested on Mac or Linux, but should work there too.

### Building

```
gulp
```

Run when actively manipulating PUG or SCSS.

### Running locally

```
gulp c
```

Run and find the project running @ `localhost:8080`

### PR and Issues

If you want to propose a push request, please go ahead. If you come across an issue or would like to propose a feature, to so in the Issues section.

### Big thanks to

[Interchalet](https://www.interchalet.de/) in Freiburg, Germany for defacto sponsoring this plugin.
A lot of polish and the release has been done during my spare time, but the majority of developing and testing was made possible by integrating me into the dev & design team as a freelancer.
The images used in the demo are actually real holiday homes you can rent, spreading across europe and beyond.

### License

MIT

## Roadmap & Todos

- [ ] Improve demos
- [ ] Make demos responsive
- [ ] Make swiping functionality optional
- [ ] Come up with a proper documentation
- [ ] Minified version
- [ ] ...some more stuff I can't think of right now
