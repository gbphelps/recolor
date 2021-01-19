precision mediump float;
varying vec2 v_pos;
uniform vec2 u_res;
uniform float u_z;
uniform int u_colorspace;

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

vec3 rgb_hsv(vec3 hsv){

    float H = hsv.x*6.0;

	float progress = floatMod(H, 1.0);
	if (floatMod(floor(H),2.0) == 1.0){
		progress = 1.0 - progress;
	};
	
	float maxval = hsv.z;
	float minval = (1.0 - hsv.y) * maxval;
	float midval = minval + (maxval - minval)*progress;

    vec3 max2min = vec3(maxval, midval, minval);

    if (H == 6.0 || H < 1.0) {
        return max2min.rgb;
    } else if (H < 2.0) {
        return max2min.grb;
    } else if (H < 3.0) {
        return max2min.brg;
    } else if (H < 4.0) {
        return max2min.bgr;
    } else if (H < 5.0) {
        return max2min.gbr;
    } else {
        return max2min.rbg;
    }
}

void main() {
    float margin = 0.0;

    float x = (v_pos.x + 1.0)/2.0*u_res.x - margin;
    x = max(x, 0.0);
    x = min(x, u_res.x - 2.0*margin);
    
    float x_unit = x/(u_res.x - 2.0*margin);

    float y = (1.0 + v_pos.y)/2.0*u_res.y - margin;
    y = max(y, 0.0);
    y = min(y, u_res.y - 2.0*margin);

    float y_unit = y/(u_res.y - 2.0*margin);

    vec3 rgb;

    if (u_colorspace == 0) {
        rgb = rgb_hsl(vec3(x_unit, y_unit, u_z));
    } else if (u_colorspace == 1) {
        rgb = rgb_hsv(vec3(u_z, x_unit, y_unit));
    } else {
        rgb = vec3(1.0,0.0,0.0);
    }
    gl_FragColor = vec4(rgb, 1.0);
}
