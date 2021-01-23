
import {COLOR_SPACE, COLOR_ORD, CHAN_MAX} from '../colorMathConstants';
import vertexScript from '../webgl/shaders/basicVertexShader.glsl';
import fragmentScript from '../webgl/shaders/gradient1D.glsl';
import {createShader, createProgram, drawVertices} from '../webgl/utils';
import mainColor from '../ColorObject';




function gradient({
    height, 
    width, 
    staticUniforms, 
    dynamicUniforms, 
    script,
}){
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

    Object.keys(dynamicUniforms).forEach((name) => {
        const {type, setter} = dynamicUniforms[name];
        const loc = gl.getUniformLocation(program, name);
        mainColor.subscribe((COLOR) => {
            const val = setter(COLOR);
            gl[type](loc, ...(Array.isArray(val) ? val : [val]));
            drawVertices(gl, program, "a_position");
        });
    });
   
    return function get(){
        return canvas.toDataURL();
    }
}

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
                setter: (COLOR) => {
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











// export default class LinearGradient {
//     constructor({colorSpace, channel, padding, height, width}){
//         this.canvas = document.createElement('canvas');
//         this.canvas.height = height;
//         this.canvas.width = width;

//         this.colorSpaceInt = COLOR_SPACE[colorSpace];
//         this.colorSpace = colorSpace;
//         this.channelIndex = COLOR_ORD[colorSpace][channel];
//         this.padding = padding;

//         this.gl = this.canvas.getContext('webgl');
//         if (!this.gl) throw new Error("Could not find WebGL context");

//         const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexScript);
//         const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentScript);
    
//         this.program = createProgram(this.gl, vertexShader, fragmentShader);

//         this.gl.useProgram(this.program);
    
//         this.u_res = this.gl.getUniformLocation(this.program, "u_res");
//         this.u_colorspace = this.gl.getUniformLocation(this.program, "u_colorspace");
//         this.u_chan = this.gl.getUniformLocation(this.program, "u_chan");
//         this.u_color = this.gl.getUniformLocation(this.program, "u_color");
//         this.u_padding = this.gl.getUniformLocation(this.program, "u_padding");
    
//         this.gl.uniform2f(this.u_res, this.gl.canvas.width, this.gl.canvas.height);
//         this.gl.uniform1i(this.u_colorspace, this.colorSpaceInt);
//         this.gl.uniform1i(this.u_chan, this.channelIndex);
//         this.gl.uniform1f(this.u_padding, this.padding);
      
//     }

//     generate(COLOR){
//         const vecColor = [];
//         Object.keys(COLOR[this.colorSpace]).forEach(k => {
//             vecColor[COLOR_ORD[this.colorSpace][k]] = COLOR[this.colorSpace][k]/CHAN_MAX[this.colorSpace][k];
//         })
//         Object.keys(COLOR[this.colorSpace])
//         this.gl.uniform3f(this.u_color, ...vecColor);
//         drawVertices(this.gl, this.program, "a_position");

//         return this.canvas.toDataURL();
//     }
// }