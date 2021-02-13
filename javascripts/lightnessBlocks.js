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
  svg.style.outline = '1px solid lime';

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
        y: i * (size + m),
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
    console.log(size);
    const inc = (channel.max / (N - 1));
    const replacementIndex = Math.round(COLOR[colorSpace][channel.name] / inc);

    for (let i = 0; i < N; i++) {
      if (i === replacementIndex) {
        blocks[i].setAttribute(
          'fill',
          `rgb(${COLOR.rgb.red},${COLOR.rgb.green},${COLOR.rgb.blue})`,
        );
        frame.setAttribute('y', i * (size + m));
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
    Object.assign(svg.style, {
      height: `${parentHeight}px`,
    });
    svg.setAttribute('viewBox', `0 0 ${parentWidth} ${parentHeight}`);
    size = (parentHeight - (m * (N - 1))) / N;
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
