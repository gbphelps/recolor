import { webglGradient} from './webgl/utils';
import vertexShader from './webgl/shaders/basicVertexShader.glsl';
import conicGradientShader from './webgl/shaders/conicGradient.glsl';

export default function conicGradient(){
	const c = document.createElement('canvas');

	c.width = 400;
	c.height = 400;

	webglGradient(c,vertexShader,conicGradientShader);
	return c.toDataURL();
}