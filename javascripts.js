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
	
	subscribe = (callback) => {
		this.subscriptions.push(callback);
	}
	
	setRGB(rgb){
        Object.assign(this.color, rgb);
        const {red,green,blue} = this.color;
        const {max, min} = extrema({red,green,blue});
        
        const saturation = this.color[max] === 0 ? 0 : (1-this.color[min]/this.color[max]) * 100;
        const value = this.color[max]/255 * 100;
        const hue = hueFromRGB({red, green, blue});
			

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

function setup(){
    hueSlider();

    set('rgb-svg',{
        viewBox: `0 0 300 300`,//`0 0 ${width + 2*margin} ${height + 2* margin}`,
        height: '300' //height + 2*margin
    });
     
    function buildChannels(channels, startHeight){
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
            
            
        set(channel,{
            width: width,
            height: trackH,
            y: (trackH + 25)*i + startHeight,
            rx: 2
        })
        
        set(`${channel}-pip`,{
            height: trackH + 2,
            width: pipW,
            fill: 'transparent',
            y: (trackH + 25)*i - 1 + startHeight,
            stroke: 'white',
            'stroke-width': 3,
            'vector-effect': 'non-scaling-stroke',
            filter: 'url(#shadow)',
            rx: 2
        })
        
        set(`${channel}-gradient`,{
            x1:pipW/2,
            x2:width-pipW/2
        })
    
        
        const pip = document.getElementById(`${channel}-pip`);
        
        mainColor.subscribe(COLOR=>{
            const grad = document.getElementById(`${channel}-gradient`);
            const stops = grad.getElementsByTagName('stop');
            
            
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
            
            
            
            stops[0].setAttribute('stop-color', l);		
            stops[1].setAttribute('stop-color', r);
            pip.setAttribute('x', COLOR[channel]/maxValue*(width-pipW));		
        })
        
        
        pip.addEventListener('mousedown',e=>{
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
    
    
    buildChannels(['red','green','blue'], 0, 'rgb');
    buildChannels(['saturation', 'value'], 90, 'hsv');
}



function extrema(obj){
	let max = null;
	let min = null;
	Object.keys(obj).forEach(channel => {
		if (!min) min = channel;
		if (!max) max = channel;
		if (obj[channel] < obj[min]) min = channel;
		if (obj[channel] > obj[max]) max = channel;
	});
	return {max, min};
}

function hueFromRGB(rgb){
	const { max, min } = extrema(rgb);
	const c = rgb[max] - rgb[min];
	let hue = null
	if (max === 'red'){
		hue = ((rgb.green - rgb.blue)/c + 6)%6
	} else if (max === 'green') {
		hue = (rgb.blue - rgb.red)/c + 2;
	} else if (max === 'blue'){
		hue = (rgb.red - rgb.green)/c + 4;
	}
	
	return hue/6 * 360;
}

function rgbFromHSV(hsv){
	let max, min, mid;
	if ((hsv.hue + 60)%360 <= 120){
		max = 'red';
		[min, mid] = hsv.hue <= 60 ? ['blue', 'green'] : ['green', 'blue'];	
	} else if (hsv.hue <= 180) {
		max = 'green';
		[min, mid] = hsv.hue <= 120 ? ['blue', 'red'] : ['red', 'blue'] 
	} else {
		max = 'blue';
		[min, mid] = hsv.hue <= 240 ? ['red', 'green'] : ['green', 'red']
	}
	
	let progress = (hsv.hue%60) / 60;
	if (Math.floor(hsv.hue/60)%2 === 1){
		progress = 1 - progress
	};
	
	
	const maxval = 255/100 * hsv.value;
	const minval = (100 - hsv.saturation) * maxval / 100;
	const midval = minval + (maxval - minval)*progress;
	
	return {
		[max]: maxval,
		[min]: minval,
		[mid]: midval,
	}
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

    const RADIUS = 150;
    const thickness = 10;

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
		
		const xnew = Math.cos((Color.value.hue - 90)/180*Math.PI)*(RADIUS-thickness/2) + delx;
		const ynew = Math.sin((Color.value.hue - 90)/180*Math.PI)*(RADIUS-thickness/2) + dely;
		
		
		
		let angle = Math.atan(ynew/xnew);
		if (xnew < 0) angle = Math.PI + angle;

		

		
		Color.setHSV({hue: angle/Math.PI*180 + 90});
		
		
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