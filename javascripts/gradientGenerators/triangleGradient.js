import pureFromHue from '../colorMethods/pureFromHue';
import fragmentScript from '../webgl/shaders/triangleGradient.glsl';
import getPattern from './utils/getPattern';
import isEqual from '../utils/isEqual';

export default function triangleGradient({
  height,
  width,
  side,
  margin,
  element,
}) {
  return getPattern({
    element,
    height,
    width,
    script: fragmentScript,
    staticUniforms: {
      u_side: {
        type: 'uniform1f',
        value: side,
      },
      u_margin: {
        type: 'uniform1f',
        value: margin,
      },
    },
    dynamicUniforms: {
      u_color: {
        type: 'uniform3f',
        setter: (COLOR, PREV) => {
          const pure = pureFromHue(COLOR.hsl.hue % 360);
          const prevPure = pureFromHue(PREV.hsl.hue % 360);
          if (isEqual(pure, prevPure)) return false;
          return ['red', 'green', 'blue'].map((k) => pure[k] / 255);
        },
      },
    },
  });
}
