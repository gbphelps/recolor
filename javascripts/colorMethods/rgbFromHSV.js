export default function rgbFromHSV(hsv){
	let max, min, mid;
	if ((hsv.hue + 60)%360 <= 120){
		max = 'red';
		[min, mid] = hsv.hue <= 60 ? ['blue', 'green'] : ['green', 'blue'];	
	} else if (hsv.hue <= 180) {
		max = 'green';
		[min, mid] = hsv.hue <= 120 ? ['blue', 'red'] : ['red', 'blue'] 
	} else {
		max = 'blue';
		[min, mid] = hsv.hue <= 240 ? ['red', 'green'] : ['green', 'red']
	}
	
	let progress = (hsv.hue%60) / 60;
	if (Math.floor(hsv.hue/60)%2 === 1){
		progress = 1 - progress
	};
	
	
	const maxval = 255/100 * hsv.value;
	const minval = (100 - hsv.saturation) * maxval / 100;
	const midval = minval + (maxval - minval)*progress;
	
	return {
		[max]: maxval,
		[min]: minval,
		[mid]: midval,
	}
}