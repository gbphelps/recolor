import extrema from '../utils/extrema'
export default function hueFromRGB(rgb){
	const { max, min } = extrema(rgb);
	const c = rgb[max] - rgb[min];
	if (c === 0) return 0;
	
	let hue = null
	if (max === 'red'){
		hue = ((rgb.green - rgb.blue)/c + 6)%6
	} else if (max === 'green') {
		hue = (rgb.blue - rgb.red)/c + 2;
	} else if (max === 'blue'){
		hue = (rgb.red - rgb.green)/c + 4;
	}
	
	return hue/6 * 360;
}