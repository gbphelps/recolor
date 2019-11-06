import rgbFromHSV from './colorMethods/rgbFromHSV';
import hslFromRGB from './colorMethods/hslFromRGB';
import rgbFromHSL from './colorMethods/rgbFromHSL';
import hsvFromRGB from './colorMethods/hsvFromRGB';
import hsluvFromRGB from './colorMethods/hsluvFromRGB';

import rgbFromHSLUV from './colorMethods/rgbFromHSLUV';
import makeGradient from './nonlinearGradient';

import createSVG from './createSVG';
import makePattern from './makePattern';


document.addEventListener('DOMContentLoaded',()=>{
    setup();
    const grad = makeGradient({
        color: {
            hue: 0, 
            saturation: 100, 
            lightness: 50
        }, 
        channel: {
            name: 'saturation',
            max: 100
        },
        rgbFunc: rgbFromHSLUV,
        direction: 'vertical'
    });
    const s = createSVG('svg',{
        height: 200,
        width: 100,
        viewBox: `0 0 100 200`
    });
    document.body.appendChild(s);
    const p = makePattern();
    s.appendChild(p);
    p.firstElementChild.setAttribute('href',grad);

    const r = createSVG('rect',{
        height: 100,
        width: 20,
        fill: `url(#${p.id})`,
        rx: 2,
    })
    s.appendChild(r);
})


class Color{
    constructor(){
        this.color = {
            rgb: {
                red: 0,
                green: 0,
                blue: 0,
            },

            hsv: {
                hue: 0,
                saturation: 100,
                value: 0,
            },

            hsl:{
                hue: 0,
                saturation: 0,
                lightness: 0,
            },

            hsluv:{
                hue: 0,
                saturation: 0,
                lightness: 0
            }

        }
        this.subscriptions = [];
    }
	
	subscribe(callback){
		this.subscriptions.push(callback);
	}
	
	setRGB(rgb){
        Object.assign(this.color.rgb, rgb);

        this.color.hsv = hsvFromRGB(this.color.rgb);
        this.color.hsl = hslFromRGB(this.color.rgb);
        this.color.hsluv = hsluvFromRGB(this.color.rgb);

		this.subscriptions.forEach(subscription => subscription(this.color));
	}
	
	setHSV(hsvPartial){
        Object.assign(this.color.hsv, hsvPartial);

        this.color.rgb = rgbFromHSV(this.color.hsv);
        this.color.hsl = hslFromRGB(this.color.rgb);
        this.color.hsluv = hsluvFromRGB(this.color.rgb);

		this.subscriptions.forEach(subscription => subscription(this.color));
    }
    
    setHSL(hslPartial){
        Object.assign(this.color.hsl, hslPartial);

        this.color.rgb = rgbFromHSL(this.color.hsl);
        this.color.hsv = hsvFromRGB(this.color.rgb);
        this.color.hsluv = hsluvFromRGB(this.color.rgb);

        this.subscriptions.forEach(subscription => subscription(this.color));
    }

    setHSLUV(hsluvPartial){
        Object.assign(this.color.hsluv, hsluvPartial);

        this.color.rgb = rgbFromHSLUV(this.color.hsluv);
        this.color.hsv = hsvFromRGB(this.color.rgb);
        this.color.hsl = hslFromRGB(this.color.rgb);

        this.subscriptions.forEach(subscription => subscription(this.color));
    }
}




const mainColor = new Color();







const width = 300;
const height = 100;




function setup(){
    hueSlider();
    buildChannels([
        {type: 'rgb', channel: 'red'},
        {type: 'rgb', channel: 'green'},
        {type: 'rgb', channel: 'blue'},
    ]);
    buildChannels([
        {type: 'hsv', channel: 'saturation'},
        {type: 'hsv', channel: 'value' },
    ],{
        trackLength: 100, 
        trackThickness: 24, 
        orientation: 'vertical',
        margin: 8,
        pipWidth: 8
    });
    
    buildChannels([
        {type: 'hsl', channel: 'saturation'},
        {type: 'hsl', channel: 'lightness' },
    ],{
        trackLength: 100, 
        trackThickness: 24, 
        orientation: 'vertical',
        margin: 8,
        pipWidth: 8
    });

    buildNonlinearChannels([
        {type: 'hsluv', channel: 'saturation'},
        {type: 'hsluv', channel: 'lightness'},
    ],{
        trackLength: 100, 
        trackThickness: 24, 
        orientation: 'vertical',
        margin: 8,
        pipWidth: 8
    })
    mainColor.setRGB({red: 50, green: 100, blue: 200 });
}










