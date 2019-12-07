import mainColor from './ColorObject';
import createSVG from './createSVG';
import rgbFromHSL from './colorMethods/rgbFromHSL';


export default function (){
    const H = 100;
    const W = 600;
    const N = 20;
    const m = 1;
    const w = (W-(m*(N-1)))/N;
    const outerMargin = 20;

    const svg = createSVG('svg',{
        height: H + outerMargin*2,
        width: W + outerMargin*2,
    })
    
    const body = createSVG('g',{
        transform: `translate(${outerMargin} ${outerMargin})`
    });
    svg.appendChild(body);


    const blocks = []
    for (let i=0; i<N; i++){
        const block = createSVG('rect',{
            height: w,
            width: w,
            fill: 'magenta',
            x: i * (w + m),
        })
        block.addEventListener('click',()=>{
            mainColor.setHSL(
                Object.assign(
                    {},
                    mainColor.color.hsl,
                    {lightness: i*100/(N-1)}
                )
            )
        })
        body.appendChild(block);
        blocks.push(block);
    }

    const wDel = 0;
    const frame = createSVG('rect',{
        height: w + wDel,
        width: w + wDel,
        fill: 'transparent',
        stroke: 'white',
        'stroke-width': 2,
        filter: 'url(#shadow)'
    });
    body.appendChild(frame);

    mainColor.subscribe((COLOR, PREV) => {
        const { lightness } = COLOR.hsl;
        const inc = (100/(N-1));
        const replacementIndex = Math.round(lightness/inc);

        for (let i=0; i<N; i++){
            if (i === replacementIndex){
                blocks[i].setAttribute(
                    'fill',
                    `rgb(${COLOR.rgb.red},${COLOR.rgb.green},${COLOR.rgb.blue})`,
                );
                frame.setAttribute('x', i*(w+m) - wDel/2);
                frame.setAttribute('y', -wDel/2)
                continue;
            }
            const tempLightness = inc*i;
            const color = rgbFromHSL(Object.assign({},COLOR.hsl,{lightness: tempLightness}));
            blocks[i].setAttribute(
                'fill',
                `rgb(${color.red},${color.green},${color.blue})`,
            );
            blocks[i].setAttribute('stroke', 'transparent');
        }
    })

    document.body.appendChild(svg);
}