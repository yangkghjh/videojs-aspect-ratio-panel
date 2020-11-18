import videojs from "video.js";
import { version as VERSION } from "../package.json";

import ResizerButton from "./button";
import ResizerPanel from "./panel";

const Plugin = videojs.getPlugin("plugin");

// Default options for the plugin.
const defaults = {};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class AspectRatioPanel extends Plugin {
  /**
   * Create a AspectRatioPanel plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    this.player.ready(() => {
      this.player.addClass("vjs-aspect-ratio-panel");

      if (player.techName_ != "Html5") {
        return false;
      }

      player.on(["loadedmetadata"], function (e) {
        if (
          player.aspect_ratio_initialized == "undefined" ||
          player.aspect_ratio_initialized == true
        ) {
        } else {
          player.aspect_ratio_initialized = true;
          var controlBar = player.controlBar;
          var fullscreenToggle = controlBar.getChild("fullscreenToggle").el();
          controlBar
            .el()
            .insertBefore(
              controlBar.addChild("ResizerButton").el(),
              fullscreenToggle
            );

          player.addChild("ResizerPanel");
        }
      });
    });

    videojs.registerComponent("ResizerButton", ResizerButton);
    videojs.registerComponent("ResizerPanel", ResizerPanel);
  }
}

// Define default values for the plugin's `state` object here.
AspectRatioPanel.defaultState = {};

// Include the version number.
AspectRatioPanel.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin("aspectRatioPanel", AspectRatioPanel);

export default AspectRatioPanel;
