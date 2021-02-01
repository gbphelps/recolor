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

    const topHeight = (container.height - 20) * 0.6;
    main.style.height = `${topHeight}px`;
    main.style.width = `${topHeight}px`;
    top.style.height = `${topHeight}px`;
    bs.style.height = `${(container.height - 20) * 0.4}px`;

    // hsl.style.width = `${(container.width - 20) * 0.55}px`;
    // hsv.style.width = `${(container.width - 20) * 0.45}px`;
  }
}

export default new ResizeEvents();
