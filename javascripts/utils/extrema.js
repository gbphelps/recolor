export default function extrema(obj){
	let max = null;
	let min = null;
	Object.keys(obj).forEach(channel => {
		if (!min) min = channel;
		if (!max) max = channel;
		if (obj[channel] < obj[min]) min = channel;
		if (obj[channel] > obj[max]) max = channel;
	});
	return {max, min};
}