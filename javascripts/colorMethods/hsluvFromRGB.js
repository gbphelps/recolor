import {rgbToHsluv} from 'hsluv';

export default function hsluvFromRGB(rgb){
    const color = rgbToHsluv([rgb.red, rgb.green, rgb.blue]);
    return {
        hue: color[0],
        saturation: color[1],
        lightness: color[2]
    }
}