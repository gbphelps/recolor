import createSVG from './createSVG';
import makePattern from './makePattern';
import mainColor from './ColorObject';
import {CHAN_MAX} from './colorMathConstants';
import XYGradient from './gradientGenerators/xyGradient';
import LinearGradient from './gradientGenerators/linearGradient';

const SLIDER_PIP_WIDTH = 22;
const SLIDER_PIP_HEIGHT = 8;
const XY_SLIDER_PADDING = 0;

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
    const xMax = CHAN_MAX[colorSpace][xChannel];
    const yMax = CHAN_MAX[colorSpace][yChannel];
    const zMax = CHAN_MAX[colorSpace][zChannel];

    if (!target) target = document.body;

    let DIM_RATIO;
    let lastValid;

    const SVG_WIDTH = width + trackWidth + spaceBetween + outerMargin*2;
    const SVG_HEIGHT = outerMargin*2 + height;




    const pattern = makePattern();
    const image = pattern.getElementsByTagName('image')[0];
    const defs = createSVG('defs',{});
    const xySVG = createSVG('rect',{
        height: height,
        width: width,
        rx: XY_SLIDER_PADDING,
        fill: `url(#${pattern.id})`
    })
    const xyGradient = new XYGradient({
        height,
        width,
        padding: XY_SLIDER_PADDING,
        colorSpace,
        xChannel,
        yChannel,
        zChannel,
    })

    const svg = createSVG('svg',{
        'viewBox': `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`
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

    const pattern2 = makePattern();
    const image2 = pattern2.getElementsByTagName('image')[0];
    const linearGradient = new LinearGradient({
        height,
        width: 1,
        colorSpace,
        channel: zChannel,
        padding: SLIDER_PIP_HEIGHT/2,
    });

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
        if (isNaN(+inputX.value) || +inputX.value < 0 || +inputX.value > xMax) return;
        mainColor.set(
            colorSpace,
            { [xChannel]: +inputX.value }
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
        if (isNaN(+inputY.value) || +inputY.value < 0 || +inputY.value > yMax) return;
        mainColor.set(
            colorSpace,
            { [yChannel]: +inputY.value }
        )
    })
    inputY.addEventListener('blur', () => {
        inputY.value = lastValid.y.toFixed(1);
    })


    const inputZ = document.createElement('input');

    const sliderPip = createSVG('rect',{
        height: SLIDER_PIP_HEIGHT,
        width: SLIDER_PIP_WIDTH,
        stroke: 'white',
        filter: 'url(#shadow)',
        x: width + spaceBetween + (trackWidth - SLIDER_PIP_WIDTH)/2,
        fill: 'transparent'
    })

    sliderPip.addEventListener('mousedown',(e)=>{
        let y = e.clientY;
        function move(e){
            const delY = (y - e.clientY)/(height-SLIDER_PIP_HEIGHT)*zMax*DIM_RATIO;
            const yAttempt = mainColor.color[colorSpace][zChannel] + delY;
            let newY = Math.min(zMax, yAttempt);
            newY = Math.max(newY, 0);
            mainColor.set(colorSpace, {
                [zChannel]: newY,
            })
            if (newY === yAttempt) y = e.clientY;
        }
        document.addEventListener('mousemove',move);
        document.addEventListener('mouseup',()=>{
            document.removeEventListener('mousemove', move)
        },{once: true})
    })

    mainColor.subscribe((COLOR, PREV) => {
        const y = (1-(COLOR[colorSpace][zChannel]/zMax))*(height - SLIDER_PIP_HEIGHT);
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
            x: COLOR[colorSpace][xChannel],
            y: COLOR[colorSpace][yChannel],
            z: COLOR[colorSpace][zChannel],
        }

        const xVal = COLOR[colorSpace][xChannel]/xMax*(width - XY_SLIDER_PADDING*2) + XY_SLIDER_PADDING;
        const yVal = (1-COLOR[colorSpace][yChannel]/yMax)*(height - XY_SLIDER_PADDING*2) + XY_SLIDER_PADDING;

        pip.setAttribute('cx',xVal);
        pip.setAttribute('cy',yVal);
        v.setAttribute('x1', xVal);
        v.setAttribute('x2', xVal);
        inputX.style.left = (xVal + outerMargin)/DIM_RATIO;
        if (document.activeElement !== inputX) inputX.value = COLOR[colorSpace][xChannel].toFixed(1);

        h.setAttribute('y1', yVal);
        h.setAttribute('y2', yVal);
        inputY.style.top = (yVal + outerMargin)/DIM_RATIO;
        if (document.activeElement !== inputY) inputY.value = COLOR[colorSpace][yChannel].toFixed(1);

        if (document.activeElement !== inputZ) inputZ.value = COLOR[colorSpace][zChannel].toFixed(1);

        if (COLOR[colorSpace][zChannel] !== PREV[colorSpace][zChannel]){
            image.setAttribute('href',xyGradient.generate(COLOR));
        }
        if (
            COLOR[colorSpace][xChannel] !== PREV[colorSpace][xChannel] ||
            COLOR[colorSpace][yChannel] !== PREV[colorSpace][yChannel]
        ){
          const gradient = linearGradient.generate(COLOR);
          image2.setAttribute('href', gradient);
        }
    })

    pip.addEventListener('mousedown',e => {
        let x = e.clientX;
        let y = e.clientY;
        function move(e){
            const delX = (e.clientX - x)/(width - 2*XY_SLIDER_PADDING) * DIM_RATIO * xMax;
            const delY = (y - e.clientY)/(height - 2*XY_SLIDER_PADDING) * DIM_RATIO * yMax;
            const rawY = mainColor.color[colorSpace][yChannel] + delY;
            const rawX = mainColor.color[colorSpace][xChannel] + delX;

            let nY = Math.max(rawY, 0);
            nY = Math.min(nY, yMax);

            let nX = Math.max(rawX, 0);
            nX = Math.min(nX, xMax);


            mainColor.set(colorSpace,{
                [xChannel]: nX,
                [yChannel]: nY,
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
    body.appendChild(xySVG);
    body.appendChild(v);
    body.appendChild(h);
    body.appendChild(pip);
    defs.appendChild(pattern);
    defs.appendChild(pattern2);

    function setRatio(){
        DIM_RATIO = SVG_HEIGHT/svg.getBoundingClientRect().height;
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
        if (isNaN(+inputZ.value) || +inputZ.value < 0 || +inputZ.value > zMax) return;
        mainColor.set(
            colorSpace,
            { [zChannel]: +inputZ.value }
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