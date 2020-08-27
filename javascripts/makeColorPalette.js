import mainColor from './ColorObject';
import namedColors from './namedColors';





function hexFromRGB(rgb) {
    const color = [
        Math.round(rgb.red).toString(16).split('.')[0],
        Math.round(rgb.green).toString(16).split('.')[0],
        Math.round(rgb.blue).toString(16).split('.')[0]
    ];
    const zeros = '00';
    const result = '#' + color.map(color => zeros.slice(color.length) + color).join('');
    return result;
}

const channels = ['red','green','blue'];

function closestNamedColor(color){
    let best = null;
    const denom = 255 * Math.sqrt(3);

    Object.keys(namedColors).forEach(k => {
        let squareSum = 0;
        for (let i=0; i<3; i++){
            const channel = parseInt(namedColors[k].slice(i*2+1, i*2+3),16);
            const channel2 = color[channels[i]];
            squareSum += (channel - channel2)**2;
        }
        if (!best || best.distance > squareSum){
            best = {
                color: k,
                distance: squareSum
            }
        }
    })
    return {
        color: best.color,
        distance: (1 - Math.sqrt(best.distance)/denom)*100,
    };
}


export default function makeColorPalette({target}) {
    const currentColor = document.createElement('div');
    currentColor.classList.add('current-color');
    target.appendChild(currentColor);
    mainColor.subscribe(COLOR => {
       const hexColor = hexFromRGB(COLOR.rgb);
       const closest = closestNamedColor(COLOR.rgb);
       currentColor.style.background = hexColor;
       currentColor.innerHTML = hexColor;
       currentColor.innerHTML = `<div>${closest.color.toUpperCase()}</div><div>${closest.distance.toFixed()}% match</div>`;

    })
}