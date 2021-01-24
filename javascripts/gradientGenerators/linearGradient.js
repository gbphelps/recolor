
import {COLOR_SPACE, COLOR_ORD, CHAN_MAX} from '../colorMathConstants';
import vertexScript from '../webgl/shaders/basicVertexShader.glsl';
import fragmentScript from '../webgl/shaders/gradient1D.glsl';
import {createShader, createProgram, drawVertices} from '../webgl/utils';
import mainColor from '../ColorObject';
import createSVG from '../createSVG';
import allEqualExcept from '../utils/allEqualExcept';


function gradient({
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
    pattern.id = `GRADIENT_${gradient.counter++}`
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
        Object.keys(dynamicUniforms).forEach((name) => {
            const {type, setter} = dynamicUniforms[name];
            const val = setter(COLOR, PREV);
            const loc = gl.getUniformLocation(program, name);
            if (val === false) return; // return false when you don't want to update.
            gl[type](loc, ...(Array.isArray(val) ? val : [val]));
            drawVertices(gl, program, "a_position");
        });
        image.setAttribute('href', canvas.toDataURL());
    })

    return pattern;
}
gradient.counter = 0;


export default function linearGradient({
    colorSpace, 
    channel, 
    padding, 
    height, 
    width,
}){
    return gradient({
        height,
        width,
        script: fragmentScript,
        staticUniforms: {
            u_colorspace: {
                type: 'uniform1i',
                value: COLOR_SPACE[colorSpace], 
            },
            u_padding: {
                type: 'uniform1f',
                value: padding,
            },
            u_chan: {
                type: 'uniform1i',
                value: COLOR_ORD[colorSpace][channel],
            }
        },
        dynamicUniforms: {
            u_color: {
                type: 'uniform3f',
                setter: (COLOR, PREV) => {
                    // don't need to update if every other channel in this colorspace is the same.
                    if (allEqualExcept(channel, COLOR[colorSpace], PREV[colorSpace])) {
                        return false;
                    }
                    const vecColor = [];
                    Object.keys(COLOR[colorSpace]).forEach(k => {
                        vecColor[COLOR_ORD[colorSpace][k]] = 
                        COLOR[colorSpace][k]/CHAN_MAX[colorSpace][k];
                    })
                    return vecColor;
                }
            }
        },
    })   
}
