import fragmentScript from '../webgl/shaders/conicGradient.glsl';
import getPattern from './utils/getPattern';

export default function conicGradient({
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
    staticUniforms: {},
    dynamicUniforms: {
      u_saturation: {
        type: 'uniform1f',
        setter: ((COLOR, PREV) => {
          if (COLOR.hsl.saturation === PREV.hsl.saturation) return false;
          return COLOR.hsl.saturation / 100;
        }),
      },
      u_lightness: {
        type: 'uniform1f',
        setter: ((COLOR, PREV) => {
          if (COLOR.hsl.lightness === PREV.hsl.lightness) return false;
          return COLOR.hsl.lightness / 100;
        }),
      },
    },
  });
}
