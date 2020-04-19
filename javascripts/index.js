

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
        colorSpace: 'hsl',
        height: 150,
        width: 350,
        target: document.getElementById('block-sliders')
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
        colorSpace: 'hsv',
        height: 150,
        width: 150,
        target: document.getElementById('block-sliders')
    });

    makeHueSlider(document.getElementById('main'));
    makeTriangle();
   
    buildChannels([
        {type: 'rgb', channel: 'red'},
        {type: 'rgb', channel: 'green'},
        {type: 'rgb', channel: 'blue'},
    ],{
        recipient: document.getElementById('rgb-cmyk')
    });

    buildChannels([
        {type: 'cmyk', channel: 'cyan'},
        {type: 'cmyk', channel: 'magenta'},
        {type: 'cmyk', channel: 'yellow'},
        {type: 'cmyk', channel: 'black'},
    ], {
        recipient: document.getElementById('rgb-cmyk')
    });

    makelightnessBlocks('hsl', {name: 'lightness', max: 100});
    makelightnessBlocks('hsl', {name: 'saturation', max: 100});

    mainColor.set('rgb',{red: 50, green: 100, blue: 200 });
}


