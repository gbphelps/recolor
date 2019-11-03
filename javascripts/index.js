import rgbFromHSV from './colorMethods/rgbFromHSV';
import hueFromRGB from './colorMethods/hueFromRGB';
import extrema from './utils/extrema';

document.addEventListener('DOMContentLoaded',()=>{
    setup();
})


class Color{
    constructor(){
        this.color = {
            red: 0,
            green: 0,
            blue: 0,
            
            hue: 0,
            saturation: 100,
            value: 0,
        }

        this.subscriptions = [];
    }
	
	subscribe(callback){
		this.subscriptions.push(callback);
	}
	
	setRGB(rgb){
        Object.assign(this.color, rgb);
        const {red,green,blue} = this.color;
        const {max, min} = extrema({red,green,blue});
        
        const saturation = this.color[max] === 0 ? 0 : (1-this.color[min]/this.color[max]) * 100;
        const value = this.color[max]/255 * 100;
        const hue = hueFromRGB({red, green, blue});
		console.log(hue)	

		Object.assign(this.color,{hue, saturation, value})
		console.log(this.color)
		this.subscriptions.forEach(subscription => subscription(this.color));
	}
	
	setHSV(channelObject){
		Object.assign(this.color,channelObject);
		const {hue, saturation, value} = this.color;
		
		const newRGB = rgbFromHSV({hue, saturation, value});
		Object.assign(this.color, newRGB);
		
		this.subscriptions.forEach(subscription => subscription(this.color));
	}
}




const mainColor = new Color();
console.log(mainColor)







const margin = 10;
const width = 300;
const height = 100;
const trackH = 8;
const pipW = 12;


function set(id,props){
		const el = document.getElementById(id);
		Object.keys(props).forEach(key => {
			el.setAttribute(key, props[key])
		})
}


function createSVG(type,props){
    const el = document.createElementNS('http://www.w3.org/2000/svg', type);
    el.id = createSVG.id++;
    Object.keys(props).forEach(key => {
        el.setAttribute(key,props[key]);
    })
    return el;
}
createSVG.id = 0;

function setup(){
    hueSlider();
    
    function buildChannels(channels, startHeight){
        const container = createSVG('svg',{
            height,
            width,
        })
        document.body.appendChild(container);
        channels.forEach((channel,i) => {    
            let maxValue, type;
            switch (channel){
                case 'red':
                case 'green':
                case 'blue':
                    maxValue = 255;
                    type = 'rgb';
                    break;
                default:
                    maxValue = 100;
                    type = 'hsv';
            }

            const gradient = createSVG('linearGradient',{
                x1:pipW/2,
                x2:width-pipW/2,
                gradientUnits: 'userSpaceOnUse',
            })

            const stop1 = createSVG('stop',{
                offset: 0,
                'stop-color': 'black',
            })

            const stop2 = createSVG('stop',{
                offset: 1,
                'stop-color': 'red',
            })

            const track_ = createSVG('rect',{
                width,
                height: trackH,
                y: (trackH + 25)*i,
                rx: 2,
                fill: `url(#${gradient.id})`
            })
    
            const pip_ = createSVG('rect',{
                height: trackH + 2,
                width: pipW,
                fill: 'transparent',
                y: (trackH + 25)*i - 1,
                stroke: 'white',
                'stroke-width': 3,
                'vector-effect': 'non-scaling-stroke',
                filter: 'url(#shadow)',
                rx: 2
            })
 
            gradient.appendChild(stop1);
            gradient.appendChild(stop2);
            container.appendChild(gradient);
            container.appendChild(track_);
            container.appendChild(pip_);
    
            mainColor.subscribe(COLOR=>{  
                let left;
                let right;

                if (type === 'hsv'){
                    const base = {
                        hue: COLOR.hue, 
                        saturation: COLOR.saturation, 
                        value: COLOR.value, 
                    }

                    left = new Color();
                    left.setHSV({ ...base, [channel]: 0 });
                    left = { 
                        red: left.color.red, 
                        green: left.color.green, 
                        blue: left.color.blue 
                    }

                    right = new Color();
                    right.setHSV({ ...base, [channel]: maxValue });
                    right = {
                        red: right.color.red,
                        green: right.color.green,
                        blue: right.color.blue
                    }
                } else {
                    const base = { 
                        red: COLOR.red, 
                        green: COLOR.green, 
                        blue: COLOR.blue 
                    }
                    left = { ...base , [channel]: 0  }
                    right = { ...base , [channel]: maxValue }
                }
            
            
            const l = `rgb(${left.red},${left.green},${left.blue})`;
            
            const r = `rgb(${right.red},${right.green},${right.blue})`;
            
            
            stop1.setAttribute('stop-color', l);
            stop2.setAttribute('stop-color', r);
            pip_.setAttribute('x',COLOR[channel]/maxValue*(width-pipW));		
        })
        
        
        pip_.addEventListener('mousedown',e=>{
            let x = e.clientX;
            let rawProgress = mainColor.color[channel];
            
            function move(e){
                const delx = e.clientX - x; //note need to scale if svg space is diff from user space;
                rawProgress += delx/(width-pipW)*maxValue;
                
                let newVal = Math.min(rawProgress, maxValue);
                newVal = Math.max(newVal, 0);
            
                const setter = `set${type.toUpperCase()}`;
                mainColor[setter]({[channel]: newVal});
                x = e.clientX;
            }
            
            document.addEventListener('mousemove',move);
            document.addEventListener('mouseup',()=>{
                document.removeEventListener('mousemove',move);
            },{once:true})	
        })	
    })
    }
    buildChannels.counter = 0;
    
    buildChannels(['red','green','blue'], 0, 'rgb');
    buildChannels(['saturation', 'value'], 90, 'hsv');
}




























