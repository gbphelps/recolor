import rgbFromHSV from './colorMethods/rgbFromHSV';
import hslFromRGB from './colorMethods/hslFromRGB';
import rgbFromHSL from './colorMethods/rgbFromHSL';
import hsvFromRGB from './colorMethods/hsvFromRGB';
import hsluvFromRGB from './colorMethods/hsluvFromRGB';
import rgbFromHSLUV from './colorMethods/rgbFromHSLUV';

function deepDup(obj){
    const newObj = {};
    Object.keys(obj).forEach(k => {
        newObj[k] = (typeof obj[k] === 'object') ?
        deepDup(obj[k]) :
        obj[k]
    })
    return newObj;
}

export class Color {
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
        const prev = deepDup(this.color);
        Object.assign(this.color.rgb, rgb);

        this.color.hsv = hsvFromRGB(this.color.rgb);
        this.color.hsl = hslFromRGB(this.color.rgb);
        this.color.hsluv = hsluvFromRGB(this.color.rgb);

		this.subscriptions.forEach(subscription => subscription(this.color, prev));
	}
	
	setHSV(hsvPartial){
        const prev = deepDup(this.color);
        Object.assign(this.color.hsv, hsvPartial);

        this.color.rgb = rgbFromHSV(this.color.hsv);
        this.color.hsl = hslFromRGB(this.color.rgb);
        this.color.hsluv = hsluvFromRGB(this.color.rgb);

		this.subscriptions.forEach(subscription => subscription(this.color, prev));
    }
    
    setHSL(hslPartial){
        const prev = deepDup(this.color);
        Object.assign(this.color.hsl, hslPartial);

        this.color.rgb = rgbFromHSL(this.color.hsl);
        this.color.hsv = hsvFromRGB(this.color.rgb);
        this.color.hsluv = hsluvFromRGB(this.color.rgb);

        this.subscriptions.forEach(subscription => subscription(this.color, prev));
    }

    setHSLUV(hsluvPartial){
        const prev = deepDup(this.color);
        Object.assign(this.color.hsluv, hsluvPartial);

        this.color.rgb = rgbFromHSLUV(this.color.hsluv);
        this.color.hsv = hsvFromRGB(this.color.rgb);
        this.color.hsl = hslFromRGB(this.color.rgb);

        this.subscriptions.forEach(subscription => subscription(this.color, prev));
    }
}

export default new Color();