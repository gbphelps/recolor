export default function createSVG(type,props){
    const el = document.createElementNS('http://www.w3.org/2000/svg', type);
    el.id = createSVG.id++;
    Object.keys(props).forEach(key => {
        el.setAttribute(key,props[key]);
    })
    return el;
}
createSVG.id = 0;