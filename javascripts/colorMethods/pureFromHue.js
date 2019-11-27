function color(sixth){
	switch (Math.floor(sixth)){
		case 0:
			return [255, 255*(sixth%1), 0, 255];
		case 1:
			return [255 * (1-sixth%1), 255, 0, 255];
		case 2:
			return [0, 255, 255 * (sixth%1), 255];
		case 3:
			return [0, 255 * (1-sixth%1), 255, 255];
		case 4:
			return [255 * (sixth%1), 0, 255, 255];
		case 5:
			return [255, 0, 255 * (1-sixth%1), 255];
	}
return [0,0,0,0]
}

export default function pureFromHue(hue){
    const [red, green, blue] = color(hue/60);
    return { red, green, blue }
}