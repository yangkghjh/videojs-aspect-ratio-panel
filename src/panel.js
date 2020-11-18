import videojs from "video.js";

const Component = videojs.getComponent("Component");

class ResizerPanel extends Component {
  constructor(player, options) {
    super(player, options);
    Component.apply(this, arguments);

    this.aspectRadio = "origin"; // origin, 4:3, 16:9, fill
    this.percent = 100;
    this.radioWidth = 1;
    this.radioHeight = 1;
    this.currentHeight = this.player().currentHeight();
    this.currentWidth = this.player().currentWidth();

    let el = this.el();

    // 关闭
    el.childNodes[1].childNodes[1].onclick = () => {
      this.toggleClass("vjs-hidden");
    };

    // 窗口大小改变
    window.addEventListener("resize", () => {
      if (
        this.currentHeight != this.player().currentHeight() ||
        this.currentWidth != this.player().currentWidth()
      ) {
        this.currentHeight = this.player().currentHeight();
        this.currentWidth = this.player().currentWidth();
        this.resize();
      }
    });

    // 滑动条
    el.onmouseup = function () {
      el.onmousemove = null;
    };

    let scroll = el.childNodes[1].childNodes[5].childNodes[1].childNodes[3];
    this.setScrollFunc(el, scroll, (data) => {
      this.setPercent(data);
    });

    // 播放下个视频时，应用参数
    this.player().on("play", () => {
      this.resize();
    });

    // 比例选择
    let radiosDiv = el.childNodes[1].childNodes[5].childNodes[3].childNodes;
    let radios = [radiosDiv[1], radiosDiv[5], radiosDiv[9], radiosDiv[13]];
    let prev = "origin";
    for (var i = 0; i < radios.length; i++) {
      radios[i].onchange = (event) => {
        if (event.target.value !== prev) {
          prev = event.target.value;

          this.setAspectRadio(event.target.value);
        }
      };
    }

    // 恢复默认
    let resetDiv = el.childNodes[1].childNodes[5].childNodes[5].childNodes[1];
    resetDiv.onclick = (event) => {
      radios[0].checked = true;
      this.reset();
    };
  }

  setAspectRadio(radio) {
    switch (radio) {
      case "origin":
        this.aspectRadio = "origin";
        break;
      case "fill":
        this.aspectRadio = "fill";
        break;
      case "16:9":
        this.aspectRadio = "16:9";
        this.radioWidth = 16;
        this.radioHeight = 9;
        break;
      case "4:3":
        this.aspectRadio = "4:3";
        this.radioWidth = 4;
        this.radioHeight = 3;
        break;
    }
    this.resize();
  }

  setPercent(percent) {
    this.percent = percent;
    this.resize();
  }

  reset() {
    this.player().tech_.el().style.objectFit = "contain";
    this.aspectRadio = "origin";
    this.percent = 100;
    let scroll = this.el().childNodes[1].childNodes[5].childNodes[1]
      .childNodes[3];
    scroll.childNodes[1].style.left = "255px";
    scroll.childNodes[3].style.width = "255px";

    this.resize();
  }

  resize() {
    if (this.aspectRadio != "origin") {
      this.player().tech_.el().style.objectFit = "fill";
    } else {
      this.player().tech_.el().style.objectFit = "contain";
    }
    if (this.aspectRadio == "origin" || this.aspectRadio == "fill") {
      let w = (this.currentWidth * (100 - this.percent)) / 100 / 2;
      let h = (this.currentHeight * (100 - this.percent)) / 100 / 2;
      this.setPadding(w, h);
      return;
    }
    // 计算播放器画面比例，如果小于目标，使用宽度作为计算标准，大于则使用高度
    // 4:3=1.333
    // 16:9=1.778
    let playerRadio = this.currentWidth / this.currentHeight;

    // 需要的高宽度
    let width = this.currentWidth;
    let height = (width * this.radioHeight) / this.radioWidth;

    if (playerRadio > this.radioWidth / this.radioHeight) {
      height = this.currentHeight;
      width = (height * this.radioWidth) / this.radioHeight;
    }

    let w = (this.currentWidth - (width * this.percent) / 100) / 2;
    let h = (this.currentHeight - (height * this.percent) / 100) / 2;

    this.setPadding(w, h);
    // console.log(playerRadio, this.radioWidth / this.radioHeight, width, height, w, h);
  }

  setPadding(w, h) {
    if (w < 0) {
      w = 0;
    }
    this.player().tech_.el().style.paddingLeft = w + "px";
    this.player().tech_.el().style.paddingRight = w + "px";
    if (h < 0) {
      h = 0;
    }
    this.player().tech_.el().style.paddingTop = h + "px";
    this.player().tech_.el().style.paddingBottom = h + "px";
  }

  setScrollFunc(scrollDiv, scrollDom, callback) {
    let bar = scrollDom.childNodes[1];
    let mask = scrollDom.childNodes[3];
    let barleft = 0;
    bar.onmousedown = function (e) {
      let event = e || window.event;
      let leftVal = event.clientX - this.offsetLeft;
      let that = this;

      scrollDiv.onmousemove = function (e) {
        let event = e || window.event;
        barleft = event.clientX - leftVal;
        if (barleft < 0) barleft = 0;
        else if (barleft > 255) barleft = 255;

        mask.style.width = barleft + "px";
        that.style.left = barleft + "px";
        callback(parseInt((barleft / 255) * 100));

        //防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
        window.getSelection
          ? window.getSelection().removeAllRanges()
          : document.selection.empty();
      };
    };
  }

  createEl() {
    return videojs.dom.createEl("div", {
      className: "vjs-resizer-modal vjs-hidden",
      innerHTML: `
        <div class="vjs-resizer-modal-content">
        <span class="vjs-resizer-modal-close">&times;</span>
          <div class="vjs-resizer-modal-title">Aspect Ratio</div>
          <div class="vjs-resizer-wrap">
            <div class="vjs-resizer-size">
              <span class="size-title">Size</span>
              <div class="size-scroll" id="size-scroll">
                <div class="size-scroll-bar"></div>
                <div class="size-scroll-mask"></div>
              </div>
            </div>
            <div class="radios">
              Ratio
              <input type="radio" name="radio" id="origin" value="origin" checked >
              <label for="origin">Default</label>
              <input type="radio" name="radio" id="4:3" value="4:3">
              <label for="4:3">4:3</label>
              <input type="radio" name="radio" id="16:9" value="16:9">
              <label for="16:9">16:9</label>
              <input type="radio" name="radio" id="fill" value="fill">
              <label for="fill">Full</label>
            </div>
            <ul style="clear:both">
                <li id="vjs-resizer-reset">Reset</li>
            </ul>
          </div>
        </div>
        `,
    });
  }
}

export default ResizerPanel;
