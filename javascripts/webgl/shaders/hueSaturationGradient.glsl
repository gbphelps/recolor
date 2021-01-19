precision mediump float;
varying vec2 v_pos;
uniform vec2 u_res;
uniform float u_z;

float floatMod(float a, float b){
    return a - floor(a/b) * b;
}

vec3 rgb(vec3 hsl){
    float C = (1.0 - abs(2.0*hsl.z/100.0 - 1.0))*hsl.y/100.0;
    float H = hsl.x/60.0;
    float X = C * (1.0 - abs(floatMod(H, 2.0)-1.0));
    float m = hsl.z/100.0 - C/2.0;

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
        return vec3 (C + m, m, X + m);
    }
}

void main() {
    float margin = 0.0;

    float x = (v_pos.x + 1.0)/2.0*u_res.x - margin;
    x = max(x, 0.0);
    x = min(x, u_res.x - 2.0*margin);
    
    float x_unit = x/(u_res.x - 2.0*margin) * 360.0;

    float y = (1.0 + v_pos.y)/2.0*u_res.y - margin;
    y = max(y, 0.0);
    y = min(y, u_res.y - 2.0*margin);

    float y_unit = y/(u_res.y - 2.0*margin) * 100.0;

    gl_FragColor = vec4( rgb(vec3(x_unit, y_unit, u_z)), 1.0);
}
