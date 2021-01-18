import { genConicGradient } from './webgl/utils';

export default function conicGradient(){
	const c = document.createElement('canvas');

	c.width = 400;
	c.height = 400;

	genConicGradient(c);
	return c.toDataURL();
}