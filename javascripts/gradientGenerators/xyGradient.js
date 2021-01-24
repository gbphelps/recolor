import fragmentScript from '../webgl/shaders/xyGradient.glsl';
import { COLOR_ORD, CHAN_MAX, COLOR_SPACE } from '../colorMathConstants';
import getPattern from './utils/getPattern';

export default function xyGradient({
  height,
  width,
  padding,
  colorSpace,
  xChannel,
  yChannel,
  zChannel,
}) {
  return getPattern({
    height,
    width,
    script: fragmentScript,
    staticUniforms: {
      u_colorspace: {
        type: 'uniform1i',
        value: COLOR_SPACE[colorSpace],
      },
      u_ord: {
        type: 'uniform3i',
        value: [xChannel, yChannel, zChannel]
          .map((c) => COLOR_ORD[colorSpace][c]),
      },
      u_padding: {
        type: 'uniform1f',
        value: padding,
      },
    },
    dynamicUniforms: {
      u_z: {
        type: 'uniform1f',
        setter: (COLOR, PREV) => {
          if (COLOR[colorSpace][zChannel] === PREV[colorSpace][zChannel]) return false;
          const color = COLOR[colorSpace][zChannel] / CHAN_MAX[colorSpace][zChannel];
          return color;
        },
      },
    },
  });
}
