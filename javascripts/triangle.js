import mainColor from './ColorObject';
import triFromRGB from './colorMethods/triFromRGB';
import createSVG from './createSVG';
import ns from './constants';
import triangleGradient from './gradientGenerators/triangleGradient';
import pureFromHue from './colorMethods/pureFromHue';

const sq3 = Math.sqrt(3);
let pip;
let l1;
let l2;
let l3;
let input1;
let input2;
let input3;
let xT;
let yT;

const ratio = sq3/2;
const margin = 10;
const s = 180;
const h = s * ratio;


const rectWidth = s + margin*2;
const rectHeight = Math.ceil(s*ratio + margin*2);

const pattern = new triangleGradient({
	width: rectWidth,
	height: rectHeight,
	side: s,
	margin,
})

export default function make(target){
	const container = document.createElement('div');
	Object.assign(container.style, {
		width: 	rectWidth + 'px',
		height: rectHeight + 'px'
	})

	const svg = createSVG('g',{});
	const body = createSVG('g',{});
	const defs = createSVG('defs',{});
	const clip = createSVG('clipPath',{});
	const clippath = createSVG('path',{});
	const r = createSVG('rect',{});

	l1 = createSVG('line',{
		stroke: 'white',
		'stroke-width': .5,
	});

	l2 = createSVG('line',{
		stroke: 'white',
		'stroke-width': .5,
	});

	l3 = createSVG('line',{
		stroke: 'white',
		'stroke-width': .5,
	});

	input1 = document.createElement('input');
	input1.addEventListener('input', setChannel('color'));
	input1.addEventListener('blur', setFromLastValid('color'));

	input2 = document.createElement('input');
	input2.addEventListener('input', setChannel('white'));
	input2.addEventListener('blur', setFromLastValid('white'));

	input3 = document.createElement('input');
	input3.addEventListener('input', setChannel('black'));
	input3.addEventListener('blur', setFromLastValid('black'));

	[input1, input2, input3].forEach(i => {
		Object.assign(i.style, {
			position: 'absolute', 
			margin: 0,
		})
	})

	input1.style.transform = `translateX(-100%)translateY(50%)`
	input2.style.transform = `translateY(100%)`

	target.appendChild(input1);
	target.appendChild(input2);
	target.appendChild(input3);


	ns.hueSlider.get().appendChild(svg);
	svg.appendChild(defs);
	svg.appendChild(body);
	defs.appendChild(pattern);
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

	r.setAttribute('height', rectHeight);
	r.setAttribute('width', rectWidth);
	r.setAttribute('clip-path', `url(#${clip.id})`);
	r.setAttribute('fill', `url(#${pattern.id})`);
	r.setAttribute('filter',"url(#shadow2)");
	const g = createSVG('g',{});
	body.appendChild(g);
	g.appendChild(r);




	const hueHeight = ns.hueSlider.get().getBoundingClientRect().height;
	xT = -s/2/sq3 - margin + hueHeight/2;
	yT = rectWidth + ( hueHeight - rectWidth)/2;


	body.setAttribute('transform', `
		translate(
			${xT} 
			${yT}
		)rotate(-90)`);

	pip = createSVG('circle',{});
	body.appendChild(l1);
	body.appendChild(l2);
	body.appendChild(l3);
	body.appendChild(pip);

	pip.setAttribute('r', 5);
	pip.setAttribute('cx', margin);
	pip.setAttribute('cy', margin);
	pip.setAttribute('stroke', 'white');
	pip.setAttribute('fill', 'transparent');
	pip.setAttribute('vector-effect','non-scaling-stroke')
	pip.setAttribute('filter','url(#shadow2)')


	let lastValidTri = null;

	mainColor.subscribe(setTriangle);
	mainColor.subscribe(COLOR => {
		lastValidTri = triFromRGB(COLOR.rgb);
	})

	function setFromLastValid(channel){
		return function (e) {
			e.target.value = Math.abs(lastValidTri[channel]*100).toFixed(1);
		}
	}

	pip.addEventListener('mousedown',setPip)
}

function setPip(e){
	let x = e.clientX;
	let y = e.clientY;
	
	const pure = pureFromHue(mainColor.color.hsv.hue%360);
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

		mainColor.set('rgb',newColor);

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
		const ym = y + margin;

		pip.setAttribute('cy', ym);
		const xP = sq3/2 * tri.white*s*ratio; 
		//find unit vector with slope perpindicular to sqrt(3), then multiply by s*ratio.
		//this gives a point that is the correct number of units away from the WHITE vertex.
		//Make a line with slope of sqrt(3) intersecting this point using the point-slope formula.
		//Find where this line intersects y = tri.color*s*ratio.
		const yP = -1/2*tri.white*s*ratio;
		const x = (y - yP)/sq3 + xP;
		const xm = x + margin;
		pip.setAttribute('cx',xm);

		l1.setAttribute('y2', ym);
		l1.setAttribute('x1', xm);
		l1.setAttribute('x2', xm);


		const mm1 = margin + 3 * margin/sq3;
		const xx1 = (sq3*(s + mm1) + 1/sq3*(xm) - ym)/(1/sq3 + sq3);
		const yy1 = -sq3*(xx1 - (s + mm1));

		const mm2 = margin - sq3*margin/2 - 3/2*margin/sq3;
		const xx2 = (1/sq3*xm + ym + sq3*mm2)/(1/sq3 + sq3);
		const yy2 = sq3*(xx2 - mm2);

		l2.setAttribute('x1', x + margin);
		l2.setAttribute('y1', y + margin);
		l2.setAttribute('x2', xx1);
		l2.setAttribute('y2', yy1);

		input3.style.left = yy1 + xT + 'px';
		input3.style.bottom = xx1 + yT - rectWidth + 'px';

		input2.style.left = yy2 + xT + 'px';
		input2.style.bottom = xx2 + yT - rectWidth + 'px';

		input1.style.left = 0 + xT + 'px';
		input1.style.bottom = xm + yT - rectWidth + 'px';

		if (document.activeElement !== input1) input1.value = Math.abs(tri.color * 100).toFixed(1);
		if (document.activeElement !== input2) input2.value = Math.abs(tri.white * 100).toFixed(1);
		if (document.activeElement !== input3) input3.value = Math.abs(tri.black * 100).toFixed(1);

		l3.setAttribute('x1', x + margin);
		l3.setAttribute('y1', y + margin);
		l3.setAttribute('x2', xx2);
		l3.setAttribute('y2',yy2);
	}
}


function setChannel(channel){
	return function (e){
		e.preventDefault();
		if (isNaN(+e.target.value) || +e.target.value > 100 || +e.target.value < 0) return;
		const tri = triFromRGB(mainColor.color.rgb);
		const newVal = +e.target.value;
		tri[channel] = 0;
		const denom = Object.values(tri).reduce((a,l)=> a + l, 0);
		const newTri = {
			white: (100 - newVal) * (denom ? tri.white/denom : 1),
			color: (100 - newVal) * (denom ? tri.color/denom : 1),
			black: (100 - newVal) * (denom ? tri.black/denom : 1),
		}
		newTri[channel] = newVal;

		const hue = mainColor.color.hsv.hue;
		const rgb = pureFromHue(hue%360);

		mainColor.set('rgb',{
			red: (rgb.red * newTri.color + 0 * newTri.black + 255 * newTri.white)/100,
			green: (rgb.green * newTri.color + 0 * newTri.black + 255 * newTri.white)/100,
			blue: (rgb.blue * newTri.color + 0 * newTri.black + 255 * newTri.white)/100,
		})
	}
}