import mainColor from './ColorObject';
import createSVG from './createSVG';
import converter from './colorMethods/index';
import resizeEvent from './resizeEvents';

const MARGIN = 20;

export default function makeLightnessBlocks(
  colorSpace,
  channel,
  target = document.body,
) {
  const HEIGHT = 510;
  const N = 21;
  const m = 1;
  let size = (HEIGHT - (m * (N - 1))) / N;

  const svg = createSVG('svg', {
    viewBox: `0 0 ${target.getBoundingClientRect().width} ${target.getBoundingClientRect().height}`,
  });

  svg.style.height = '100%';
  svg.style.width = 'auto';

  const body = createSVG('g', {
    transform: `translate(${2} ${2})`,
  });
  svg.appendChild(body);

  const frame = createSVG('rect', {
    height: size,
    width: size,

    fill: 'transparent',
    stroke: 'white',
    'stroke-width': 2,
    'vector-effect': 'non-scaling-stroke',
    filter: 'url(#shadow)',
    rx: 2,
    ry: 2,
  });
  body.appendChild(frame);

  let blocks = [];

  function makeBlocks() {
    blocks.forEach((block) => {
      block.parentNode.removeChild(block);
    });
    blocks = [];
    for (let i = 0; i < N; i++) {
      const block = createSVG('rect', {
        height: size,
        width: size,
        y: (N - 1 - i) * (size + m),
      });
      block.addEventListener('click', () => {
        const color = mainColor.color[colorSpace];
        mainColor.set(colorSpace, {
          ...color,
          [channel.name]: i * [channel.max] / (N - 1),
        });
      });
      body.appendChild(block);
      blocks.push(block);
    }

    frame.setAttribute('height', size);
    frame.setAttribute('width', size);
    const p = frame.parentNode;
    p.removeChild(frame);
    p.appendChild(frame);
  }
  makeBlocks();

  function setBlocks(COLOR, PREV) {
    const inc = (channel.max / (N - 1));
    const replacementIndex = Math.round(COLOR[colorSpace][channel.name] / inc);

    for (let i = 0; i < N; i++) {
      if (i === replacementIndex) {
        blocks[i].setAttribute(
          'fill',
          `rgb(${COLOR.rgb.red},${COLOR.rgb.green},${COLOR.rgb.blue})`,
        );
        frame.setAttribute('y', (N - 1 - i) * (size + m));
        continue;
      }
      const tempChannel = inc * i;
      const conv = converter.getRGB[colorSpace];
      const color = conv({
        ...COLOR[colorSpace],
        [channel.name]: tempChannel,
      });
      blocks[i].setAttribute(
        'fill',
        `rgb(${color.red},${color.green},${color.blue})`,
      );
      blocks[i].setAttribute('stroke', 'transparent');
    }
  }

  mainColor.subscribe(setBlocks);

  function resize() {
    const { height: parentHeight, width: parentWidth } = target.getBoundingClientRect();

    const newHeight = parentHeight - 2 * MARGIN;
    size = (newHeight - (m * (N - 1))) / N;

    const fr = parentWidth - size;

    body.setAttribute('transform', `translate(${
      target.id === 'lightness-blocks-l' ? 2 * fr / 3 : fr / 3
    } ${MARGIN})`);

    Object.assign(svg.style, {
      height: `${newHeight}px`,
    });
    svg.setAttribute('viewBox', `0 0 ${parentWidth} ${parentHeight}`);
    svg.style.height = `${parentHeight}px`;

    makeBlocks(size);
    setBlocks(mainColor.color);
  }
  resize();
  resizeEvent.subscribe(resize);

  Object.assign(svg.style, {
    border: 'none',
    borderRadius: 0,
    boxShadow: 'none',
    margin: 'none',
  });
  target.appendChild(svg);
}
