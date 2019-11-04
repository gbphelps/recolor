import extrema from '../utils/extrema';

export function hslFromRGB(rgb){
    const { max, min } = extrema(rgb);
    const lightness = (max + min)/2 * 100/255;
    let saturation;
    if (lightness === 0 || lightness === 1) saturation = 0;
    saturation = (max - min)/(1 - Math.abs(2*lightness - 1));
    return { saturation, lightness }
}