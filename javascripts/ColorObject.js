import rgbFromHSV from './colorMethods/rgbFromHSV';
import hslFromRGB from './colorMethods/hslFromRGB';
import rgbFromHSL from './colorMethods/rgbFromHSL';
import hsvFromRGB from './colorMethods/hsvFromRGB';
import hsluvFromRGB from './colorMethods/hsluvFromRGB';
import rgbFromHSLUV from './colorMethods/rgbFromHSLUV';
import cmykFromRGB from './colorMethods/cmykFromRGB';
import rgbFromCMYK from './colorMethods/rgbFromCMYK';


//todo you can easily clean this up by making an object of colormethods

function deepDup(obj){
    const newObj = {};
    Object.keys(obj).forEach(k => {
        newObj[k] = (typeof obj[k] === 'object') ?
        deepDup(obj[k]) :
        obj[k]
    })
    return newObj;
}

function isEqualPartial(partial,obj){
    const keys = Object.keys(partial || {});
    for (let i=0; i<keys.length; i++){
        if (partial[keys[i]] !== obj[keys[i]]) return false;
    }
    return true;
}

function patchError(obj, prev){
    const keys = Object.keys(obj);
    for (let i=0; i<keys.length; i++){
        if (
            obj[keys[i]] === Infinity ||
            obj[keys[i]] === -Infinity ||
            Number.isNaN(obj[keys[i]])
        ) obj[keys[i]] = prev[keys[i]]
    }
    return obj;
}

function patchHSLUV(obj, prev){
    //todo: add checks for maxes, not just mins
    if (obj.saturation < 1e-8){
        obj.hue = prev.hue;
    }
    if (obj.lightness < 1e-8 || Math.abs(obj.lightness - 100) < 1e-8){
        obj.hue = prev.hue;
        obj.saturation = prev.saturation;
    } 
    return obj;
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
            },

            cmyk:{
                cyan: 0,
                magenta: 0,
                yellow: 0,
                black: 0
            }
        }
        this.subscriptions = [];
    }
	
	subscribe(callback){
		this.subscriptions.push(callback);
	}
	
	setRGB(rgbPartial){
        if (isEqualPartial(rgbPartial, this.color.rgb)) return;
        const prev = deepDup(this.color);
        Object.assign(this.color.rgb, rgbPartial);

        this.color.hsv = patchError(
            hsvFromRGB(this.color.rgb), 
            this.color.hsv
        );

        this.color.hsl = patchError(
            hslFromRGB(this.color.rgb), 
            this.color.hsl
        );

        this.color.hsluv = patchHSLUV(
            hsluvFromRGB(this.color.rgb),
            this.color.hsluv
        )

		this.subscriptions.forEach(subscription => subscription(this.color, prev));
	}
	
	setHSV(hsvPartial){
        if (isEqualPartial(hsvPartial, this.color.hsv)) return;
        const prev = deepDup(this.color);
        Object.assign(this.color.hsv, hsvPartial);

        this.color.rgb = patchError(
            rgbFromHSV(this.color.hsv), 
            this.color.rgb
        );

        this.color.hsl = patchError(
            hslFromRGB(this.color.rgb), 
            this.color.hsl
        );

        this.color.hsluv = patchHSLUV(
            hsluvFromRGB(this.color.rgb),
            this.color.hsluv
        )

        this.color.cmyk = cmykFromRGB(this.color.rgb);

		this.subscriptions.forEach(subscription => subscription(this.color, prev));
    }
    
    setHSL(hslPartial){
        console.log(this.color.cmyk, this.color.rgb)
        if (isEqualPartial(hslPartial, this.color.hsl)) return;
        const prev = deepDup(this.color);
        Object.assign(this.color.hsl, hslPartial);

        this.color.rgb = patchError(
            rgbFromHSL(this.color.hsl), 
            this.color.rgb
        );

        this.color.hsv = patchError(
            hsvFromRGB(this.color.rgb), 
            this.color.hsv
        );

        this.color.hsluv = patchHSLUV(
            hsluvFromRGB(this.color.rgb),
            this.color.hsluv
        )

        this.color.cmyk = cmykFromRGB(this.color.rgb);

        this.subscriptions.forEach(subscription => subscription(this.color, prev));
    }

    setHSLUV(hsluvPartial){
        if (isEqualPartial(hsluvPartial, this.color.hsluv)) return;
        const prev = deepDup(this.color);
        Object.assign(this.color.hsluv, hsluvPartial);

        this.color.rgb = rgbFromHSLUV(this.color.hsluv); 
        // todo need a patch to identify hue of this slider (maybe run extra conversion with lightness set to 50, then grab hue from there?)
        this.color.hsv = patchError(
            hsvFromRGB(this.color.rgb),
            this.color.hsv
        );

        this.color.hsl = patchError(
            hslFromRGB(this.color.rgb),
            this.color.hsl
        );

        this.color.cmyk = cmykFromRGB(this.color.rgb);

        this.subscriptions.forEach(subscription => subscription(this.color, prev));
    }

    setCMYK(cmykPartial){
        if (isEqualPartial(cmykPartial, this.color.cmyk)) return; 
        const prev = deepDup(this.color);
        Object.assign(this.color.cmyk, cmykPartial);
        this.color.rgb = rgbFromCMYK(this.color.cmyk);

        this.color.hsv = patchError(
            hsvFromRGB(this.color.rgb),
            this.color.hsv
        );

        this.color.hsl = patchError(
            hslFromRGB(this.color.rgb),
            this.color.hsl
        );

        this.color.hsluv = patchHSLUV(
            hsluvFromRGB(this.color.rgb),
            this.color.hsluv
        )

        this.subscriptions.forEach(subscription => subscription(this.color, prev));
    }
}

export default new Color();