import vertexScript from './shaders/basicVertexShader.glsl';
import triangleGradient from './shaders/triangleGradient.glsl';
import gradient1D from './shaders/gradient1D.glsl';

//TODO turn triangleGradient and gradient1D into classes in /gradientGenerators
//TODO create a superclass for gradients
export function drawVertices(gl, program, positionAttribute) {
    const position = gl.getAttribLocation(program, positionAttribute);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -1, -1,
        1, -1,
        1,  1,
        1,  1,
        -1, 1,
        -1, -1,
      ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

export function clear(gl){
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

export function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Could not create shader');

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    gl.deleteShader(shader);
    throw new Error(`Could not create shader: ${gl.getShaderInfoLog(shader)}`)
}

export function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    if (!program) throw new Error('Could not create program');
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    gl.deleteProgram(program);
    throw new Error(`Could not create program: ${gl.getProgramInfoLog(program)}`);
}