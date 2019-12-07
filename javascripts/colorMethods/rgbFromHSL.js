
export default function rgbFromHSL(hsl){
    const C = (1 - Math.abs(2*hsl.lightness/100 - 1))*hsl.saturation/100;
    const H = hsl.hue/60;
    const X = C * (1 - Math.abs(H%2-1));
    const m = hsl.lightness/100 - C/2;
    switch (Math.floor(H)){
        case 6:
        case 0:
            return {
                red: 255*(C + m),
                green: 255*(X + m),
                blue: 255*m
            }
        case 1:
            return {
                red: 255*(X + m),
                green: 255*(C + m),
                blue: 255*m
            }
        case 2:
            return {
                red: 255*m,
                green: 255*(C + m),
                blue: 255*(X + m)
            }
        case 3:
            return {
                red: 255*m,
                green: 255*(X + m),
                blue: 255*(C + m),
            }
        case 4:
            return {
                red: 255*(X + m),
                green: 255*m,
                blue: 255*(C + m),
            }
        case 5:
            return {
                red: 255*(C + m),
                green: 255*m,
                blue: 255*(X + m),
            }
    }
}