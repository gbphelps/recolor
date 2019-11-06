import createSVG from './createSVG';

export default function makePattern(){
    const p = createSVG('pattern',{
        height: 1,
        width: 1,
        patternUnits: 'objectBoundingBox',
        patternContentUnits: 'objectBoundingBox',
    })
    const i = createSVG('image',{
       height: 1,
       width: 1,
       x:0,
       y:0,
       preserveAspectRatio: 'none'
    })
    p.appendChild(i);
    return p;
}