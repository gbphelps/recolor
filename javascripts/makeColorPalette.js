import mainColor from './ColorObject';


function hexFromRGB(rgb) {
    const color = [
        Math.round(rgb.red).toString(16).split('.')[0],
        Math.round(rgb.green).toString(16).split('.')[0],
        Math.round(rgb.blue).toString(16).split('.')[0]
    ];
    console.log(color);
    const zeros = '00';
    const result = '#' + color.map(color => zeros.slice(color.length) + color).join('');
    console.log(result);
    return result;
}

export default function makeColorPalette({target}) {
    const currentColor = document.createElement('div');
    currentColor.classList.add('current-color');
    target.appendChild(currentColor);
    mainColor.subscribe(COLOR => {
       currentColor.style.background = hexFromRGB(COLOR.rgb);
    })
}