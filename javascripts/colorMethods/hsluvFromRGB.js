import {rgbToHsluv} from 'hsluv';

export default function hsluvFromRGB(rgb){
    const color = rgbToHsluv([rgb.red/255, rgb.green/255, rgb.blue/255]);
    console.log(color)
    return {
        hue: color[0],
        saturation: color[1],
        lightness: color[2]
    }
}