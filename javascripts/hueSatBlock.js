import rgbFromHSL from './colorMethods/rgbFromHSL'
export default function(){
    const c = document.createElement('canvas');
    c.height = 100;
    c.width = 200;
    c.style.background = 'black';
    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(c.width, c.height);
    for (let x=0; x<c.width; x++){
        for (let y=0; y<c.height; y++){
            const hue = (x/c.width)*360;
            const saturation = (1-y/c.height)*100;
            const lightness = 50;
            const {red, green, blue} = rgbFromHSL({hue, saturation, lightness});
            img.data[(y*c.width + x)*4 +0] = red;
            img.data[(y*c.width + x)*4 +1] = green;
            img.data[(y*c.width + x)*4 +2] = blue;
            img.data[(y*c.width + x)*4 +3] = 255;
        }
    }
    ctx.putImageData(img,0,0);
}