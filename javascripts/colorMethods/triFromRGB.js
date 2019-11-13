import rgbFromHSV from './rgbFromHSV';
import hsvFromRGB from './hsvFromRGB';

import extrema from '../utils/extrema'
export default function(rgb){
   const { max, min } = extrema(rgb);
   const white = rgb[min]/255;
   const color = (rgb[max] - 255*white)/255;
   const black = 1 - white - color;
   console.log({white, black, color});
}