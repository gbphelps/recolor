import vertexScript from '../webgl/shaders/basicVertexShader.glsl';
import fragmentScript from '../webgl/shaders/xyGradient.glsl';
import {COLOR_ORD, CHAN_MAX, COLOR_SPACE} from '../colorMathConstants';
import {createShader, createProgram, drawVertices} from '../webgl/utils';

export default class XYGradient{
    constructor({
        height, 
        width, 
        padding, 
        colorSpace, 
        xChannel, 
        yChannel, 
        zChannel
    }){
        this.canvas = document.createElement('canvas');
        this.canvas.height = height;
        this.canvas.width = width;
        this.colorSpace = colorSpace;
        this.zChannel = zChannel;

        const ord = [xChannel, yChannel, zChannel].map(c => COLOR_ORD[colorSpace][c]);

        this.gl = this.canvas.getContext('webgl');
        if (!this.gl) throw new Error("Could not find WebGL context");

        const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexScript);
        const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentScript);
    
        this.program = createProgram(this.gl, vertexShader, fragmentShader);
        this.gl.useProgram(this.program);
    
        this.uRes = this.gl.getUniformLocation(this.program, "u_res");
        this.uZ = this.gl.getUniformLocation(this.program, "u_z");
        this.uColorSpace = this.gl.getUniformLocation(this.program, "u_colorspace");
        this.uOrd = this.gl.getUniformLocation(this.program, "u_ord");
        this.uPadding = this.gl.getUniformLocation(this.program, "u_padding");
        
        this.gl.uniform2f(this.uRes, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.uniform1i(this.uColorSpace, COLOR_SPACE[colorSpace]);
        this.gl.uniform1f(this.uZ, 0);
        this.gl.uniform3i(this.uOrd, ...ord);
        this.gl.uniform1f(this.uPadding, padding);
    }

    generate(COLOR){
        const z = COLOR[this.colorSpace][this.zChannel] /
            CHAN_MAX[this.colorSpace][this.zChannel];
        this.gl.uniform1f(this.uZ, z);
        drawVertices(this.gl, this.program, "a_position");

        return this.canvas.toDataURL();
    }
}