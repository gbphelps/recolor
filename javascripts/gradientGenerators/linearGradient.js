
import {COLOR_SPACE, COLOR_ORD, CHAN_MAX} from '../colorMathConstants';
import vertexScript from '../webgl/shaders/basicVertexShader.glsl';
import fragmentScript from '../webgl/shaders/gradient1D.glsl';
import {createShader, createProgram, drawVertices} from '../webgl/utils';

export default class LinearGradient {
    constructor({colorSpace, channel, padding, height, width}){
        this.canvas = document.createElement('canvas');
        this.canvas.height = height;
        this.canvas.width = width;

        this.colorSpaceInt = COLOR_SPACE[colorSpace];
        this.colorSpace = colorSpace;
        this.channelIndex = COLOR_ORD[colorSpace][channel];
        this.padding = padding;

        this.gl = this.canvas.getContext('webgl');
        if (!this.gl) throw new Error("Could not find WebGL context");

        const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexScript);
        const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentScript);
    
        this.program = createProgram(this.gl, vertexShader, fragmentShader);

        this.gl.useProgram(this.program);
    
        this.u_res = this.gl.getUniformLocation(this.program, "u_res");
        this.u_colorspace = this.gl.getUniformLocation(this.program, "u_colorspace");
        this.u_chan = this.gl.getUniformLocation(this.program, "u_chan");
        this.u_color = this.gl.getUniformLocation(this.program, "u_color");
        this.u_padding = this.gl.getUniformLocation(this.program, "u_padding");
    
        this.gl.uniform2f(this.u_res, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.uniform1i(this.u_colorspace, this.colorSpaceInt);
        this.gl.uniform1i(this.u_chan, this.channelIndex);
        this.gl.uniform1f(this.u_padding, this.padding);
      
    }

    generate(COLOR){
        const vecColor = [];
        Object.keys(COLOR[this.colorSpace]).forEach(k => {
            console.log(k)
            vecColor[COLOR_ORD[this.colorSpace][k]] = COLOR[this.colorSpace][k]/CHAN_MAX[this.colorSpace][k];
        })
        console.log(vecColor)
        Object.keys(COLOR[this.colorSpace])
        this.gl.uniform3f(this.u_color, ...vecColor);
        drawVertices(this.gl, this.program, "a_position");

        return this.canvas.toDataURL();
    }
}