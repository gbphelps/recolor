import hslFromRGB from './hslFromRGB';
import hsluvFromRGB from './hsluvFromRGB';
import hsvFromRGB from './hsvFromRGB';
import hueFromRGB from './hueFromRGB';

import rgbFromHSL from './rgbFromHSL';
import rgbFromHSLUV from './rgbFromHSLUV';
import rgbFromHSV from './rgbFromHSV';

import triFromRGB from './triFromRGB';

export default {
    getRGB: {
        hsl: rgbFromHSL,
        hsluv: rgbFromHSLUV,
        hsv: rgbFromHSV,
    }
}