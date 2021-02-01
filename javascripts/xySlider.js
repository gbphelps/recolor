import createSVG from './createSVG';
import mainColor from './ColorObject';
import { CHAN_MAX } from './colorMathConstants';
import xyGradient from './gradientGenerators/xyGradient';
import linearGradient from './gradientGenerators/linearGradient';
import resizeEvent from './resizeEvents';

const SLIDER_PIP_WIDTH = 22;
const SLIDER_PIP_HEIGHT = 8;
const XY_SLIDER_PADDING = 0;
const DIM_RATIO = 1;
let lastValid;
let SVG_HEIGHT = 0;
let SVG_WIDTH = 0;
let CONTENT_HEIGHT = 0;
const CONTENT_WIDTH = 0;
let XY_WIDTH = 0;

export default function makeXYSlider({
  xChannel,
  yChannel,
  zChannel,
  colorSpace,
  trackWidth = 20,
  spaceBetween = 10,
  outerMargin = 20,
  target,
}) {
  const xMax = CHAN_MAX[colorSpace][xChannel];
  const yMax = CHAN_MAX[colorSpace][yChannel];
  const zMax = CHAN_MAX[colorSpace][zChannel];

  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'relative',
    height: '100%',
    width: '100%',
  });

  if (!target) target = document.body;

  const xySVG = createSVG('rect', {
    height: CONTENT_HEIGHT,
    width: CONTENT_WIDTH,
    rx: XY_SLIDER_PADDING,
  });
  const xyGradientPattern = xyGradient({
    height: 400,
    width: 400,
    padding: XY_SLIDER_PADDING,
    colorSpace,
    xChannel,
    yChannel,
    zChannel,
    element: xySVG,
  });
  xySVG.setAttribute('fill', `url(#${xyGradientPattern.id})`);
  const defs = createSVG('defs', {});

  const svg = createSVG('svg', {
    viewBox: `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`,
  });

  Object.assign(svg.style, {
    display: 'block',
    flexShrink: 0,
  });

  const body = createSVG('g', {
    transform: `translate(${outerMargin} ${outerMargin})`,
  });

  const pip = createSVG('circle', {
    r: 5,
    stroke: 'white',
    fill: 'transparent',
    filter: 'url(#shadow)',
  });

  const v = createSVG('line', {
    stroke: 'white',
    'stroke-width': 0.5,
  });

  const inputX = document.createElement('input');
  Object.assign(inputX.style, {
    position: 'absolute',
    margin: 0,
    transform: 'translateX(-50%)',
    bottom: 0,
  });
  inputX.addEventListener('input', (e) => {
    e.preventDefault();
    if (isNaN(+inputX.value) || +inputX.value < 0 || +inputX.value > xMax) return;
    mainColor.set(
      colorSpace,
      { [xChannel]: +inputX.value },
    );
  });
  inputX.addEventListener('blur', () => {
    inputX.value = lastValid.x.toFixed(1);
  });

  const h = createSVG('line', {
    stroke: 'white',
    'stroke-width': 0.5,
  });
  const inputY = document.createElement('input');
  inputY.addEventListener('input', (e) => {
    e.preventDefault();
    if (isNaN(+inputY.value) || +inputY.value < 0 || +inputY.value > yMax) return;
    mainColor.set(
      colorSpace,
      { [yChannel]: +inputY.value },
    );
  });
  inputY.addEventListener('blur', () => {
    inputY.value = lastValid.y.toFixed(1);
  });

  const inputZ = document.createElement('input');

  const sliderPip = createSVG('rect', {
    height: SLIDER_PIP_HEIGHT,
    width: SLIDER_PIP_WIDTH,
    stroke: 'white',
    filter: 'url(#shadow)',
    fill: 'transparent',
  });

  sliderPip.addEventListener('mousedown', (e) => {
    let y = e.clientY;
    function move(e) {
      const delY = (y - e.clientY) / (CONTENT_HEIGHT - SLIDER_PIP_HEIGHT) * zMax * DIM_RATIO;
      const yAttempt = mainColor.color[colorSpace][zChannel] + delY;
      let newY = Math.min(zMax, yAttempt);
      newY = Math.max(newY, 0);
      mainColor.set(colorSpace, {
        [zChannel]: newY,
      });
      if (newY === yAttempt) y = e.clientY;
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', move);
    }, { once: true });
  });

  function zSubscription(COLOR) {
    const y = (1 - (COLOR[colorSpace][zChannel] / zMax)) * (CONTENT_HEIGHT - SLIDER_PIP_HEIGHT);
    sliderPip.setAttribute('y', y);
  }
  mainColor.subscribe(zSubscription);

  const sliderTrack = createSVG('rect', {
    width: trackWidth,
  });
  const linearGradientPattern = linearGradient({
    height: 400,
    width: 1,
    colorSpace,
    channel: zChannel,
    padding: SLIDER_PIP_HEIGHT / 2,
    element: sliderTrack,
  });
  sliderTrack.setAttribute('fill', `url(#${linearGradientPattern.id})`);
  body.appendChild(sliderTrack);
  body.appendChild(sliderPip);

  function resize() {
    const { height, width } = container.getBoundingClientRect();
    SVG_HEIGHT = height;
    SVG_WIDTH = width;
    CONTENT_HEIGHT = SVG_HEIGHT - 2 * outerMargin;
    XY_WIDTH = SVG_WIDTH - 2 * outerMargin - trackWidth - spaceBetween;
    xySVG.setAttribute('height', CONTENT_HEIGHT);
    xySVG.setAttribute('width', XY_WIDTH);
    sliderTrack.setAttribute('x', XY_WIDTH + spaceBetween);
    sliderTrack.setAttribute('height', CONTENT_HEIGHT);
    sliderPip.setAttribute('x', XY_WIDTH + spaceBetween - (SLIDER_PIP_WIDTH - trackWidth) / 2);
    v.setAttribute('y2', CONTENT_HEIGHT);
    h.setAttribute('x2', XY_WIDTH);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.height = `${height}px`;
    svg.style.width = `${width}px`;
    xySubscription(mainColor.color);
    zSubscription(mainColor.color);
  }
  resizeEvent.subscribe(resize);

  function xySubscription(COLOR) {
    lastValid = {
      x: COLOR[colorSpace][xChannel],
      y: COLOR[colorSpace][yChannel],
      z: COLOR[colorSpace][zChannel],
    };

    const xVal = COLOR[colorSpace][xChannel] / xMax * (XY_WIDTH - XY_SLIDER_PADDING * 2) + XY_SLIDER_PADDING;
    const yVal = (1 - COLOR[colorSpace][yChannel] / yMax) * (CONTENT_HEIGHT - XY_SLIDER_PADDING * 2) + XY_SLIDER_PADDING;

    pip.setAttribute('cx', xVal);
    pip.setAttribute('cy', yVal);
    v.setAttribute('x1', xVal);
    v.setAttribute('x2', xVal);
    inputX.style.left = (xVal + outerMargin) / DIM_RATIO;
    if (document.activeElement !== inputX) inputX.value = COLOR[colorSpace][xChannel].toFixed(1);

    h.setAttribute('y1', yVal);
    h.setAttribute('y2', yVal);
    inputY.style.top = (yVal + outerMargin) / DIM_RATIO;
    if (document.activeElement !== inputY) inputY.value = COLOR[colorSpace][yChannel].toFixed(1);

    if (document.activeElement !== inputZ) inputZ.value = COLOR[colorSpace][zChannel].toFixed(1);
  }
  mainColor.subscribe(xySubscription);

  pip.addEventListener('mousedown', (e) => {
    let x = e.clientX;
    let y = e.clientY;
    function move(e) {
      const delX = (e.clientX - x) / (XY_WIDTH - 2 * XY_SLIDER_PADDING) * DIM_RATIO * xMax;
      const delY = (y - e.clientY) / (CONTENT_HEIGHT - 2 * XY_SLIDER_PADDING) * DIM_RATIO * yMax;
      const rawY = mainColor.color[colorSpace][yChannel] + delY;
      const rawX = mainColor.color[colorSpace][xChannel] + delX;

      let nY = Math.max(rawY, 0);
      nY = Math.min(nY, yMax);

      let nX = Math.max(rawX, 0);
      nX = Math.min(nX, xMax);

      mainColor.set(colorSpace, {
        [xChannel]: nX,
        [yChannel]: nY,
      });

      if (nY === rawY) y = e.clientY;
      // note: the conditional here prevents deltas from being erroneously registered when we're outside of the slider box.
      if (nX === rawX) x = e.clientX;
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', move);
    }, { once: true });
  });

  target.appendChild(container);
  container.appendChild(svg);
  container.appendChild(inputX);
  container.appendChild(inputY);
  container.appendChild(inputZ);
  svg.appendChild(defs);
  svg.appendChild(body);
  body.appendChild(xySVG);
  body.appendChild(v);
  body.appendChild(h);
  body.appendChild(pip);
  defs.appendChild(linearGradientPattern);
  defs.appendChild(xyGradientPattern);

  Object.assign(inputZ.style, {
    position: 'absolute',
    margin: 0,
    right: (outerMargin + trackWidth / 2) / DIM_RATIO,
    top: '10px',
    transform: 'translateX(50%)translateY(-100%)',
  });
  inputZ.addEventListener('input', (e) => {
    e.preventDefault();
    if (isNaN(+inputZ.value) || +inputZ.value < 0 || +inputZ.value > zMax) return;
    mainColor.set(
      colorSpace,
      { [zChannel]: +inputZ.value },
    );
  });
  inputZ.addEventListener('blur', () => {
    inputZ.value = lastValid.z.toFixed(1);
  });

  Object.assign(inputY.style, {
    position: 'absolute',
    margin: 0,
    left: outerMargin / DIM_RATIO,
    transform: 'translateY(-50%)translateX(-100%)',
  });
}
