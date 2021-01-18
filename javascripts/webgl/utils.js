export function webglGradient(canvas, vertexScript, fragmentScript){
    const gl = canvas.getContext('webgl');
    if (!gl) throw new Error("Could not find WebGL context");

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexScript);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentScript);

    const program = createProgram(gl, vertexShader, fragmentShader);
    const a_position = gl.getAttribLocation(program, "a_position");
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
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.enableVertexAttribArray(a_position);
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
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

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error('Could not create shader')
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
   
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    throw new Error('Could not create program');
}