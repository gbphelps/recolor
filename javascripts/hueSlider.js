import mainColor from './ColorObject';
import conicGradient from './gradientGenerators/conicGradient';
import createSVG from './createSVG';
import c from './constants';

let RADIUS = 100;
const huePipH = 12;
const huePipW = 10;
const huePipStroke = 2;

export default function hueSlider(target) {
  if (!target) target = document.body;

  const thickness = c.hueSlider.trackThickness;
  const marg = c.hueSlider.svgMargin;

  const svg = createSVG('svg', {
    viewBox: `0 0 ${RADIUS * 2 + marg} ${RADIUS * 2 + marg}`,
    height: RADIUS * 2 + marg,
  });

  const input = document.createElement('input');
  input.onblur = () => {
    input.value = mainColor.color.hsv.hue.toFixed(0);
  };
  input.oninput = () => {
    const v = +input.value;
    if (isNaN(v)) return;
    mainColor.set('hsv', { hue: v });
  };

  Object.assign(input.style, {
    position: 'absolute',
    transform: 'translateY(50%)',
  });

  c.hueSlider.set(svg);

  const defs = createSVG('defs', {});
  const mask = createSVG('mask', {});

  const maskBG = createSVG('rect', {
    fill: 'white',
  });

  const maskCircle = createSVG('circle', {
    fill: 'black',
  });

  const pattern = conicGradient({
    height: 400,
    width: 400,
  });

  mask.appendChild(maskBG);
  mask.appendChild(maskCircle);
  defs.appendChild(mask);
  defs.appendChild(pattern);

  const gBody = createSVG('g', { transform: `translate( ${marg / 2} ${marg / 2})` });

  const gHue = createSVG('g', {});

  const hueTrack = createSVG('circle', {
    fill: `url(#${pattern.id})`,
    mask: `url(#${mask.id})`,
  });

  const gPip = createSVG('g', {
    filter: 'url(#shadow)',
  });
  const pipRect = createSVG('rect', {
    width: huePipW,
    height: huePipH,
    rx: 2,
    fill: 'transparent',
    'stroke-width': 2,
    stroke: 'white',
    'vector-effect': 'non-scaling-stroke',
  });
  gBody.appendChild(gHue);
  gHue.appendChild(hueTrack);

  gBody.appendChild(gPip);
  gPip.appendChild(pipRect);

  target.appendChild(input);
  target.appendChild(svg);
  svg.appendChild(defs);
  svg.appendChild(gBody);

  function resize() {
    const { height } = target.getBoundingClientRect();
    RADIUS = (height - marg) / 2;
    svg.setAttribute('viewBox', `0 0 ${height} ${height}`);
    svg.setAttribute('height', height);
    maskCircle.setAttribute('r', RADIUS - thickness);
    maskCircle.setAttribute('cx', RADIUS);
    maskCircle.setAttribute('cy', RADIUS);
    maskBG.setAttribute('height', RADIUS * 2);
    maskBG.setAttribute('width', RADIUS * 2);
    hueTrack.setAttribute('r', RADIUS);
    hueTrack.setAttribute('cx', RADIUS);
    hueTrack.setAttribute('cy', RADIUS);
    gPip.setAttribute('transform', `translate(${RADIUS} ${RADIUS})`);
    setPipFromColor(mainColor.color);
  }
  resize();
  window.addEventListener('resize', resize);

  function setPipFromColor(COLOR, PREV) {
    if (PREV && COLOR.hsv.hue === PREV.hsv.hue) return;
    const x = -huePipW / 2 + RADIUS - thickness / 2;
    const y = -huePipH / 2;
    pipRect.setAttribute('transform', `rotate(${COLOR.hsv.hue - 90})translate(${x} ${y})`);
    const xRot = Math.sin(COLOR.hsv.hue * Math.PI / 180) * (RADIUS - thickness / 2);
    const yRot = -Math.cos(COLOR.hsv.hue * Math.PI / 180) * (RADIUS - thickness / 2);
    const tx = xRot < 0 ? 'translateX(-100%)' : '';
    const ty = 'translateY(-50%)';
    input.style.transform = `${tx}${ty}`;
    const offset = (xRot < 0 ? -huePipH - huePipStroke : 0) * 1;
    input.style.left = `${xRot + target.getBoundingClientRect().height / 2 + offset}px`;
    input.style.top = `${yRot + target.getBoundingClientRect().height / 2}px`;
    if (document.activeElement !== input) input.value = COLOR.hsv.hue.toFixed(0);
  }

  mainColor.subscribe(setPipFromColor);

  pipRect.addEventListener('mousedown', (e) => {
    let [x, y] = [e.clientX, e.clientY];
    function move(e) {
      const delx = e.clientX - x; // note that this needs scaling if svg space is diff from user space
      const dely = e.clientY - y;

      const xnew = Math.cos((mainColor.color.hsv.hue - 90) / 180 * Math.PI) * (RADIUS - thickness / 2) + delx;
      const ynew = Math.sin((mainColor.color.hsv.hue - 90) / 180 * Math.PI) * (RADIUS - thickness / 2) + dely;

      let angle = Math.atan(ynew / xnew);
      if (xnew < 0) angle = Math.PI + angle;

      mainColor.set('hsv', { hue: angle / Math.PI * 180 + 90 });

      x = e.clientX;
      y = e.clientY;
    }

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', move);
    }, { once: true });
  });
}
