const MARGIN = 20;

class ResizeEvents {
  constructor() {
    this.subscriptions = [];
    window.addEventListener('resize', this.resize.bind(this));
  }

  subscribe(fn) {
    setTimeout(fn);
    window.addEventListener('resize', fn);
  }

  init() {
    this.resize();
  }

  // eslint-disable-next-line class-methods-use-this
  resize() {
    const ooo = document.getElementById('ooo');
    const iii = document.getElementById('iii');
    const bs = document.getElementById('block-sliders');
    const top = document.getElementById('top');
    const main = document.getElementById('main');
    const hsl = document.getElementById('hsl');
    const hsv = document.getElementById('hsv');
    const lb = document.getElementById('lightness-blocks');
    const rc = document.getElementById('right-container');

    const rgbcmyk = document.getElementById('rgb-cmyk');
    const rgb = document.getElementById('rgb');
    const cmyk = document.getElementById('cmyk');

    const minRatio = 1.6;
    const maxRatio = 1.8;

    const rect = ooo.getBoundingClientRect();
    const container = {
      height: 0,
      width: 0,
    };
    if (rect.width / rect.height > maxRatio) {
      container.height = rect.height;
      container.width = rect.height * maxRatio;
    } else if (rect.width / rect.height < minRatio) {
      container.width = rect.width;
      container.height = rect.width / minRatio;
    } else {
      container.height = rect.height;
      container.width = rect.width;
    }
    iii.style.height = `${container.height}px`;
    iii.style.width = `${container.width}px`;

    const topHeight = (container.height - MARGIN) * 0.6;
    main.style.height = `${topHeight}px`;
    main.style.width = `${topHeight}px`;
    top.style.height = `${topHeight}px`;
    bs.style.height = `${(container.height - MARGIN) * 0.4}px`;

    const numBlocks = 21;
    const blockMargin = 1;
    const lbWidth = (container.height - 2 * MARGIN - (numBlocks - 1) * blockMargin) / numBlocks * 2 + 3 * MARGIN;
    lb.style.width = `${lbWidth}px`;
    const rightWidth = container.width - MARGIN - lbWidth;

    rc.style.width = `${rightWidth}px`;
    hsl.style.width = `${(rightWidth - MARGIN) * 0.55}px`;
    hsv.style.width = `${(rightWidth - MARGIN) * 0.45}px`;

    rgbcmyk.style.outline = '1px solid red';
    rgbcmyk.style.width = `${rightWidth - MARGIN - topHeight}px`;
    rgbcmyk.style.height = `${topHeight}px`;

    rgb.style.outline = '1px solid lime';
    cmyk.style.outline = '1px solid lime';

    rgb.style.height = `${(topHeight - MARGIN) * 0.45}`;
    cmyk.style.height = `${(topHeight - MARGIN) * 0.55}`;
  }
}

export default new ResizeEvents();
