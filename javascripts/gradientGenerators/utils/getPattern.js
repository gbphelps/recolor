
import {createShader, createProgram, drawVertices} from '../../webgl/utils';
import mainColor from '../../ColorObject';
import createSVG from '../../createSVG';
import vertexScript from '../../webgl/shaders/basicVertexShader.glsl';

export default function getPattern({
    height, 
    width, 
    staticUniforms, 
    dynamicUniforms, 
    script,
}){
    const pattern = createSVG('pattern',{
        height: 1,
        width: 1,
        patternUnits: 'objectBoundingBox',
        patternContentUnits: 'objectBoundingBox',
    })
    pattern.id = `GRADIENT_${getPattern.callCounter++}`
    const image = createSVG('image',{
       height: 1,
       width: 1,
       x:0,
       y:0,
       preserveAspectRatio: 'none'
    })
    pattern.appendChild(image);

    const canvas = document.createElement('canvas');
    canvas.height = height;
    canvas.width = width;

    const gl = canvas.getContext('webgl');
    if (!gl) throw new Error("Could not find WebGL context");

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexScript);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, script);

    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const u_res = gl.getUniformLocation(program, "u_res");
    gl.uniform2f(u_res, gl.canvas.width, gl.canvas.height);

    Object.keys(staticUniforms).forEach((name) => {
        const {type, value} = staticUniforms[name];
        const loc = gl.getUniformLocation(program, name);
        gl[type](loc, ...(Array.isArray(value) ? value : [value]));
    })


    mainColor.subscribe((COLOR, PREV) => {
        const newUniforms = Object.keys(dynamicUniforms).map((name) => {
            const {setter, type} = dynamicUniforms[name];
            const loc = gl.getUniformLocation(program, name);
            return {
                value: setter(COLOR, PREV),
                type,
                loc,
            } 
        });
        if (!newUniforms.every(u => u.value === false)) {
            console.log(`HEY ${pattern.id}`)
            newUniforms.forEach(u => {
                // return false when you don't want to update.
                if (u.value === false) return;
                gl[u.type](u.loc, ...(Array.isArray(u.value) ? u.value : [u.value]));
            })
        }

        drawVertices(gl, program, "a_position");
        image.setAttribute('href', canvas.toDataURL());
    })

    return pattern;
}
getPattern.callCounter = 0;