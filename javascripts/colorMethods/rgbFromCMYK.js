export default function(color){
    const {cyan, magenta, yellow, black} = color;
    const c = cyan/100;
    const m = magenta/100;
    const y = yellow/100;
    const k = black/100;
    return {
        red: (1-c)*(1-k)*255,
        green: (1-m)*(1-k)*255,
        blue: (1-y)*(1-k)*255
    }
}