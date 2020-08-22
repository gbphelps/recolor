import createSVG from './createSVG';
import mainColor from './ColorObject';
import allEqualExcept from './utils/allEqualExcept';
import methods from './colorMethods/index';



const paramLookup = {
    cyan: 'C',
    magenta: 'M',
    yellow: 'Y',
    black: 'K',
    red: 'R',
    green: 'G',
    blue: 'B'
}



export default function buildChannels(channels, {
    trackLength = 300,
    trackThickness = 8,
    pipWidth = 12,
    orientation = 'horizontal',
    margin = 24,
    outerMargin = 24,
    spacing = 0,
    recipient
}){

    const HH = outerMargin * 2 + margin * (channels.length-1) + trackThickness*(channels.length);
    const WW = outerMargin * 2 + trackLength;

    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style[orientation === 'horizontal' ? 'width' : 'height'] = trackLength + 2*outerMargin + 2*spacing;
    div.style[orientation === 'horizontal' ? 'height' : 'width'] = channels.length * trackThickness + (channels.length - 1)*margin + 2*outerMargin + 2*spacing;
    div.style.display = 'flex';
    div.style['justify-content'] = 'center';
    div.style['align-items'] = 'flex-start';


    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');
    inputContainer.style.margin = spacing + 'px';
    

    (recipient ? recipient : document.body).appendChild(div);


    const container = createSVG('svg',{
        [orientation === 'horizontal' ? 'width' : 'height']: trackLength + 2*outerMargin,
        [orientation === 'horizontal' ? 'height' : 'width']: channels.length * trackThickness + (channels.length - 1)*margin + 2*outerMargin
    })

    Object.assign(container.style, {
        marign: spacing,
        display: 'blcok',
        width: '300px',
        height: 'auto',
        flexShrink: '0'
    });

    container.setAttribute('viewBox', `0 0 ${WW} ${HH}`);

    div.appendChild(container);
    div.appendChild(inputContainer);

    let DIM_RATIO;
    function resetRatio(){
        DIM_RATIO = WW/container.getBoundingClientRect().width;
    }
    window.addEventListener('resize', resetRatio);
    resetRatio();
 
    channels.forEach((param,i) => {    
        let maxValue;
        switch (param.type){
            case 'rgb':
                maxValue = 255;
                break;
            default:
                maxValue = 100;
        }


        const input = document.createElement('input');
        input.style.display = 'block';


        // const label = document.createElement('label');
        // Object.assign(label.style, {
        //     userSelect: 'none'
        // })

        Object.assign(inputContainer.style, {
            userSelect: 'none',
            padding: `${Math.round(outerMargin/DIM_RATIO)}px 0`,
        })

        // label.innerHTML = paramLookup[param.channel];
        // inputContainer.appendChild(label);
        inputContainer.appendChild(input);
        let lastValid = 0;
        
        mainColor.subscribe((COLOR, PREV) => {
            lastValid = COLOR[param.type][param.channel];
            const value = Math.round(COLOR[param.type][param.channel] * 10)/10;
            if (document.activeElement !== input) input.value = value.toFixed(1);
        })

        input.addEventListener('input',e => {
            e.preventDefault();
            if (+input.value < 0 || +input.value > maxValue) return;
            mainColor.set(
                param.type,
                { [param.channel]: +input.value }
            )
        })

        input.addEventListener('blur',()=>{
            input.value = lastValid.toFixed(1)
        })

        const gradient = createSVG('linearGradient',{
            [orientation === 'horizontal' ? 'x1' : 'y1' ]: pipWidth/2 + outerMargin,
            [orientation === 'horizontal' ? 'x2' : 'y2' ]: trackLength-pipWidth/2 + outerMargin,
            [orientation === 'horizontal' ? 'y1' : 'x1' ]: 0,
            [orientation === 'horizontal' ? 'y2' : 'x2' ]: 0,
            gradientUnits: 'userSpaceOnUse',
        })

        const stop1 = createSVG('stop',{
            offset: 0,
            'stop-color': 'black', //TODO: initialize
        })

        const stop2 = createSVG('stop',{
            offset: .5,
            'stop-color': 'red', //TODO: initialize
        })

        const stop3 = createSVG('stop',{
            offset: 1,
            'stop-color': 'red', //TODO: initialize
        })

        const track_ = createSVG('rect',{
            [ orientation === 'horizontal' ? 'width' : 'height']: trackLength,
            [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness,
            [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + margin)*i + outerMargin,
            [ orientation === 'horizontal' ? 'x' : 'y']: outerMargin,
            rx: 2,
            fill: `url(#${gradient.id})`
        })

        const pip_ = createSVG('rect',{
            [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness + 2,
            [ orientation === 'horizontal' ? 'width' : 'height']: pipWidth,
            fill: 'transparent',
            [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + margin)*i - 1 + outerMargin,
            stroke: 'white',
            'stroke-width': 2,
            'vector-effect': 'non-scaling-stroke',
            filter: 'url(#shadow)',
            rx: 2
        })

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);

        container.appendChild(gradient);
        container.appendChild(track_);
        container.appendChild(pip_);

        mainColor.subscribe((COLOR, PREV)=>{  
            if (
                COLOR[param.type][param.channel] !==
                PREV[param.type][param.channel]
            ) pip_.setAttribute(
                orientation === 'horizontal' ? 'x' : 'y',
                orientation === 'horizontal' ?
                    COLOR[param.type][param.channel]/maxValue*(trackLength-pipWidth) + outerMargin :
                    (1-COLOR[param.type][param.channel]/maxValue)*(trackLength-pipWidth) + outerMargin
            );		

            if (allEqualExcept(
                param.channel,
                COLOR[param.type],
                PREV[param.type],
            )) return;
            

            let left;
            let middle;
            let right;

            const base = COLOR[param.type]
            if (param.type !== 'rgb'){
                left = methods.getRGB[param.type]({...base, [param.channel]: 0 });
                right = methods.getRGB[param.type]({...base, [param.channel]: maxValue });
                middle = methods.getRGB[param.type]({...base, [param.channel]: maxValue/2});
            } else {
                left = { ...base , [param.channel]: 0  }
                right = { ...base , [param.channel]: maxValue }
                middle = { ...base , [param.channel]: maxValue/2 }
            }

        const l = `rgb(${left.red},${left.green},${left.blue})`;
        const m = `rgb(${middle.red},${middle.green},${middle.blue})`;
        const r = `rgb(${right.red},${right.green},${right.blue})`;
        
        
        stop1.setAttribute('stop-color', orientation === "horizontal" ? l : r);
        stop2.setAttribute('stop-color', m);
        stop3.setAttribute('stop-color', orientation === "horizontal" ? r : l);
    })
    
    
    pip_.addEventListener('mousedown',e=>{
        let x = orientation === 'horizontal' ? e.clientX : e.clientY;
        let rawProgress = mainColor.color[param.type][param.channel];
        
        function move(e){
            const newX = orientation === 'horizontal' ? e.clientX : e.clientY;
            const delx = DIM_RATIO*(orientation === 'horizontal' ? newX - x : x - newX); //note need to scale if svg space is diff from user space;
            rawProgress += delx/(trackLength-pipWidth)*maxValue;
            
            let newVal = Math.min(rawProgress, maxValue);
            newVal = Math.max(newVal, 0);
            mainColor.set(param.type,{[param.channel]: newVal});
            x = orientation === 'horizontal' ? e.clientX : e.clientY;
        }
        
        document.addEventListener('mousemove',move);
        document.addEventListener('mouseup',()=>{
            document.removeEventListener('mousemove',move);
        },{once:true})	
    })	
})
}