import fragmentScript from '../webgl/shaders/conicGradient.glsl';
import getPattern from './utils/getPattern';

export default function conicGradient({
    height,
    width,
}){
    return getPattern({
        height,
        width,
        script: fragmentScript,
        staticUniforms: {},
        dynamicUniforms: {
            u_saturation: {
                type: 'uniform1f',
                setter: ((COLOR, PREV) => {
                    if (COLOR.hsl.saturation === PREV.hsl.saturation) return false;
                    return COLOR.hsl.saturation/100;
                }),
            },
            u_lightness: {
                type: 'uniform1f',
                setter: ((COLOR, PREV) => {
                    if (COLOR.hsl.lightness === PREV.hsl.lightness) return false;
                    return COLOR.hsl.lightness/100;
                }),
            }
        }
    })
}
// export default class ConicGradient {
// 	constructor(){
// 		this.canvas = document.createElement('canvas');
// 		this.canvas.width = 400;
//         this.canvas.height = 400;
//         this.gl = this.canvas.getContext('webgl');
        
//         if (!this.gl) throw new Error("Could not find WebGL context");

//         const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertexScript);
//         const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragmentScript);
//         this.program = createProgram(this.gl, vertexShader, fragmentShader);
    
//         this.gl.useProgram(this.program);
    
//         this.saturation = this.gl.getUniformLocation(this.program, "u_saturation");
//         this.lightness = this.gl.getUniformLocation(this.program, "u_lightness");
//     }
    
// 	generate(COLOR){
//         const {saturation, lightness} = COLOR.hsl;
        
//         this.gl.uniform1f(this.saturation, saturation/100);
//         this.gl.uniform1f(this.lightness, lightness/100);
//         drawVertices(this.gl, this.program, 'a_position');

// 		return this.canvas.toDataURL();
// 	}
// }