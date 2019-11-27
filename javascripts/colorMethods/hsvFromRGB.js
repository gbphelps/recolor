import hueFromRGB from './hueFromRGB';
import extrema from '../utils/extrema';

export default function hsvFromRGB(rgb){
    const {max, min} = extrema(rgb);
    const saturation = (1-rgb[min]/rgb[max]) * 100;
    const value = rgb[max]/255 * 100;
    const hue  = hueFromRGB(rgb);
    return {hue, saturation, value}
}