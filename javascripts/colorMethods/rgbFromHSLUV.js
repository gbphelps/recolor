import {hsluvToRgb} from 'hsluv';

export default function hsluvFromRGB(hsluv){
    const color = hsluvToRgb([hsluv.hue, hsluv.saturation, hsluv.lightness]);
    return {
        red: color[0],
        green: color[1],
        blue: color[2]
    }
}