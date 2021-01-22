precision mediump float;
varying vec2 v_pos;
uniform float u_saturation;
uniform float u_lightness;


float floatMod(float a, float b){
    return a - floor(a/b) * b;
}

vec3 rgb_hsl(vec3 hsl){
    float C = (1.0 - abs(2.0*hsl.z- 1.0))*hsl.y;
    float H = hsl.x*6.0;
    float X = C * (1.0 - abs(floatMod(H, 2.0)-1.0));
    float m = hsl.z - C/2.0;

    if (H == 6.0 || H < 1.0) {
        return vec3(C + m, X + m, m);
    } else if (H < 2.0) {
        return vec3(X + m, C + m, m);
    } else if (H < 3.0) {
        return vec3(m, C + m, X + m);
    } else if (H < 4.0) {
        return vec3(m, X + m, C + m);
    } else if (H < 5.0) {
        return vec3(X + m, m, C + m);
    } else {
        return vec3(C + m, m, X + m);
    }
}

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

    
    float hue = angle/(2.0*pi);
    gl_FragColor = vec4(
        rgb_hsl(vec3(hue, u_saturation, u_lightness)), 
        1.0
    );
}