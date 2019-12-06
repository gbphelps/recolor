import mainColor from './ColorObject';
import triFromRGB from './colorMethods/triFromRGB';
import extrema from './utils/extrema';
import createSVG from './createSVG';
import ns from './constants';
import pureFromHue from './colorMethods/pureFromHue';


const sq3 = Math.sqrt(3);
let pip = null;
let image = null;

const ratio = sq3/2;
const margin = 8;
const s = 120;
const h = s * ratio;
const black = [0,0,0,255];
const white = [255,255,255,255];

let canvas, ctx;

function gen(color){
	const img = ctx.createImageData(s + margin*2, Math.ceil(s*ratio + margin*2));
	const colorArray = [
		color.red, 
		color.green, 
		color.blue, 
		255
	];

	for (let i=0; i<img.data.length/4; i++){
		let x = i%(canvas.width);
		let y = Math.floor(i/(canvas.width));
		
		x -= margin;
		y -= margin;
		
		const top = y/h;
		const left = (x*sq3 - y)/h/2;
		const right = ((x-s)*-sq3 -y)/h/2;

		
		if (y < sq3*x && y < (x-s)*-sq3 && y > 0){
			for(let j=0; j<4; j++) img.data[i*4+j] = top*colorArray[j] + left*white[j] + right*black[j]
		
		} else if (y <= 0){
			for(let j=0; j<4; j++) img.data[i*4+j] = x/s*white[j] + (1-x/s)*black[j]
		
		} else if (x > s/2 && y > 0){
			const w = Math.min((-(x-s)/2 + ratio*y)/s,1);
			for(let j=0; j<4; j++) img.data[i*4+j] = (1-w)*white[j] + w*colorArray[j]
		
		} else if (x <= s/2 && y > 0){
			const w = Math.min((x/2 + ratio*y)/s,1);
			for(let j=0; j<4; j++) img.data[i*4+j] = (1-w)*black[j] + w*colorArray[j]
		} 
				
		
	}

	ctx.putImageData(img,0,0);
	return canvas.toDataURL();
}





export default function make(){

canvas = document.createElement('canvas');
canvas.width = s + margin*2;
canvas.height = Math.ceil(s*ratio + margin*2);
ctx = canvas.getContext('2d');

const url = gen({red: 255, green: 0, blue: 0});
const svg = createSVG('g',{});
const body = createSVG('g',{});
const defs = createSVG('defs',{});
const pattern = createSVG('pattern',{
	height: '100%',
	width: '100%'
})
image = createSVG('image',{href: url});
const clip = createSVG('clipPath',{});
const clippath = createSVG('path',{});
const r = createSVG('rect',{});

ns.hueSlider.get().appendChild(svg);
svg.appendChild(defs);
svg.appendChild(body);
defs.appendChild(pattern);
pattern.appendChild(image);
defs.appendChild(clip);
clip.appendChild(clippath);

clippath.setAttribute('d',`
	M ${margin} 0 
	l ${s} 0 
	a ${margin} ${margin} 0 0 1 ${margin*Math.sin(Math.PI/3)} ${margin + margin*Math.cos(Math.PI/3)}
	l ${-s/2} ${s*ratio} 
	a ${margin} ${margin} 0 0 1 ${-margin*2*Math.sin(Math.PI/3)} 0
	l ${-s/2} ${-s*ratio}
	A ${margin} ${margin} 0 0 1 ${margin} 0
`)

r.setAttribute('height', canvas.height);
r.setAttribute('width', canvas.width);
r.setAttribute('clip-path', `url(#${clip.id})`);
r.setAttribute('fill', `url(#${pattern.id})`);
r.setAttribute('filter',"url(#shadow)")
body.appendChild(r)


const hueHeight = ns.hueSlider.get().getBoundingClientRect().height;
body.setAttribute('transform', `
	translate(
		${-s/2/sq3 - margin + hueHeight/2} 
		${canvas.width + ( hueHeight - canvas.width)/2}
	)rotate(-90)`);

pip = createSVG('circle',{});
body.appendChild(pip);

pip.setAttribute('r', 5);
pip.setAttribute('cx', margin);
pip.setAttribute('cy', margin);
pip.setAttribute('stroke', 'white');
pip.setAttribute('fill', 'transparent');
pip.setAttribute('vector-effect','non-scaling-stroke')
pip.setAttribute('filter','url(#shadow2)')

mainColor.subscribe(setTriangle);
pip.addEventListener('mousedown',setPip)
}

function setPip(e){
	let x = e.clientX;
	let y = e.clientY;
	
	const pure = pureFromHue(mainColor.color.hsv.hue);
	function move(e){

		const dely = (e.clientX - x);
		const delx = -(e.clientY - y);
		
		let xAttempt = pip.cx.baseVal.value + delx;
		let yAttempt = pip.cy.baseVal.value + dely;
		
		if (yAttempt-margin > s*ratio ){
			//tip of triangle
			yAttempt = s*ratio + margin;
			xAttempt = s/2 + margin;
		} 
		
		if ((yAttempt-margin) < 0){
			yAttempt = margin;
		}
		
		if ((xAttempt-margin) < 0){
			xAttempt = margin;
		}
		
		if ((xAttempt-margin) > s){
			xAttempt = s + margin;
		}
		
		if ((yAttempt-margin) > (xAttempt-margin)*Math.sqrt(3)){
			if (-Math.sqrt(3)*dely > delx){
				yAttempt = (xAttempt-margin)*Math.sqrt(3) + margin;
			} else {
				xAttempt = (yAttempt-margin)/Math.sqrt(3) + margin;
			}
		} 
		
		
		if ((yAttempt-margin) > (xAttempt-margin-s)*-Math.sqrt(3)){
			if (Math.sqrt(3)*dely > delx){
				xAttempt = (yAttempt-margin)/-Math.sqrt(3) + margin +s;
			} else {
				yAttempt = (xAttempt-margin-s)*-Math.sqrt(3) + margin;
			}
		}
		

		const yy = yAttempt - margin;
		const xx = xAttempt - margin;

		const top = yy/h;
		const left = (xx*Math.sqrt(3) - yy)/h/2;

		const newColor = {
			red: pure.red*top + 255*left,
			green: pure.green*top + 255*left,
			blue: pure.blue*top + 255*left,
		}

		mainColor.setRGB(newColor);

		x = e.clientX;
		y = e.clientY;
	}
	
	document.addEventListener('mousemove',move);
	document.addEventListener('mouseup',()=>{
		document.removeEventListener('mousemove',move)
	},{once:true});
}


function setTriangle(COLOR,PREV){
	const tri = triFromRGB(COLOR.rgb);
	if (
		COLOR.hsv.saturation !== PREV.hsv.saturation ||
		COLOR.hsv.value !== PREV.hsv.value
	){
		const y = tri.color*s*ratio; //most obvious; move as a percentage of s*ratio units away from x axis.
		pip.setAttribute('cy', y + margin);
		const xP = sq3/2 * tri.white*s*ratio; 
		//find unit vector with slope perpindicular to sqrt(3), then multiply by s*ratio.
		//this gives a point that is the correct number of units away from the WHITE vertex.
		//Make a line with slope of sqrt(3) intersecting this point using the point-slope formula.
		//Find where this line intersects y = tri.color*s*ratio.
		const yP = -1/2*tri.white*s*ratio;
		const x = (y - yP)/sq3 + xP;
		pip.setAttribute('cx',x + margin);
	}

	if (COLOR.hsv.hue !== PREV.hsv.hue){
		const pure = pureFromHue(COLOR.hsv.hue);
		image.setAttribute('href', gen(pure));
	} 
}