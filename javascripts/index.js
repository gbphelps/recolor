

import rgbFromHSLUV from './colorMethods/rgbFromHSLUV';
import gradient from './nonlinearGradient';

import createSVG from './createSVG';
import makePattern from './makePattern';
import mainColor, { Color } from './ColorObject';
import makeHueSlider from './hueSlider';
import makeTriangle from './triangle';

import methods from './colorMethods/index';
import makeBlockWithSlider from './xySlider';
import makelightnessBlocks from './lightnessBlocks';
import hueSat from './hueSatCircle';


import './triangle.js'


document.addEventListener('DOMContentLoaded',()=>{
    setup();
})


function allEqualExcept(key, obj1, obj2){
    const keys = Object.keys(obj1 || {});
    if (Object.keys(obj2 || {}).length !== keys.length) return false;
    for (let i=0; i<keys.length; i++){
        if (key === keys[i]) continue;
        if (obj1[keys[i]] !== obj2[keys[i]]) return false;
    }
    return true;
}


function setup(){
    // hueSat();
    makeBlockWithSlider({
        xChannel: {
            name: 'hue',
            max: 360
        },
        yChannel: {
            name: 'saturation',
            max: 100,
        },
        zChannel: {
            name: 'lightness',
            max: 100
        },
        zInit: () => 50,
        colorSpace: 'hsl'
    });

    makeBlockWithSlider({
        xChannel: {
            name: 'saturation',
            max: 100,
        },
        yChannel: {
            name: 'value',
            max: 100
        },
        zChannel: {
            name: 'hue',
            max: 360
        },
        zInit: (color) => color.hsv.hue,
        colorSpace: 'hsv',
        height: 150,
        width: 150,
    });

    makeHueSlider();
    makeTriangle();
    makelightnessBlocks();

    buildChannels([
        {type: 'rgb', channel: 'red'},
        {type: 'rgb', channel: 'green'},
        {type: 'rgb', channel: 'blue'},
    ]);

    buildChannels([
        {type: 'cmyk', channel: 'cyan'},
        {type: 'cmyk', channel: 'magenta'},
        {type: 'cmyk', channel: 'yellow'},
        {type: 'cmyk', channel: 'black'},
    ]);
    // buildChannels([
    //     {type: 'hsv', channel: 'saturation'},
    //     {type: 'hsv', channel: 'value' },
    // ],{
    //     trackLength: 100, 
    //     trackThickness: 24, 
    //     orientation: 'vertical',
    //     margin: 8,
    //     pipWidth: 8
    // });
    
    // buildChannels([
    //     {type: 'hsl', channel: 'saturation'},
    //     {type: 'hsl', channel: 'lightness' },
    // ],{
    //     trackLength: 100, 
    //     trackThickness: 24, 
    //     orientation: 'vertical',
    //     margin: 8,
    //     pipWidth: 8
    // });

    // buildNonlinearChannels([
    //     {type: 'hsluv', channel: 'saturation'},
    //     {type: 'hsluv', channel: 'lightness'},
    // ],{
    //     trackLength: 100, 
    //     trackThickness: 24, 
    //     orientation: 'vertical',
    //     margin: 8,
    //     pipWidth: 8
    // })
    mainColor.set('rgb',{red: 50, green: 100, blue: 200 });
}










