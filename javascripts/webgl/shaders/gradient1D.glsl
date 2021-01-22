precision mediump float;
varying vec2 v_pos;
uniform vec2 u_res;
uniform int u_colorspace;
uniform int u_chan;
uniform vec3 u_color;
uniform float u_padding;

float floatMod(float a, float b){
    return a - floor(a/b) * b;
}

//HSL u_colorspace == 0
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

// //HSV u_colorspace == 1
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


vec3 assign(vec3 color, int chan, float new_value) {
  vec3 new_color = color.xyz;
  if (chan == 0) {
      new_color.x = new_value;
  } else if (chan == 1){
      new_color.y = new_value;
  } else if (chan == 2) {
      new_color.z = new_value;
  }
  return new_color;
}

void main() {
    float val = ((v_pos.y + 1.0)/2.0*u_res.y - u_padding)/(u_res.y-2.0*u_padding);
    val = min(1.0,val);
    val = max(0.0,val);

    vec3 new_color = assign(u_color, u_chan, val);
    if (u_colorspace == 0) {
        gl_FragColor = vec4(rgb_hsl(new_color),1);
    } else if (u_colorspace == 1) {
        gl_FragColor = vec4(rgb_hsv(new_color),1);
    } else {
        gl_FragColor = vec4(1,0,0,1);
    }
}
