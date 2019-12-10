


export default function gradient({
    direction, 
    width, 
    height
}){  
    const canvas = document.createElement('canvas');
    canvas.width = direction === "horizontal" ? width : height;
    canvas.height = direction === "horizontal" ? height : width;
    canvas.style.display = 'none';
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    //note: having the canvas as a closure allows us to avoid modifying the dom over and over
    
    function update({
        rgbFunc, 
        color, 
        channel, 
        direction = 'horizontal',
    }){
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
        
        ctx.putImageData(img,0,0);
        const result = canvas.toDataURL();
        return result;
    }

    return { update };
}