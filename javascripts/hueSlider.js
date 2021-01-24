import mainColor from './ColorObject';
import conicGradient from './gradientGenerators/conicGradient';
import createSVG from './createSVG';
import c from './constants';


export default function hueSlider(target){ 

if (!target) target = document.body;
let RADIUS = 100;


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
});

const maskCircle = createSVG('circle',{
    fill: 'black',
});

const pattern = conicGradient({
    height: 400,
    width: 400,
})

mask.appendChild(maskBG);
mask.appendChild(maskCircle);
defs.appendChild(mask);
defs.appendChild(pattern);

const gBody = createSVG('g',{transform: `translate( ${marg/2} ${marg/2})`});

const gHue = createSVG('g',{});

const hueTrack = createSVG('circle',{
    fill: `url(#${pattern.id})`,
    mask: `url(#${mask.id})`,
});

const gPip = createSVG('g',{
    filter: `url(#shadow)`
});
const huePipH = 12;
const huePipW = 10;
const pipRect = createSVG('rect',{
    width: huePipW,
    height: huePipH,
    rx: 2,
    fill: 'transparent',
    'stroke-width': 2,
    stroke: 'white',
    'vector-effect': 'non-scaling-stroke'
});
gBody.appendChild(gHue);
gHue.appendChild(hueTrack);

gBody.appendChild(gPip);
gPip.appendChild(pipRect);

target.appendChild(svg);
svg.appendChild(defs);
svg.appendChild(gBody);

gPip.setAttribute('transform',`translate(${RADIUS} ${RADIUS})`);
pipRect.setAttribute('transform',`rotate(-90)translate(${-huePipW/2 + RADIUS -thickness/2} ${ -huePipH/2})`);


function resize(){ 
    const {height} = target.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${height} ${height}`);
    svg.setAttribute('height', height);
    RADIUS = (height - marg)/2;
    maskCircle.setAttribute('r', RADIUS-thickness);
    maskCircle.setAttribute('cx', RADIUS);
    maskCircle.setAttribute('cy', RADIUS);
    maskBG.setAttribute('height', RADIUS*2);
    maskBG.setAttribute('width', RADIUS*2);
    hueTrack.setAttribute('r', RADIUS);
    hueTrack.setAttribute('cx', RADIUS);
    hueTrack.setAttribute('cy', RADIUS);
}
resize();
window.addEventListener('resize', resize);


mainColor.subscribe((COLOR, PREV) => {
    if (COLOR.hsv.hue === PREV.hsv.hue) return;
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

		

		
		mainColor.set('hsv',{hue: angle/Math.PI*180 + 90});
		
		
		x = e.clientX;
		y = e.clientY;
		
	}
	
	document.addEventListener('mousemove', move);
	document.addEventListener('mouseup',()=>{
		document.removeEventListener('mousemove', move)
    },{once:true})
})
}