function buildChannels(channels, {
    trackLength = 300,
    trackThickness = 8,
    pipWidth = 12,
    orientation = 'horizontal',
    margin=24,
    outerMargin=24,
    spacing=4,
}={}){
    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style[orientation === 'horizontal' ? 'width' : 'height'] = trackLength + 2*outerMargin + 2*spacing;
    div.style[orientation === 'horizontal' ? 'height' : 'width'] = channels.length * trackThickness + (channels.length - 1)*margin + 2*outerMargin + 2*spacing;
    div.style.display = 'flex';
    div.style['justify-content'] = 'center';
    div.style['align-items'] = 'flex-start';
    div.style.margin = '20px'

    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');
    inputContainer.style.margin = spacing + 'px';

    document.body.appendChild(div);


    const container = createSVG('svg',{
        [orientation === 'horizontal' ? 'width' : 'height']: trackLength + 2*outerMargin,
        [orientation === 'horizontal' ? 'height' : 'width']: channels.length * trackThickness + (channels.length - 1)*margin + 2*outerMargin
    })
    container.style.margin=spacing;
    container.style.border="1px solid #555";
    container.style['border-radius']="2px";
    container.style.position="absolute";

    div.appendChild(container);
    div.appendChild(inputContainer);
 
    channels.forEach((param,i) => {    
        let maxValue;
        switch (param.type){
            case 'rgb':
                maxValue = 255;
                break;
            default:
                maxValue = 100;
        }


        const input = document.createElement('input');
        inputContainer.appendChild(input);
        
        mainColor.subscribe((COLOR, PREV) => {
            input.value = Math.round(COLOR[param.type][param.channel] * 10)/10;
        })

        input.addEventListener('input',e => {
            e.preventDefault();
            mainColor[`set${param.type.toUpperCase()}`](
                {[param.channel]: +e.target.value}
            )
        })

        const gradient = createSVG('linearGradient',{
            [orientation === 'horizontal' ? 'x1' : 'y1' ]: pipWidth/2 + outerMargin,
            [orientation === 'horizontal' ? 'x2' : 'y2' ]: trackLength-pipWidth/2 + outerMargin,
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
            [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + margin)*i + outerMargin,
            [ orientation === 'horizontal' ? 'x' : 'y']: outerMargin,
            rx: 2,
            fill: `url(#${gradient.id})`
        })

        const pip_ = createSVG('rect',{
            [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness + 2,
            [ orientation === 'horizontal' ? 'width' : 'height']: pipWidth,
            fill: 'transparent',
            [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + margin)*i - 1 + outerMargin,
            stroke: 'white',
            'stroke-width': 2,
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

        mainColor.subscribe((COLOR, PREV)=>{  
            if (
                COLOR[param.type][param.channel] !==
                PREV[param.type][param.channel]
            ) pip_.setAttribute(
                orientation === 'horizontal' ? 'x' : 'y',
                orientation === 'horizontal' ?
                    COLOR[param.type][param.channel]/maxValue*(trackLength-pipWidth) + outerMargin :
                    (1-COLOR[param.type][param.channel]/maxValue)*(trackLength-pipWidth) + outerMargin
            );		

            if (allEqualExcept(
                param.channel,
                COLOR[param.type],
                PREV[param.type],
            )) return;
            

            let left;
            let middle;
            let right;

            const base = COLOR[param.type]
            if (param.type !== 'rgb'){
                left = methods.getRGB[param.type]({...base, [param.channel]: 0 });
                right = methods.getRGB[param.type]({...base, [param.channel]: maxValue });
                middle = methods.getRGB[param.type]({...base, [param.channel]: maxValue/2});
            } else {
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
            mainColor.set(param.type,{[param.channel]: newVal});
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
    outerMargin = 24
}={}){
    const container = createSVG('svg',{
        [orientation === 'horizontal' ? 'width' : 'height']: trackLength + 2*outerMargin,
        [orientation === 'horizontal' ? 'height' : 'width']: channels.length * trackThickness + (channels.length - 1)*margin + 2*outerMargin
    })
    container.style.margin=4;
    container.style.border='1px solid #555';
    container.style['border-radius']='2px';

    channels.forEach((param,i) => {    
        let maxValue;
        switch (param.type){
            case 'rgb':
                maxValue = 255;
                break;
            default:
                maxValue = 100;
        }
       const grad = gradient({
           direction: orientation,
           width: 100,
           height: 10
        });
       const pattern = makePattern();

        const track_ = createSVG('rect',{
            [ orientation === 'horizontal' ? 'width' : 'height']: trackLength,
            [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness,
            [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + margin)*i + outerMargin,
            [ orientation === 'horizontal' ? 'x' : 'y']: outerMargin,
            rx: 2,
            fill: `url(#${pattern.id})`
        })

        const pip_ = createSVG('rect',{
            [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness + 2,
            [ orientation === 'horizontal' ? 'width' : 'height']: pipWidth,
            fill: 'transparent',
            [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + margin)*i - 1 + outerMargin,
            stroke: 'white',
            'stroke-width': 2,
            'vector-effect': 'non-scaling-stroke',
            filter: 'url(#shadow)',
            rx: 2
        })

        document.body.appendChild(container);
        container.appendChild(pattern);
        container.appendChild(track_);
        container.appendChild(pip_);

        mainColor.subscribe((COLOR,PREV)=>{  

        if (
            COLOR[param.type][param.channel] !==
            PREV[param.type][param.channel]
        ) pip_.setAttribute(
            orientation === 'horizontal' ? 'x' : 'y',
            orientation === 'horizontal' ?
                COLOR[param.type][param.channel]/maxValue*(trackLength-pipWidth) + outerMargin :
                (1-COLOR[param.type][param.channel]/maxValue)*(trackLength-pipWidth) + outerMargin
        );		
        
        if (allEqualExcept(
            param.channel,
            COLOR[param.type],
            PREV[param.type]
        )) return;

        const gradURL = grad.update({
            rgbFunc: rgbFromHSLUV,
            color: COLOR[param.type],
            channel: {
                name: param.channel,
                max: maxValue
            },
            direction: orientation,
        })

        pattern.firstElementChild.setAttribute('href',gradURL);
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

            mainColor.set(param.type,{[param.channel]: newVal})
            x = orientation === 'horizontal' ? e.clientX : e.clientY;
        }
        
        document.addEventListener('mousemove',move);
        document.addEventListener('mouseup',()=>{
            document.removeEventListener('mousemove',move);
        },{once:true})	
    })	
})
}