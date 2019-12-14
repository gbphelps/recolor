

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
import buildChannels from './sliderSet';
import hueSat from './hueSatCircle';
import allEqualExcept from './utils/allEqualExcept';


import './triangle.js'


document.addEventListener('DOMContentLoaded',()=>{
    setup();
})





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
    makelightnessBlocks('hsl', {name: 'lightness', max: 100});
    makelightnessBlocks('hsl', {name: 'saturation', max: 100});


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