//Build Conic Gradient 

function conicGradient(){
	const c = document.getElementById('c');

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


///////////////////////////////////////////////////

//Set Up Hue Slider

function hueSlider(){
    document
	    .getElementById('conic-gradient')
        .setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',conicGradient());

    const RADIUS = 100;
    const thickness = 8;

function set(id,props){
	const el = document.getElementById(id);
	Object.keys(props).forEach(key => {
		el.setAttribute(key, props[key])
	})
}

set('hue-svg',{ viewBox: `0 0 ${RADIUS*2 + 20} ${RADIUS*2 + 20}`, height: RADIUS*2 });
set('conic-gradient',{ height: 2*RADIUS });
set('inner-circle',{r: RADIUS- thickness, cx: RADIUS, cy: RADIUS});
set('conic-gradient-pattern',{viewBox: `0 0 ${RADIUS*2} ${RADIUS*2}`});
set('mask-background',{height: RADIUS*2, width: RADIUS*2});
set('hue-track',{r: RADIUS, cx: RADIUS, cy: RADIUS})

const huePip = document.getElementById('hue-pip');
const huePipH = huePip.height.baseVal.value;
const huePipW = huePip.width.baseVal.value;

const pc = document.getElementById('pc');
pc.setAttribute('transform',`translate(${RADIUS} ${RADIUS})`);
huePip.setAttribute('transform',`rotate(-90)translate(${-huePipW/2 + RADIUS -thickness/2} ${ -huePipH/2})`)







mainColor.subscribe(COLOR => {
	huePip.setAttribute('transform', `rotate(${COLOR.hue - 90})translate(${-huePipW/2 + RADIUS -thickness/2} ${ -huePipH/2})`)
})

huePip.addEventListener('mousedown',e=>{
	
	let [x,y] = [e.clientX, e.clientY];
	function move(e){
					
		const delx = e.clientX - x; //note that this needs scaling if svg space is diff from user space
		const dely = e.clientY - y;
		
		const xnew = Math.cos((mainColor.color.hue - 90)/180*Math.PI)*(RADIUS-thickness/2) + delx;
		const ynew = Math.sin((mainColor.color.hue - 90)/180*Math.PI)*(RADIUS-thickness/2) + dely;
		
		
		
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



/////////////////////////////////////////////