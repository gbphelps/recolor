precision mediump float;
varying vec2 v_pos;

float frac(float x) {
    return x - floor(x);
}

void main() {
    float pi = 3.14159265359;

    float y = v_pos.y;
    float x = v_pos.x;

    float angle = atan(x/y);
    if (y < 0.0) angle = pi + angle;
	if (x < 0.0 && y >= 0.0) angle = 2.0*pi + angle;

    
    float sixth = angle/(2.0*pi) * 6.0;
    
    if (sixth < 1.0) {
        gl_FragColor = vec4(1.0, frac(sixth), 0.0, 1.0);
    } else if (sixth < 2.0) {
        gl_FragColor = vec4(1.0 - frac(sixth), 1.0, 0.0, 1.0);
    } else if (sixth < 3.0) {
        gl_FragColor = vec4(0.0, 1.0, frac(sixth), 1.0);
    } else if (sixth < 4.0) {
        gl_FragColor = vec4(0.0, 1.0 - frac(sixth), 1.0, 1.0);
    } else if (sixth < 5.0) {
        gl_FragColor = vec4(frac(sixth), 0, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(1.0, 0.0, 1.0-frac(sixth), 1.0);
    }
}