import hslFromRGB from './hslFromRGB';
import hsluvFromRGB from './hsluvFromRGB';
import hsvFromRGB from './hsvFromRGB';
import hueFromRGB from './hueFromRGB';
import cmykFromRGB from './cmykFromRGB';

import rgbFromHSL from './rgbFromHSL';
import rgbFromHSLUV from './rgbFromHSLUV';
import rgbFromHSV from './rgbFromHSV';
import rgbFromCMYK from './rgbFromCMYK';

import triFromRGB from './triFromRGB';

export default {
    getRGB: {
        hsl: rgbFromHSL,
        hsluv: rgbFromHSLUV,
        hsv: rgbFromHSV,
        cmyk: rgbFromCMYK
    }
}