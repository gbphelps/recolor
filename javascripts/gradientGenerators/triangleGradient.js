import pureFromHue from '../colorMethods/pureFromHue';
import vertexScript from '../webgl/shaders/basicVertexShader.glsl';
import fragmentScript from '../webgl/shaders/triangleGradient.glsl'; 
import {createShader, createProgram, drawVertices} from '../webgl/utils';

export default class TriangleGradient {
    constructor({height, width, side, margin}){
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height; 
        this.margin = margin;

        this.gl = this.canvas.getContext('webgl');
        if (!this.gl) throw new Error("Could not find WebGL context");

        const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexScript);
        const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentScript);

        this.program = createProgram(this.gl, vertexShader, fragmentShader);

        this.gl.useProgram(this.program);

        this.u_res = this.gl.getUniformLocation(this.program, "u_res");
        this.u_color = this.gl.getUniformLocation(this.program, "u_color");
        this.u_side = this.gl.getUniformLocation(this.program, "u_side");
        this.u_margin = this.gl.getUniformLocation(this.program, "u_margin");
        
        this.gl.uniform2f(this.u_res, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.uniform1f(this.u_side, side);
        this.gl.uniform1f(this.u_margin, this.margin);

        drawVertices(this.gl, this.program, "a_position");
    }
    generate(COLOR){
        const pure = pureFromHue(COLOR.hsv.hue%360);
        this.gl.uniform4f(this.u_color, ...['red','green','blue'].map(k => pure[k]/255), 1);
        drawVertices(this.gl, this.program, "a_position");
        return this.canvas.toDataURL();
    }
}