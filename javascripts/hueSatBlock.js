import rgbFromHSL from './colorMethods/rgbFromHSL';
import rgbFromHSLUV from './colorMethods/rgbFromHSLUV';
import createSVG from './createSVG';
import makePattern from './makePattern';

export default function(){
    const c = document.createElement('canvas');
    c.height = 150;
    c.width = 250;
    c.style.display = "none";
    const margin = 2;

    document.body.appendChild(c);
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(c.width, c.height);
    for (let x=0; x<c.width; x++){
        for (let y=0; y<c.height; y++){

            let hue = (x-margin)/(c.width-2*margin)*360;
            hue = Math.min(360,hue);
            hue = Math.max(0,hue);

            let saturation = (1-(y-margin)/(c.height-2*margin))*100;
            saturation = Math.min(100, saturation);
            saturation = Math.max(0, saturation);

            const lightness = 50;
            const {red, green, blue} = rgbFromHSL({hue, saturation, lightness});
            img.data[(y*c.width + x)*4 +0] = red;
            img.data[(y*c.width + x)*4 +1] = green;
            img.data[(y*c.width + x)*4 +2] = blue;
            img.data[(y*c.width + x)*4 +3] = 255;
        }
    }
    ctx.putImageData(img,0,0);

    const outerMargin = 20;
    const svg = createSVG('svg',{
        height: c.height + 2*outerMargin,
        width: c.width + 2*outerMargin,
    });
    svg.style.border = '1px solid #555';
    svg.style.margin = '4px';
    
    const body = createSVG('g',{
        transform: `translate(${outerMargin} ${outerMargin})`
    });
    
    const pattern = makePattern();
    const image = pattern.getElementsByTagName('image')[0];
    image.setAttribute('href',c.toDataURL());
    const defs = createSVG('defs',{});

    const rect = createSVG('rect',{
        height: c.height,
        width: c.width,
        rx: margin,
        fill: `url(#${pattern.id})`
    })

    document.body.appendChild(svg);
    svg.appendChild(defs);
    svg.appendChild(body);
    body.appendChild(rect);
    defs.appendChild(pattern);
}