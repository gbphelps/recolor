precision mediump float;
varying vec2 v_pos;
uniform vec2 u_res;
uniform vec4 u_color;
uniform float u_side;

void main() {
   float sq3 = 1.732050807568877;
   float ratio = sq3/2.0;
   float margin = 10.0;
   float h = u_side * ratio;
   vec4 black = vec4(0.0, 0.0, 0.0, 1.0);
   vec4 white = vec4(1.0, 1.0, 1.0, 1.0);

   float x = (v_pos.x + 1.0)/2.0 * u_res.x - margin;
   float y = (1.0 - (v_pos.y + 1.0)/2.0) * u_res.y - margin;

   float top = y/h;
   float left = (x*sq3 - y)/h/2.0;
   float right = ((x-u_side)*-sq3 -y)/h/2.0;

   	if (y < sq3*x && y < (x-u_side)*-sq3 && y > 0.0){
      gl_FragColor = vec4((top*u_color + left*white + right*black).xyz, 1.0);
    } else if (y <= 0.0) {
 	    gl_FragColor = vec4((x/u_side*white + (1.0-x/u_side)*black).xyz, 1.0);
    } else if (x > u_side/2.0 && y > 0.0){
      float w = min((-(x-u_side)/2.0 + ratio*y)/u_side,1.0);
      gl_FragColor = vec4(((1.0-w)*white + w*u_color).xyz, 1.0);
    } else {
      float w = min((x/2.0 + ratio*y)/u_side, 1.0);
      gl_FragColor = vec4(((1.0-w)*black + w*u_color).xyz, 1);
    }
}

