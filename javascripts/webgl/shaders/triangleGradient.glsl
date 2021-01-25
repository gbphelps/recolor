precision mediump float;
varying vec2 v_pos;
uniform vec2 u_res;
uniform vec3 u_color;
uniform float u_side;
uniform float u_margin;

float toLine(vec2 slope, vec2 linePoint, vec2 point) {
  vec2 n = slope/length(slope);
  vec2 dir = linePoint - point;
  return length(dir - dot(dir,n)*n);
}

void main() {
  float sq3 = 1.732050807568877;
  float ratio = sq3/2.0;
  float h = u_side * ratio;
  vec3 black = vec3(0.0, 0.0, 0.0);
  vec3 white = vec3(1.0, 1.0, 1.0);

  float xm = u_margin/u_res.x;
  float ym = u_margin/u_res.y;

  float x = (v_pos.x/(1.0-2.0*xm))/2.0;
  float y = (((1.0 - v_pos.y)/2.0) - ym)/(1.0-2.0*ym)*ratio;
  
  vec2 point = vec2(x, y);
  vec2 y0 = vec2(0.0, ratio);
  vec2 slope1 = vec2(1.0,sq3);
  vec2 slope2 = vec2(-1.0,sq3);

  float top = y/ratio;
  float left = toLine(slope1,y0,point)/ratio;
  float right = toLine(slope2,y0,point)/ratio;

   

   if (x < -.5) {
    gl_FragColor = vec4(0,0,1,1);
   } else if (x > .5){
     gl_FragColor = vec4(1,0,0,1);
   } else if (y < 0.0){
     gl_FragColor = vec4(0,1,1,1);
   } else if (y > ratio){
     gl_FragColor = vec4(1,0,1,1);
   } else if (y > (x + .5)*sq3) {
      gl_FragColor = vec4(1,1,0,1);
   } else if (y > (.5 - x)*sq3) {
      gl_FragColor = vec4(0,1,0,1);
   } else {
     gl_FragColor = vec4(
       left*white + right*black + top*u_color,
       1.0
    );
   }

   	// if (y < sq3*x && y < (x-u_side)*-sq3 && y > 0.0){
    //   gl_FragColor = vec4(top*u_color + left*white + right*black, 1.0);
    // } else if (y <= 0.0) {
    //   gl_FragColor = vec4(1,0,0,1);
 	  //   // gl_FragColor = vec4(x/u_side*white + (1.0-x/u_side)*black, 1.0);
    // } else if (x > u_side/2.0 && y > 0.0){
    //   gl_FragColor = vec4(1,0,0,1);
    //   // float w = min((-(x-u_side)/2.0 + ratio*y)/u_side,1.0);
    //   // gl_FragColor = vec4((1.0-w)*white + w*u_color, 1.0);
    // } else {
    //   gl_FragColor = vec4(1,0,0,1);
    //   // float w = min((x/2.0 + ratio*y)/u_side, 1.0);
    //   // gl_FragColor = vec4((1.0-w)*black + w*u_color, 1);
    // }
}

