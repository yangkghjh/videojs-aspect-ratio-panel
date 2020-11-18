# videojs-aspect-ratio-panel

Video aspect ratio management for video.js.

![](screenshot.png)

## Table of Contents

<!-- START doctoc -->
<!-- END doctoc -->
## Installation

```sh
npm install --save @yangkghjh/videojs-aspect-ratio-panel
```

## Usage

To include videojs-aspect-ratio-panel on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-aspect-ratio-panel.min.js"></script>
<script>
  var player = videojs('my-video');

  player.aspectRatioPanel();
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-aspect-ratio-panel via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('@yangkghjh/videojs-aspect-ratio-panel');

var player = videojs('my-video');

player.aspectRatioPanel();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', '@yangkghjh/videojs-aspect-ratio-panel'], function(videojs) {
  var player = videojs('my-video');

  player.aspectRatioPanel();
});
```

## License

MIT. Copyright (c) Yang Bin &lt;yangkghjh@gmail.com&gt;


[videojs]: http://videojs.com/
