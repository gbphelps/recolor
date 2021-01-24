import mainColor from './ColorObject';
import makeHueSlider from './hueSlider';
import makeTriangle from './triangle';

import makeBlockWithSlider from './xySlider';
import makelightnessBlocks from './lightnessBlocks';
import buildChannels from './sliderSet';
import makeColorPalette from './makeColorPalette';

document.addEventListener('DOMContentLoaded', () => {
  setup();
});

function setup() {
  // makeBlockWithSlider({
  //     xChannel: 'hue',
  //     yChannel: 'saturation',
  //     zChannel: 'lightness',
  //     colorSpace: 'hsl',
  //     height: 150,
  //     width: 350,
  //     target: document.getElementById('block-sliders')
  // });

  // makeBlockWithSlider({
  //     xChannel: 'saturation',
  //     yChannel: 'value',
  //     zChannel: 'hue',
  //     colorSpace: 'hsv',
  //     height: 150,
  //     width: 150,
  //     target: document.getElementById('block-sliders')
  // });

  makeHueSlider(document.getElementById('main'));
  makeTriangle(document.getElementById('main'));

  // buildChannels([
  //     {type: 'rgb', channel: 'red'},
  //     {type: 'rgb', channel: 'green'},
  //     {type: 'rgb', channel: 'blue'},
  // ],{
  //     recipient: document.getElementById('rgb-cmyk')
  // });

  // buildChannels([
  //     {type: 'cmyk', channel: 'cyan'},
  //     {type: 'cmyk', channel: 'magenta'},
  //     {type: 'cmyk', channel: 'yellow'},
  //     {type: 'cmyk', channel: 'black'},
  // ], {
  //     recipient: document.getElementById('rgb-cmyk')
  // });

  // makelightnessBlocks('hsl', {name: 'lightness', max: 100}, document.getElementById('lightness-blocks'));
  // makelightnessBlocks('hsl', {name: 'saturation', max: 100}, document.getElementById('lightness-blocks'));

  // makeColorPalette({ target: document.getElementById('color-palette') });

  mainColor.set('rgb', { red: 50, green: 100, blue: 200 });
}
