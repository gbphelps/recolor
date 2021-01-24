export default function isEqual(obj,obj2){
	const keys1 = Object.keys(obj || {});
	const keys2 = Object.keys(obj2 || {});
	if (keys1.length !== keys2.length) return false;
	for (let i=0; i<keys1.length; i++){
		if (obj[keys1[i]] !== obj2[keys1[i]]) return false;
	}
	return true;
}
