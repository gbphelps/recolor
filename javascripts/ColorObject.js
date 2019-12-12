import converter from './colorMethods/index';

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
                red: -1,
                green: -1,
                blue: -1,
            },

            hsv: {
                hue: -1,
                saturation: -1,
                value: -1,
            },

            hsl:{
                hue: -1,
                saturation: -1,
                lightness: -1,
            },

            hsluv:{
                hue: -1,
                saturation: -1,
                lightness: -1
            },

            cmyk:{
                cyan: -1,
                magenta: -1,
                yellow: -1,
                black: -1
            }
        }
        this.subscriptions = [];
    }
	
	subscribe(callback){
		this.subscriptions.push(callback);
	}
    
    set(colorSpace, partial){
        if (isEqualPartial(partial,this.color[colorSpace])) return;
        const prev = deepDup(this.color);
        Object.assign(this.color[colorSpace], partial);
        this.color.rgb = colorSpace === 'rgb' ? 
            this.color.rgb : 
            converter.getRGB[colorSpace](this.color[colorSpace]);

        const spaces = Object.keys(this.color);
        spaces.forEach(space => {
            if (space === 'rgb' || space === colorSpace) return;
            this.color[space] = patchError(
                converter.fromRGB[space](this.color.rgb),
                this.color[space]
            )
        })
        this.subscriptions.forEach(subscription => subscription(this.color, prev));
    }
}

export default new Color();