function buildChannels(channels, {
    trackLength = 300,
    trackThickness = 8,
    pipWidth = 12,
    orientation = 'horizontal',
    margin = 24,
}={}){
    const container = createSVG('svg',{
        [orientation === 'horizontal' ? 'width' : 'height']: trackLength,
        [orientation === 'horizontal' ? 'height' : 'width']: channels.length * trackThickness + (channels.length - 1)*margin
    })
    container.style.margin=4;

    document.body.appendChild(container);
    channels.forEach((param,i) => {    
        let maxValue;
        switch (param.type){
            case 'rgb':
                maxValue = 255;
                break;
            default:
                maxValue = 100;
        }

        const gradient = createSVG('linearGradient',{
            [orientation === 'horizontal' ? 'x1' : 'y1' ]: pipWidth/2,
            [orientation === 'horizontal' ? 'x2' : 'y2' ]: trackLength-pipWidth/2,
            [orientation === 'horizontal' ? 'y1' : 'x1' ]: 0,
            [orientation === 'horizontal' ? 'y2' : 'x2' ]: 0,
            gradientUnits: 'userSpaceOnUse',
        })

        const stop1 = createSVG('stop',{
            offset: 0,
            'stop-color': 'black', //TODO: initialize
        })

        const stop2 = createSVG('stop',{
            offset: .5,
            'stop-color': 'red', //TODO: initialize
        })

        const stop3 = createSVG('stop',{
            offset: 1,
            'stop-color': 'red', //TODO: initialize
        })

        const track_ = createSVG('rect',{
            [ orientation === 'horizontal' ? 'width' : 'height']: trackLength,
            [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness,
            [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + margin)*i,
            rx: 2,
            fill: `url(#${gradient.id})`
        })

        const pip_ = createSVG('rect',{
            [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness + 2,
            [ orientation === 'horizontal' ? 'width' : 'height']: pipWidth,
            fill: 'transparent',
            [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + margin)*i - 1,
            stroke: 'white',
            'stroke-width': 3,
            'vector-effect': 'non-scaling-stroke',
            filter: 'url(#shadow)',
            rx: 2
        })

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);

        container.appendChild(gradient);
        container.appendChild(track_);
        container.appendChild(pip_);

        mainColor.subscribe(COLOR=>{  
            let left;
            let middle;
            let right;

            if (param.type !== 'rgb'){
                const base = COLOR[param.type];

                left = new Color();
                const setter = `set${param.type.toUpperCase()}`;
                left[setter]({ ...base, [param.channel]: 0 });
                left = left.color.rgb;

                right = new Color();
                right[setter]({ ...base, [param.channel]: maxValue });
                right = right.color.rgb;

                middle = new Color();
                middle[setter]({...base, [param.channel]: maxValue/2 });
                middle = middle.color.rgb;

            } else {
                const base = COLOR.rgb;
                left = { ...base , [param.channel]: 0  }
                right = { ...base , [param.channel]: maxValue }
                middle = { ...base , [param.channel]: maxValue/2 }
            }

        const l = `rgb(${left.red},${left.green},${left.blue})`;
        const m = `rgb(${middle.red},${middle.green},${middle.blue})`;
        const r = `rgb(${right.red},${right.green},${right.blue})`;
        
        
        stop1.setAttribute('stop-color', orientation === "horizontal" ? l : r);
        stop2.setAttribute('stop-color', m);
        stop3.setAttribute('stop-color', orientation === "horizontal" ? r : l);
       
        pip_.setAttribute(
            orientation === 'horizontal' ? 'x' : 'y',
            orientation === 'horizontal' ?
                COLOR[param.type][param.channel]/maxValue*(trackLength-pipWidth) :
                (1-COLOR[param.type][param.channel]/maxValue)*(trackLength-pipWidth)
        );		
    })
    
    
    pip_.addEventListener('mousedown',e=>{
        let x = orientation === 'horizontal' ? e.clientX : e.clientY;
        let rawProgress = mainColor.color[param.type][param.channel];
        
        function move(e){
            const newX = orientation === 'horizontal' ? e.clientX : e.clientY;
            const delx = orientation === 'horizontal' ? newX - x : x - newX; //note need to scale if svg space is diff from user space;
            rawProgress += delx/(trackLength-pipWidth)*maxValue;
            
            let newVal = Math.min(rawProgress, maxValue);
            newVal = Math.max(newVal, 0);
        
            const setter = `set${param.type.toUpperCase()}`;
            mainColor[setter]({[param.channel]: newVal});
            x = orientation === 'horizontal' ? e.clientX : e.clientY;
        }
        
        document.addEventListener('mousemove',move);
        document.addEventListener('mouseup',()=>{
            document.removeEventListener('mousemove',move);
        },{once:true})	
    })	
})
}




function buildNonlinearChannels(channels, {
    trackLength = 300,
    trackThickness = 8,
    pipWidth = 12,
    orientation = 'horizontal',
    margin = 24,
}={}){
    const container = createSVG('svg',{
        [orientation === 'horizontal' ? 'width' : 'height']: trackLength,
        [orientation === 'horizontal' ? 'height' : 'width']: channels.length * trackThickness + (channels.length - 1)*margin
    })
    container.style.margin=4;

    channels.forEach((param,i) => {    
        let maxValue;
        switch (param.type){
            case 'rgb':
                maxValue = 255;
                break;
            default:
                maxValue = 100;
        }

       const pattern = makePattern();

        const track_ = createSVG('rect',{
            [ orientation === 'horizontal' ? 'width' : 'height']: trackLength,
            [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness,
            [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + margin)*i,
            rx: 2,
            fill: `url(#${pattern.id})`
        })

        const pip_ = createSVG('rect',{
            [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness + 2,
            [ orientation === 'horizontal' ? 'width' : 'height']: pipWidth,
            fill: 'transparent',
            [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + margin)*i - 1,
            stroke: 'white',
            'stroke-width': 3,
            'vector-effect': 'non-scaling-stroke',
            filter: 'url(#shadow)',
            rx: 2
        })

        document.body.appendChild(container);
        container.appendChild(pattern);
        container.appendChild(track_);
        container.appendChild(pip_);

        mainColor.subscribe(COLOR=>{  
        
        const grad = makeGradient({
            rgbFunc: rgbFromHSLUV,
            color: COLOR[param.type],
            channel: {
                name: param.channel,
                max: maxValue
            },
            direction: orientation,
            width: 100,
            height: 10
        })

        pattern.firstElementChild.setAttribute('href',grad);
       
        pip_.setAttribute(
            orientation === 'horizontal' ? 'x' : 'y',
            orientation === 'horizontal' ?
                COLOR[param.type][param.channel]/maxValue*(trackLength-pipWidth) :
                (1-COLOR[param.type][param.channel]/maxValue)*(trackLength-pipWidth)
        );		
    })
    
    
    pip_.addEventListener('mousedown',e=>{
        let x = orientation === 'horizontal' ? e.clientX : e.clientY;
        let rawProgress = mainColor.color[param.type][param.channel];
        
        function move(e){
            const newX = orientation === 'horizontal' ? e.clientX : e.clientY;
            const delx = orientation === 'horizontal' ? newX - x : x - newX; //note need to scale if svg space is diff from user space;
            rawProgress += delx/(trackLength-pipWidth)*maxValue;
            
            let newVal = Math.min(rawProgress, maxValue);
            newVal = Math.max(newVal, 0);
        
            const setter = `set${param.type.toUpperCase()}`;
            mainColor[setter]({[param.channel]: newVal});
            x = orientation === 'horizontal' ? e.clientX : e.clientY;
        }
        
        document.addEventListener('mousemove',move);
        document.addEventListener('mouseup',()=>{
            document.removeEventListener('mousemove',move);
        },{once:true})	
    })	
})
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
	huePip.setAttribute('transform', `rotate(${COLOR.hsv.hue - 90})translate(${-huePipW/2 + RADIUS -thickness/2} ${ -huePipH/2})`)
})

huePip.addEventListener('mousedown',e=>{
	
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



/////////////////////////////////////////////