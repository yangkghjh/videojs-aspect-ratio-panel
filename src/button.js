import videojs from "video.js";

const MenuButton = videojs.getComponent("MenuButton");

class ResizerButton extends MenuButton {
  constructor(player, options) {
    super(player, {
      name: "ResizerButton",
    });
    MenuButton.apply(this, arguments);
    this.controlText(player.localize("Aspect Ratio"));
  }

  createEl() {
    return videojs.dom.createEl("div", {
      className: "vjs-menu-button vjs-menu-button-popup vjs-control vjs-button",
    });
  }

  buildCSSClass() {
    return MenuButton.prototype.buildCSSClass.call(this) + " vjs-icon-cog";
  }

  update() {
    return MenuButton.prototype.update.call(this);
  }

  handleClick() {
    this.player().getChild("ResizerPanel").toggleClass("vjs-hidden");
  }
}

export default ResizerButton;
