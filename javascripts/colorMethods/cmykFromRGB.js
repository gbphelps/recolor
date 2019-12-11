import extrema from '../utils/extrema'

export default function(color){
    const {red, green, blue} = color;
    const r = red/255;
    const g = green/255;
    const b = blue/255;
    const k = (255 - color[extrema(color).max])/255;
    return {
        cyan: (1-r-k)/(1-k)*100,
        magenta: (1-g-k)/(1-k)*100,
        yellow: (1-b-k)/(1-k)*100,
        black: k*100
    }
}