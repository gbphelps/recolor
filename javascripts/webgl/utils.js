import vertexScript from './shaders/basicVertexShader.glsl';
import conicGradient from './shaders/conicGradient.glsl';
import triangleGradient from './shaders/triangleGradient.glsl';
import hueSaturation from './shaders/xyGradient.glsl';
import gradient1D from './shaders/gradient1D.glsl';


function drawVertices(gl, program, positionAttribute) {
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

function clear(gl){
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

export function genConicGradient(canvas){
    const gl = canvas.getContext('webgl');
    if (!gl) throw new Error("Could not find WebGL context");

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexScript);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, conicGradient);

    const program = createProgram(gl, vertexShader, fragmentShader);

    clear(gl);
    gl.useProgram(program);
    drawVertices(gl, program, 'a_position');
}

export function genTriangleGradient(c){
    const gl = c.getContext('webgl');
    if (!gl) throw new Error("Could not find WebGL context");
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexScript);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, triangleGradient);

    const program = createProgram(gl, vertexShader, fragmentShader);

    clear(gl);
    gl.useProgram(program);

    const u_res = gl.getUniformLocation(program, "u_res");
    const u_color = gl.getUniformLocation(program, "u_color");
    const u_side = gl.getUniformLocation(program, "u_side");
    
    gl.uniform2f(u_res, gl.canvas.width, gl.canvas.height);
    gl.uniform4f(u_color, 1, 0, 1, 0);
    gl.uniform1f(u_side, 180);

    drawVertices(gl, program, "a_position");
    return {
        update(color){
            gl.uniform4f(u_color, color.red/255, color.green/255, color.blue/255, 1);
            drawVertices(gl, program, "a_position");
        }
    }
}


export function genXYGradient(c, colorSpace, ord){
    const gl = c.getContext('webgl');
    if (!gl) throw new Error("Could not find WebGL context");
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexScript);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, hueSaturation);

    const program = createProgram(gl, vertexShader, fragmentShader);

    clear(gl);
    gl.useProgram(program);

    const u_res = gl.getUniformLocation(program, "u_res");
    const u_z = gl.getUniformLocation(program, "u_z");
    const u_colorspace = gl.getUniformLocation(program, "u_colorspace");
    const u_ord = gl.getUniformLocation(program, "u_ord");
    
    gl.uniform2f(u_res, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(u_colorspace, colorSpace);
    gl.uniform1f(u_z, 0);
    gl.uniform3i(u_ord, ...ord);

    drawVertices(gl, program, "a_position");
    return {
        update(z){
            gl.uniform1f(u_z, z);
            drawVertices(gl, program, "a_position");
        }
    }
}


export function gen1Dgradient(c, colorSpace, channelIndex, padding, color){
    const gl = c.getContext('webgl');
    if (!gl) throw new Error("Could not find WebGL context");
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexScript);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, gradient1D);

    const program = createProgram(gl, vertexShader, fragmentShader);

    clear(gl);
    gl.useProgram(program);

    const u_res = gl.getUniformLocation(program, "u_res");
    const u_colorspace = gl.getUniformLocation(program, "u_colorspace");
    const u_chan = gl.getUniformLocation(program, "u_chan");
    const u_color = gl.getUniformLocation(program, "u_color");
    const u_padding = gl.getUniformLocation(program, "u_padding");

    gl.uniform2f(u_res, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(u_colorspace, colorSpace);
    gl.uniform1i(u_chan, channelIndex);
    gl.uniform3f(u_color, ...color);
    gl.uniform1f(u_padding, padding);


    drawVertices(gl, program, "a_position");
    return {
        update(color){
            gl.uniform3f(u_color, ...color);
            drawVertices(gl, program, "a_position");
        }
    }
}



function createShader(gl, type, source) {
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

function createProgram(gl, vertexShader, fragmentShader) {
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