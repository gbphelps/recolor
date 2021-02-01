import { COLOR_SPACE, COLOR_ORD, CHAN_MAX } from '../colorMathConstants';
import fragmentScript from '../webgl/shaders/gradient1D.glsl';
import allEqualExcept from '../utils/allEqualExcept';
import getPattern from './utils/getPattern';

export default function linearGradient({
  colorSpace,
  channel,
  padding,
  height,
  width,
  element,
}) {
  function getDims() {
    return element.getBoundingClientRect();
  }
  return getPattern({
    getDims,
    height,
    width,
    script: fragmentScript,
    staticUniforms: {
      u_colorspace: {
        type: 'uniform1i',
        value: COLOR_SPACE[colorSpace],
      },
      u_padding: {
        type: 'uniform1f',
        value: padding,
      },
      u_chan: {
        type: 'uniform1i',
        value: COLOR_ORD[colorSpace][channel],
      },
    },
    dynamicUniforms: {
      u_color: {
        type: 'uniform3f',
        setter: (COLOR, PREV) => {
          // don't need to update if every other channel in this colorspace is the same.
          if (allEqualExcept(channel, COLOR[colorSpace], PREV[colorSpace])) {
            return false;
          }
          const vecColor = [];
          Object.keys(COLOR[colorSpace]).forEach((k) => {
            vecColor[COLOR_ORD[colorSpace][k]] = COLOR[colorSpace][k] / CHAN_MAX[colorSpace][k];
          });
          return vecColor;
        },
      },
    },
  });
}
