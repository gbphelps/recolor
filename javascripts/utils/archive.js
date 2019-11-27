// function valueError(obj){
// 	const keys = Object.keys(obj);
// 	for (let i=0; i<keys.length; i++){
// 		if (
// 			Number.isNaN(obj[keys[i]]) ||
// 			obj[keys[i]] === Infinity ||
// 			obj[keys[i]] === -Infinity
// 		) return true;  
// 	}
// 	return false;
// }

// function isEqual(obj,obj2){
// 	const keys1 = Object.keys(obj || {});
// 	const keys2 = Object.keys(obj2 || {});
// 	if (keys1.length !== keys2.length) return false;
// 	for (let i=0; i<keys1.length; i++){
// 		if (obj[keys1[i]] !== obj2[keys1[i]]) return false;
// 	}
// 	return true;
// }

// function getPure(color){
// 	const {max, min} = extrema(color);
// 	const multiplier = 255/(color[max] - color[min]);

// 	return {
// 		red: (color.red - color[min])*multiplier,
// 		green: (color.green - color[min])*multiplier,
// 		blue: (color.blue - color[min])*multiplier,
// 	}
// }