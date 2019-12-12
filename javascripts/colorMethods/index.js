import hslFromRGB from './hslFromRGB';
import hsluvFromRGB from './hsluvFromRGB';
import hsvFromRGB from './hsvFromRGB';
import cmykFromRGB from './cmykFromRGB';

import rgbFromHSL from './rgbFromHSL';
import rgbFromHSLUV from './rgbFromHSLUV';
import rgbFromHSV from './rgbFromHSV';
import rgbFromCMYK from './rgbFromCMYK';

export default {
    getRGB: {
        hsl: rgbFromHSL,
        hsluv: rgbFromHSLUV,
        hsv: rgbFromHSV,
        cmyk: rgbFromCMYK,
        rgb: v => v,
    },
    fromRGB: {
        hsl: hslFromRGB,
        hsluv: hsluvFromRGB,
        hsv: hsvFromRGB,
        cmyk: cmykFromRGB,
        rgb: v => v
    }
}