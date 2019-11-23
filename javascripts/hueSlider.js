import mainColor from './ColorObject';
import conicGradient from './conicGradient';
import createSVG from './createSVG';
import c from './constants';


export default function hueSlider(){ 

    const RADIUS = c.hueSlider.radius;
    const thickness = c.hueSlider.trackThickness;
    const marg = c.hueSlider.svgMargin;


const svg = createSVG('svg',{
    viewBox: `0 0 ${RADIUS*2 + marg} ${RADIUS*2 + marg}`, 
    height: RADIUS*2 + marg
});

c.hueSlider.set(svg);

const defs = createSVG('defs', {});
const mask = createSVG('mask',{});

const maskBG = createSVG('rect',{
    fill: 'white',
    height: RADIUS*2, 
    width: RADIUS*2,
});

const maskCircle = createSVG('circle',{
    fill: 'black',
    r: RADIUS- thickness, 
    cx: RADIUS, 
    cy: RADIUS
});

mask.appendChild(maskBG);
mask.appendChild(maskCircle);
defs.appendChild(mask);

const pattern = createSVG('pattern',{
    width: '100%', 
    height: '100%',
    viewBox: `0 0 ${RADIUS*2} ${RADIUS*2}`,
});

const gradientImage = createSVG('image', { 
    height: 2*RADIUS,
    href: conicGradient()
});

defs.appendChild(pattern);
pattern.appendChild(gradientImage);

const gBody = createSVG('g',{transform: `translate( ${marg/2} ${marg/2})`});
const hueTrack = createSVG('circle',{
    fill: `url(#${pattern.id})`,
    mask: `url(#${mask.id})`,
    r: RADIUS,
    cx: RADIUS, 
    cy: RADIUS,
});

const gPip = createSVG('g',{
    filter: `url(#shadow)`
});
const huePipH = 12;
const huePipW = 10;
const pipRect = createSVG('rect',{
    width: huePipW,
    height: huePipH,
    rx: 0,
    fill: 'transparent',
    'stroke-width': 2,
    stroke: 'white',
    'vector-effect': 'non-scaling-stroke'
});
gBody.appendChild(hueTrack);
gBody.appendChild(gPip);
gPip.appendChild(pipRect);

document.body.appendChild(svg);
svg.appendChild(defs);
svg.appendChild(gBody);

gPip.setAttribute('transform',`translate(${RADIUS} ${RADIUS})`);
pipRect.setAttribute('transform',`rotate(-90)translate(${-huePipW/2 + RADIUS -thickness/2} ${ -huePipH/2})`)


mainColor.subscribe(COLOR => {
	pipRect.setAttribute('transform', `rotate(${COLOR.hsv.hue - 90})translate(${-huePipW/2 + RADIUS -thickness/2} ${ -huePipH/2})`)
})

pipRect.addEventListener('mousedown',e=>{
	
	let [x,y] = [e.clientX, e.clientY];
	function move(e){
					
		const delx = e.clientX - x; //note that this needs scaling if svg space is diff from user space
		const dely = e.clientY - y;
		
		const xnew = Math.cos((mainColor.color.hsv.hue - 90)/180*Math.PI)*(RADIUS-thickness/2) + delx;
		const ynew = Math.sin((mainColor.color.hsv.hue - 90)/180*Math.PI)*(RADIUS-thickness/2) + dely;
		
		
		
		let angle = Math.atan(ynew/xnew);
		if (xnew < 0) angle = Math.PI + angle;

		

		
		mainColor.setHSV({hue: angle/Math.PI*180 + 90});
		
		
		x = e.clientX;
		y = e.clientY;
		
	}
	
	document.addEventListener('mousemove', move);
	document.addEventListener('mouseup',()=>{
		document.removeEventListener('mousemove', move)
	},{once:true})
})
}