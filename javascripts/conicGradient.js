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

export default function conicGradient(){
	const c = document.createElement('canvas');

	c.width = 400;
	c.height = 400;


	const ctx = c.getContext('2d');

	const img = ctx.createImageData(c.width, c.height);


	for (let i=0; i<img.data.length/4; i++){
		let y = i%c.width;
		let x = Math.floor(i/c.width);

		x = c.width/2 - x;
		y = y - c.height/2;

		let angle = Math.atan(y/x);
		if (x < 0) angle = Math.PI + angle;
		if (y < 0 && x >= 0) angle = 2*Math.PI + angle;

		const sixth = angle/(Math.PI*2)*6;
		const rgba = color(sixth);

		for (let j=0;j<4;j++) img.data[i*4+j] = rgba[j];
	}

	ctx.putImageData(img,0,0);
	return c.toDataURL();
}