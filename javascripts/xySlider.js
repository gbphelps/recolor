import rgbFromHSL from './colorMethods/rgbFromHSL';
import rgbFromHSLUV from './colorMethods/rgbFromHSLUV';
import createSVG from './createSVG';
import makePattern from './makePattern';
import mainColor from './ColorObject';
import convert from './colorMethods/index';


export default function({
    xChannel,
    yChannel,
    zChannel, 
    colorSpace, 
    height = 150,
    width = 250,
    trackWidth = 20,
    spaceBetween = 10,
    outerMargin = 20,
    target
}){
    if (!target) target = document.body;

    let DIM_RATIO;
    let lastValid;

    const WW = width + trackWidth + spaceBetween + outerMargin*2;
    const HH = outerMargin*2 + height;

    const margin = 0;
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    c.height = height;
    c.width = width;
    c.style.display = 'none';
    document.body.appendChild(c);

    const c2 = document.createElement('canvas');
    const ctx2 = c2.getContext('2d');
    c2.height = height;
    c2.width = 1;
    document.body.appendChild(c2);
    c2.style.display = 'none';

    function makeOtherGradient(){
        const img = ctx2.createImageData(10, height);
        for (let y=0; y<height; y++) {
            const param = (1-y/height) * zChannel.max;

            const color = convert.getRGB[colorSpace]({
                ...mainColor.color[colorSpace],
                [zChannel.name]: param,
            }) || {
                [zChannel.name]: 0,
                [xChannel.name]: 0,
                [yChannel.name]: 0,
            }

            for (let x=0; x<10; x++) {
                const pixel = y*10 + x;
                img.data[pixel*4] = color.red;
                img.data[pixel*4+1] = color.green;
                img.data[pixel*4+2] = color.blue;
                img.data[pixel*4+3] = 255;
            }
        }
        ctx2.putImageData(img,0,0);
        const url = c2.toDataURL();
        return url;
    }

    function makeGradient(){
        const img = ctx.createImageData(width, height);
        for (let x=0; x<width; x++){
            for (let y=0; y<height; y++){
    
                let xVal = (x-margin)/(width-2*margin)*xChannel.max;
                xVal = Math.min(xChannel.max,xVal);
                xVal = Math.max(0,xVal);
    
                let yVal = (1-(y-margin)/(height-2*margin))*yChannel.max;
                yVal = Math.min(yChannel.max, yVal);
                yVal = Math.max(0, yVal);
    
                const zVal = mainColor.color[colorSpace][zChannel.name];
                //NOTE: you may want to keep this stable at eg 50 or something.

                const {red, green, blue} = convert.getRGB[colorSpace]({
                    [xChannel.name]: xVal,
                    [yChannel.name]: yVal,
                    [zChannel.name]: zVal
                });
                img.data[(y*width + x)*4 +0] = red;
                img.data[(y*width + x)*4 +1] = green;
                img.data[(y*width + x)*4 +2] = blue;
                img.data[(y*width + x)*4 +3] = 255;
            }
        }
        ctx.putImageData(img,0,0);
        const url = c.toDataURL();
        return url;
    } 

    const svg = createSVG('svg',{
        'viewBox': `0 0 ${WW} ${HH}`
    });

    Object.assign(svg.style, {
        height: '192px',
        width: 'auto',
        display: 'block',
        flexShrink: 0,
    })
    
    
    const body = createSVG('g',{
        transform: `translate(${outerMargin} ${outerMargin})`
    });
    
    const pattern = makePattern();
    const image = pattern.getElementsByTagName('image')[0];
    image.setAttribute('href',makeGradient());
    const defs = createSVG('defs',{});

    const pattern2 = makePattern();
    const image2 = pattern2.getElementsByTagName('image')[0];
    image2.setAttribute('href',makeOtherGradient());



    const rect = createSVG('rect',{
        height: height,
        width: width,
        rx: margin,
        fill: `url(#${pattern.id})`
    })

    const pip = createSVG('circle',{
        r: 5,
        stroke: 'white',
        fill: 'transparent',
        filter: 'url(#shadow)'
    })

    const v = createSVG('line', {
        y1: 0,
        y2: height,
        stroke: 'white',
        'stroke-width': .5,
    });
    const inputX = document.createElement('input');
    Object.assign(inputX.style, {
        position: 'absolute',
        margin: 0,
        transform: 'translateX(-50%)',
        bottom: 0,
    })
    inputX.addEventListener('input', (e) => {
        e.preventDefault();
        if (isNaN(+inputX.value) || +inputX.value < 0 || +inputX.value > xChannel.max) return;
        mainColor.set(
            colorSpace,
            { [xChannel.name]: +inputX.value }
        )
    })
    inputX.addEventListener('blur', () => {
        inputX.value = lastValid.x.toFixed(1);
    })


    const h = createSVG('line', {
        x1: 0,
        x2: width,
        stroke: 'white',
        'stroke-width': .5,
    });
    const inputY = document.createElement('input');
    inputY.addEventListener('input', (e) => {
        e.preventDefault();
        if (isNaN(+inputY.value) || +inputY.value < 0 || +inputY.value > yChannel.max) return;
        mainColor.set(
            colorSpace,
            { [yChannel.name]: +inputY.value }
        )
    })
    inputY.addEventListener('blur', () => {
        inputY.value = lastValid.y.toFixed(1);
    })


    const inputZ = document.createElement('input');

    const pipWidth = 22;
    const pipHeight = 8;
    const sliderPip = createSVG('rect',{
        height: pipHeight,
        width: pipWidth,
        stroke: 'white',
        filter: 'url(#shadow)',
        x: width + spaceBetween + (trackWidth - pipWidth)/2,
        fill: 'transparent'
    })

    sliderPip.addEventListener('mousedown',(e)=>{
        let y = e.clientY;
        function move(e){
            const delY = (y - e.clientY)/(height-pipHeight)*zChannel.max*DIM_RATIO;
            const yAttempt = mainColor.color[colorSpace][zChannel.name] + delY;
            let newY = Math.min(zChannel.max, yAttempt);
            newY = Math.max(newY, 0);
            mainColor.set(colorSpace, {
                [zChannel.name]: newY,
            })
            if (newY === yAttempt) y = e.clientY;
        }
        document.addEventListener('mousemove',move);
        document.addEventListener('mouseup',()=>{
            document.removeEventListener('mousemove', move)
        },{once: true})
    })

    mainColor.subscribe((COLOR, PREV) => {
        const y = (1-(COLOR[colorSpace][zChannel.name]/zChannel.max))*(height - pipHeight);
        sliderPip.setAttribute('y',y);
    })

    const sliderTrack = createSVG('rect',{
        width: trackWidth,
        height: height,
        fill: `url(#${pattern2.id})`,
        x: width + spaceBetween,
    })

    body.appendChild(sliderTrack)
    body.appendChild(sliderPip)

    mainColor.subscribe((COLOR, PREV) => {
        lastValid = {
            x: COLOR[colorSpace][xChannel.name],
            y: COLOR[colorSpace][yChannel.name],
            z: COLOR[colorSpace][zChannel.name],
        }
        const xVal = COLOR[colorSpace][xChannel.name]/xChannel.max*width;
        const yVal = (1-COLOR[colorSpace][yChannel.name]/yChannel.max)*height;
        pip.setAttribute('cx',xVal);
        pip.setAttribute('cy',yVal);
        v.setAttribute('x1', xVal);
        v.setAttribute('x2', xVal);
        inputX.style.left = (xVal + outerMargin)/DIM_RATIO;
        if (document.activeElement !== inputX) inputX.value = COLOR[colorSpace][xChannel.name].toFixed(1);

        h.setAttribute('y1', yVal);
        h.setAttribute('y2', yVal);
        inputY.style.top = (yVal + outerMargin)/DIM_RATIO;
        if (document.activeElement !== inputY) inputY.value = COLOR[colorSpace][yChannel.name].toFixed(1);

        if (document.activeElement !== inputZ) inputZ.value = COLOR[colorSpace][zChannel.name].toFixed(1);

        if (COLOR[colorSpace][zChannel.name] !== PREV[colorSpace][zChannel.name]){
            //TODO if you add back zInit you need to replace here.
            image.setAttribute('href',makeGradient());
        }
        if (
            COLOR[colorSpace][xChannel.name] !== PREV[colorSpace][xChannel.name] ||
            COLOR[colorSpace][yChannel.name] !== PREV[colorSpace][yChannel.name]
        ){
             //TODO add similar safegaurds here.
            image2.setAttribute('href',makeOtherGradient());
        }
    })

    pip.addEventListener('mousedown',e => {
        let x = e.clientX;
        let y = e.clientY;
        function move(e){
            const delX = (e.clientX - x)/width * DIM_RATIO * xChannel.max;
            const delY = (y - e.clientY)/height * DIM_RATIO * yChannel.max;
            const rawY = mainColor.color[colorSpace][yChannel.name] + delY;
            const rawX = mainColor.color[colorSpace][xChannel.name] + delX;

            let nY = Math.max(rawY, 0);
            nY = Math.min(nY, yChannel.max);

            let nX = Math.max(rawX, 0);
            nX = Math.min(nX, xChannel.max);


            mainColor.set(colorSpace,{
                [xChannel.name]: nX,
                [yChannel.name]: nY,
            })

            if (nY === rawY) y = e.clientY; 
            //note: the conditional here prevents deltas from being erroneously registered when we're outside of the slider box.
            if (nX === rawX) x = e.clientX;      
        }
        document.addEventListener('mousemove',move);
        document.addEventListener('mouseup',() => {
            document.removeEventListener('mousemove',move)
        },{once: true})
    })

    

    const container = document.createElement('div');
    Object.assign(container.style, {
        position: 'relative'
    })

    target.appendChild(container);
    container.appendChild(svg);
    container.appendChild(inputX);
    container.appendChild(inputY);
    container.appendChild(inputZ);
    svg.appendChild(defs);
    svg.appendChild(body);
    body.appendChild(rect);
    body.appendChild(v);
    body.appendChild(h);
    body.appendChild(pip);
    defs.appendChild(pattern);
    defs.appendChild(pattern2);

    function setRatio(){
        DIM_RATIO = HH/svg.getBoundingClientRect().height;
    }
    setRatio();
    window.addEventListener('resize', setRatio);

    Object.assign(inputZ.style, {
        position: 'absolute',
        margin: 0,
        right: (outerMargin +trackWidth/2)/DIM_RATIO,
        top: '10px',
        transform: 'translateX(50%)translateY(-100%)'
    })
    inputZ.addEventListener('input', (e) => {
        e.preventDefault();
        if (isNaN(+inputZ.value) || +inputZ.value < 0 || +inputZ.value > zChannel.max) return;
        mainColor.set(
            colorSpace,
            { [zChannel.name]: +inputZ.value }
        )
    })
    inputZ.addEventListener('blur', () => {
        inputZ.value = lastValid.z.toFixed(1);
    })

    Object.assign(inputY.style, {
        position: 'absolute',
        margin: 0,
        left: outerMargin/DIM_RATIO,
        transform: 'translateY(-50%)translateX(-100%)'
    })


}