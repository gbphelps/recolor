import extrema from '../utils/extrema';
import hueFromRGB from './hueFromRGB';

export default function hslFromRGB(rgb){
    const { max, min } = extrema(rgb);
    const lightness = (rgb[max] + rgb[min])/2 /255;
    const hue = hueFromRGB(rgb);
    let saturation;
    if (lightness === 0 || lightness === 1){
        saturation = 0
    } else {
        saturation = (rgb[max] - rgb[min])/255 /(1 - Math.abs(2*lightness - 1));
    }
    return { saturation: saturation*100, lightness: lightness*100, hue };
}