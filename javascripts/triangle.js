


function make(){

const ratio = Math.sqrt(3)/2;
const margin = 7;
const padding = 5;
const s = 150;

const c = document.createElement('canvas');
c.width = s + margin*2;
c.height = s*ratio + margin*2;

const h = s * ratio;

const ctx = c.getContext('2d');
const img = ctx.createImageData(c.width, c.height);


const black = [0,0,0,255];
const white = [255,255,255,255];

function gen(color){

for (let i=0; i<img.data.length/4; i++){
	let x = i%c.width;
	let y = Math.floor(i/c.width);
	
	x -= (c.width-s)/2;
	y -= (c.height-h)/2;

	
	const top = y/h;
	const left = (x*Math.sqrt(3) - y)/h/2;
	const right = ((x-s)*-Math.sqrt(3) -y)/h/2;

	
	
	if (y <= 0){
		for(let j=0; j<4; j++) img.data[i*4+j] = x/s*white[j] + (1-x/s)*black[j]
	}
	
	if (x > s/2 && y > 0){
		const w = Math.min((-(x-s)/2 + ratio*y)/s,1);
		for(let j=0; j<4; j++) img.data[i*4+j] = (1-w)*white[j] + w*color[j]
	}
	
	if (x <= s/2 && y > 0){
		const w = Math.min((x/2 + ratio*y)/s,1);
		for(let j=0; j<4; j++) img.data[i*4+j] = (1-w)*black[j] + w*color[j]
	}
			
	if (y < Math.sqrt(3)*x && y < (x-s)*-Math.sqrt(3) && y > 0){
		for(let j=0; j<4; j++) img.data[i*4+j] = top*color[j] + left*white[j] + right*black[j]
	}
	
}

	ctx.putImageData(img,0,0);
	return c.toDataURL();
}


const url = gen([255,0,0,255])





const image = document.getElementById('image');
image.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",url);

const clippath = document.getElementById('clippath');

clippath.setAttribute('d',`
	M ${margin} 0 
	l ${s} 0 
	a ${margin} ${margin} 0 0 1 ${margin*Math.sin(Math.PI/3)} ${margin + margin*Math.cos(Math.PI/3)}
	l ${-s/2} ${s*ratio} 
	a ${margin} ${margin} 0 0 1 ${-margin*2*Math.sin(Math.PI/3)} 0
	l ${-s/2} ${-s*ratio}
	A ${margin} ${margin} 0 0 1 ${margin} 0
`)


console.log(c.width, c.height)

const r = document.getElementById('triangle-rect');
r.setAttribute('height', c.height);
r.setAttribute('width', c.width);
r.setAttribute('clip-path', 'url(#clip)');
r.setAttribute('fill', 'url(#p)');

const svgHeight = c.height;
const svg = document.getElementById('triangle');
svg.setAttribute('height', svgHeight);

svg.setAttribute('viewBox', `${-padding} ${-padding} ${c.width + 2*padding} ${c.height + 2*padding}`);

svg.style.transform=`translateY(${c.width/c.height*svgHeight}px)rotate(-90deg)`
svg.style['transform-origin']=`0 0`;


const pip = document.getElementById('triangle-pip');
pip.setAttribute('r', 5);
pip.setAttribute('cx', margin);
pip.setAttribute('cy', margin);
pip.setAttribute('stroke', 'white');
pip.setAttribute('fill', 'transparent');
pip.setAttribute('vector-effect','non-scaling-stroke')

pip.addEventListener('mousedown',e=>{
	let x = e.clientX;
	let y = e.clientY;
	
	function move(e){
		dely = (e.clientX - x) * c.height/svgHeight;
		delx = -(e.clientY - y) * c.height/svgHeight;
		
		let xAttempt = pip.cx.baseVal.value + delx;
		let yAttempt = pip.cy.baseVal.value + dely;
		
		if (yAttempt-margin > s*ratio ){
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
			
		pip.setAttribute('cx', xAttempt);
		pip.setAttribute('cy', yAttempt);
		pip.setAttribute('filter', 'url(#shadow)')
		
		
		x = e.clientX;
		y = e.clientY;
	}
	
	document.addEventListener('mousemove',move);
	document.addEventListener('mouseup',()=>{
		document.removeEventListener('mousemove',move)
	},{once:true})
})
}


document.addEventListener("DOMContentLoaded",make);
