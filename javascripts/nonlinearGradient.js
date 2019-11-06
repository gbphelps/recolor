export default function makeGradient({
    rgbFunc, 
    color, 
    channel, 
    direction = 'horizontal',
    width = 300,
    height = 100
}){
    const canvas = document.createElement('canvas');
    canvas.width = direction === "horizontal" ? width : height;
    canvas.height = direction === "horizontal" ? height : width;
    const ctx = canvas.getContext('2d');
    const img = ctx.createImageData(
        direction === "horizontal" ? width : height,
        direction === "horizontal" ? height : width,
    );
    for (let x=0; x<width; x++){
        const xFrac = direction === "horizontal" ? x/width : 1 - x/width;
        const rgb = rgbFunc({...color, [channel.name]: channel.max * xFrac});
        for (let y=0; y<height; y++){
            const i = direction === "horizontal" ? x + y*width : x*height + y;
            img.data[i*4] = rgb.red;
            img.data[i*4+1] = rgb.green;
            img.data[i*4+2] = rgb.blue;
            img.data[i*4+3] = 255;
        }
    }
    document.body.appendChild(canvas);
    ctx.putImageData(img,0,0);
    const result = canvas.toDataURL();
    document.body.removeChild(canvas);
    return result;
}