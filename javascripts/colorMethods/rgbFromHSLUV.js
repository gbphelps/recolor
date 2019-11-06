import {hsluvToRgb, rgbToHsluv} from 'hsluv';


window.h2r = hsluvToRgb;
window.r2h = rgbToHsluv;

export default function hsluvFromRGB(hsluv){
    const color = hsluvToRgb([hsluv.hue, hsluv.saturation, hsluv.lightness]);
    return {
        red: color[0]*255,
        green: color[1]*255,
        blue: color[2]*255
    }
}