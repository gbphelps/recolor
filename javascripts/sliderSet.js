import createSVG from './createSVG';
import mainColor from './ColorObject';
import allEqualExcept from './utils/allEqualExcept';
import methods from './colorMethods/index';
import resizeEvent from './resizeEvents';

const MARGIN = 20;

export default function buildChannels(channels, {
  trackThickness = 8,
  pipWidth = 12,
  orientation = 'horizontal',
  margin = 24,
  outerMargin = 24,
  spacing = 0,
  recipient = document.body,
}) {
  let HH = 0;
  let WW = 0;
  let trackLength = 0;

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  inputContainer.style.display = 'none'; // TODO DELETE THIS WHEN YOU'RE READY
  inputContainer.style.margin = `${spacing}px`;

  const container = createSVG('svg', {});

  Object.assign(container.style, {
    display: 'block',
  });

  recipient.appendChild(container);
  recipient.appendChild(inputContainer);

  function resize() {
    const { height, width } = recipient.getBoundingClientRect();
    WW = width;
    HH = height;
    trackLength = WW - 2 * MARGIN;
    container.setAttribute('viewBox', `0 0 ${WW} ${HH}`);
    Object.assign(container.style, {
      height: HH,
      width: WW,
    });
  }
  resize();
  resizeEvent.subscribe(resize);

  channels.forEach((param, i) => {
    let maxValue;
    switch (param.type) {
      case 'rgb':
        maxValue = 255;
        break;
      default:
        maxValue = 100;
    }

    const INPUT_HEIGHT = 24;
    const input = document.createElement('input');
    Object.assign(input.style, {
      height: `${INPUT_HEIGHT}px`,
      display: 'block',
      position: 'absolute',
      top: `${outerMargin + i * (trackThickness + margin) + (trackThickness / 2) - INPUT_HEIGHT / 2}`,
      margin: 0,
    });

    // const label = document.createElement('label');
    // Object.assign(label.style, {
    //     userSelect: 'none'
    // })

    Object.assign(inputContainer.style, {
      userSelect: 'none',
      height: `${HH}px`,
      position: 'absolute',
      right: '16px',
    });

    // label.innerHTML = paramLookup[param.channel];
    // inputContainer.appendChild(label);
    inputContainer.appendChild(input);
    let lastValid = 0;

    mainColor.subscribe((COLOR, PREV) => {
      lastValid = COLOR[param.type][param.channel];
      const value = Math.round(COLOR[param.type][param.channel] * 10) / 10;
      if (document.activeElement !== input) input.value = value.toFixed(1);
    });

    input.addEventListener('input', (e) => {
      e.preventDefault();
      if (isNaN(+input.value) || +input.value < 0 || +input.value > maxValue) return;
      mainColor.set(
        param.type,
        { [param.channel]: +input.value },
      );
    });

    input.addEventListener('blur', () => {
      input.value = lastValid.toFixed(1);
    });

    const gradient = createSVG('linearGradient', {
      y1: 0,
      y2: 0,
      gradientUnits: 'userSpaceOnUse',
    });

    const stop1 = createSVG('stop', {
      offset: 0,
      'stop-color': 'black', // TODO: initialize
    });

    const stop2 = createSVG('stop', {
      offset: 0.5,
      'stop-color': 'red', // TODO: initialize
    });

    const stop3 = createSVG('stop', {
      offset: 1,
      'stop-color': 'red', // TODO: initialize
    });

    const track = createSVG('rect', {
      width: trackLength,
      height: trackThickness,
      y: (trackThickness + margin) * i + outerMargin,
      x: MARGIN,
      rx: 2,
      fill: `url(#${gradient.id})`,
    });

    const pip = createSVG('rect', {
      height: trackThickness + 2,
      width: pipWidth,
      fill: 'transparent',
      y: (trackThickness + margin) * i - 1 + outerMargin,
      stroke: 'white',
      'stroke-width': 2,
      'vector-effect': 'non-scaling-stroke',
      filter: 'url(#shadow)',
      rx: 2,
    });

    resizeEvent.subscribe(() => {
      const hFree = HH - trackThickness * channels.length - 2 * MARGIN;
      const hPadding = hFree / (channels.length - 1);
      const vPos = MARGIN + (hPadding + trackThickness) * i;

      track.setAttribute('width', trackLength);
      track.setAttribute('y', vPos);
      gradient.setAttribute('x1', pipWidth / 2 + MARGIN);
      gradient.setAttribute('x2', trackLength - pipWidth / 2 + MARGIN);
      pip.setAttribute('y', vPos);
      pipColorSub(mainColor.color);
    });

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);

    container.appendChild(gradient);
    container.appendChild(track);
    container.appendChild(pip);

    function pipColorSub(COLOR, PREV) {
      if (
        !PREV
        || COLOR[param.type][param.channel]
        !== PREV[param.type][param.channel]
      ) {
        pip.setAttribute(
          'x',
          COLOR[param.type][param.channel] / maxValue * (trackLength - pipWidth) + MARGIN,
        );
      }
    }

    mainColor.subscribe(pipColorSub);

    mainColor.subscribe((COLOR, PREV) => {
      if (allEqualExcept(
        param.channel,
        COLOR[param.type],
        PREV[param.type],
      )) return;

      let left;
      let middle;
      let right;

      const base = COLOR[param.type];
      if (param.type !== 'rgb') {
        left = methods.getRGB[param.type]({ ...base, [param.channel]: 0 });
        right = methods.getRGB[param.type]({ ...base, [param.channel]: maxValue });
        middle = methods.getRGB[param.type]({ ...base, [param.channel]: maxValue / 2 });
      } else {
        left = { ...base, [param.channel]: 0 };
        right = { ...base, [param.channel]: maxValue };
        middle = { ...base, [param.channel]: maxValue / 2 };
      }

      const l = `rgb(${left.red},${left.green},${left.blue})`;
      const m = `rgb(${middle.red},${middle.green},${middle.blue})`;
      const r = `rgb(${right.red},${right.green},${right.blue})`;

      stop1.setAttribute('stop-color', orientation === 'horizontal' ? l : r);
      stop2.setAttribute('stop-color', m);
      stop3.setAttribute('stop-color', orientation === 'horizontal' ? r : l);
    });

    pip.addEventListener('mousedown', (e) => {
      let x = orientation === 'horizontal' ? e.clientX : e.clientY;
      let rawProgress = mainColor.color[param.type][param.channel];

      function move(e) {
        const newX = orientation === 'horizontal' ? e.clientX : e.clientY;
        const delx = (orientation === 'horizontal' ? newX - x : x - newX); // note need to scale if svg space is diff from user space;
        rawProgress += delx / (trackLength - pipWidth) * maxValue;

        let newVal = Math.min(rawProgress, maxValue);
        newVal = Math.max(newVal, 0);
        mainColor.set(param.type, { [param.channel]: newVal });
        x = orientation === 'horizontal' ? e.clientX : e.clientY;
      }

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', move);
      }, { once: true });
    });
  });
}
