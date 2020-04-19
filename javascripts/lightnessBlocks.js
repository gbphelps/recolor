import mainColor from './ColorObject';
import createSVG from './createSVG';
import converter from './colorMethods/index';


export default function (colorSpace, channel, target){
    const W = 510;
    const N = 21;
    const m = 1;
    const w = (W-(m*(N-1)))/N;
    const wmarg = 0;
    const hmarg = 4;

    const dir = "v";

    if (!target) target = document.body;


    const svg = createSVG('svg',{
        [dir === 'v' ? 'width' : 'height']: w + hmarg*2,
        [dir === 'v' ? 'height' : 'width']: W + wmarg*2,
    })

    const body = createSVG('g',{
        transform: `translate(${dir === "v" ? hmarg : wmarg} ${dir === "v" ? wmarg : hmarg})`
    });
    svg.appendChild(body);


    const blocks = []
    for (let i=0; i<N; i++){
        const block = createSVG('rect',{
            height: w,
            width: w,
            [dir === 'v' ? 'y' : 'x']: i * (w + m),
        })
        block.addEventListener('click',()=>{
            mainColor.set(colorSpace,
                Object.assign(
                    {},
                    mainColor.color[colorSpace],
                    {[channel.name]: i*[channel.max]/(N-1)}
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
        filter: 'url(#shadow)',
        rx: 2,
        ry: 2
    });
    body.appendChild(frame);

    mainColor.subscribe((COLOR, PREV) => {
        const inc = (channel.max/(N-1));
        const replacementIndex = Math.round(COLOR[colorSpace][channel.name]/inc);

        for (let i=0; i<N; i++){
            if (i === replacementIndex){
                blocks[i].setAttribute(
                    'fill',
                    `rgb(${COLOR.rgb.red},${COLOR.rgb.green},${COLOR.rgb.blue})`,
                );
                frame.setAttribute(dir === 'v' ? 'y' : 'x', i*(w+m) - wDel/2);
                frame.setAttribute(dir === 'v' ? 'x' : 'y', -wDel/2)
                continue;
            }
            const tempChannel = inc*i;
            const color = converter.getRGB[colorSpace](
                Object.assign(
                    {},
                    COLOR[colorSpace],
                    {[channel.name]: tempChannel})
                );
            blocks[i].setAttribute(
                'fill',
                `rgb(${color.red},${color.green},${color.blue})`,
            );
            blocks[i].setAttribute('stroke', 'transparent');
        }
    })

    Object.assign(svg.style, {
        border: 'none',
        borderRadius: 0
    })
    target.appendChild(svg);
}