/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./javascripts/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./javascripts/ColorObject.js":
/*!************************************!*\
  !*** ./javascripts/ColorObject.js ***!
  \************************************/
/*! exports provided: Color, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Color", function() { return Color; });
/* harmony import */ var _colorMethods_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colorMethods/index */ "./javascripts/colorMethods/index.js");


function deepDup(obj){
    const newObj = {};
    Object.keys(obj).forEach(k => {
        newObj[k] = (typeof obj[k] === 'object') ?
        deepDup(obj[k]) :
        obj[k]
    })
    return newObj;
}

function isEqualPartial(partial,obj){
    const keys = Object.keys(partial || {});
    for (let i=0; i<keys.length; i++){
        if (partial[keys[i]] !== obj[keys[i]]) return false;
    }
    return true;
}

function patchError(obj, prev){
    const keys = Object.keys(obj);
    for (let i=0; i<keys.length; i++){
        if (
            obj[keys[i]] === Infinity ||
            obj[keys[i]] === -Infinity ||
            Number.isNaN(obj[keys[i]])
        ) obj[keys[i]] = prev[keys[i]]
    }
    return obj;
}

function patchHSLUV(obj, prev){
    //todo: add checks for maxes, not just mins
    if (obj.saturation < 1e-8){
        obj.hue = prev.hue;
    }
    if (obj.lightness < 1e-8 || Math.abs(obj.lightness - 100) < 1e-8){
        obj.hue = prev.hue;
        obj.saturation = prev.saturation;
    } 
    return obj;
}

class Color {
    constructor(){
        this.color = {
            rgb: {
                red: -1,
                green: -1,
                blue: -1,
            },

            hsv: {
                hue: -1,
                saturation: -1,
                value: -1,
            },

            hsl:{
                hue: -1,
                saturation: -1,
                lightness: -1,
            },

            hsluv:{
                hue: -1,
                saturation: -1,
                lightness: -1
            },

            cmyk:{
                cyan: -1,
                magenta: -1,
                yellow: -1,
                black: -1
            }
        }
        this.subscriptions = [];
    }
	
	subscribe(callback){
		this.subscriptions.push(callback);
	}
    
    set(colorSpace, partial){
        if (isEqualPartial(partial,this.color[colorSpace])) return;

        const prev = deepDup(this.color);
        Object.assign(this.color[colorSpace], partial);
        this.color.rgb = colorSpace === 'rgb' ? 
            this.color.rgb : 
            _colorMethods_index__WEBPACK_IMPORTED_MODULE_0__["default"].getRGB[colorSpace](this.color[colorSpace]);

        const spaces = Object.keys(this.color);
        spaces.forEach(space => {
            if (space === 'rgb' || space === colorSpace) return;
            this.color[space] = patchError(
                _colorMethods_index__WEBPACK_IMPORTED_MODULE_0__["default"].fromRGB[space](this.color.rgb),
                this.color[space]
            )
        })

        if (partial.hue) {
            if (colorSpace !== 'hsl'){
                Object.assign(this.color.hsl,{hue: partial.hue%360});
            }
            if (colorSpace !== 'hsluv'){
                Object.assign(this.color.hsluv,{hue: partial.hue%360});
            }
            if (colorSpace !== 'hsv'){
                Object.assign(this.color.hsv,{hue: partial.hue%360});
            }
        }

        this.subscriptions.forEach(subscription => subscription(this.color, prev));
    }
}

/* harmony default export */ __webpack_exports__["default"] = (new Color());

/***/ }),

/***/ "./javascripts/colorMathConstants.js":
/*!*******************************************!*\
  !*** ./javascripts/colorMathConstants.js ***!
  \*******************************************/
/*! exports provided: COLOR_SPACE, COLOR_ORD, CHAN_MAX */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COLOR_SPACE", function() { return COLOR_SPACE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COLOR_ORD", function() { return COLOR_ORD; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CHAN_MAX", function() { return CHAN_MAX; });
const COLOR_SPACE = {
    'hsl': 0,
    'hsv': 1,
}

const COLOR_ORD = {
    hsl: {
        hue: 0,
        saturation: 1,
        lightness: 2,
    },
    hsv: {
        hue: 0,
        saturation: 1,
        value: 2,
    }
}

const CHAN_MAX = {
    hsl: {
        hue: 360,
        saturation: 100,
        lightness: 100,
    },
    hsv: {
        hue: 360,
        saturation: 100,
        value: 100,
    }
}


/***/ }),

/***/ "./javascripts/colorMethods/cmykFromRGB.js":
/*!*************************************************!*\
  !*** ./javascripts/colorMethods/cmykFromRGB.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_extrema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/extrema */ "./javascripts/utils/extrema.js");


/* harmony default export */ __webpack_exports__["default"] = (function(color){
    const {red, green, blue} = color;
    const r = red/255;
    const g = green/255;
    const b = blue/255;
    const k = (255 - color[Object(_utils_extrema__WEBPACK_IMPORTED_MODULE_0__["default"])(color).max])/255;
    return {
        cyan: (1-r-k)/(1-k)*100,
        magenta: (1-g-k)/(1-k)*100,
        yellow: (1-b-k)/(1-k)*100,
        black: k*100
    }
});

/***/ }),

/***/ "./javascripts/colorMethods/hslFromRGB.js":
/*!************************************************!*\
  !*** ./javascripts/colorMethods/hslFromRGB.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return hslFromRGB; });
/* harmony import */ var _utils_extrema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/extrema */ "./javascripts/utils/extrema.js");
/* harmony import */ var _hueFromRGB__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hueFromRGB */ "./javascripts/colorMethods/hueFromRGB.js");



function hslFromRGB(rgb){
    const { max, min } = Object(_utils_extrema__WEBPACK_IMPORTED_MODULE_0__["default"])(rgb);
    const lightness = (rgb[max] + rgb[min])/2 /255;
    const hue = Object(_hueFromRGB__WEBPACK_IMPORTED_MODULE_1__["default"])(rgb);
    let saturation;
    saturation = (rgb[max] - rgb[min])/255 /(1 - Math.abs(2*lightness - 1));
    return { saturation: saturation*100, lightness: lightness*100, hue };
}

/***/ }),

/***/ "./javascripts/colorMethods/hsluvFromRGB.js":
/*!**************************************************!*\
  !*** ./javascripts/colorMethods/hsluvFromRGB.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return hsluvFromRGB; });
/* harmony import */ var hsluv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hsluv */ "./node_modules/hsluv/hsluv.js");
/* harmony import */ var hsluv__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hsluv__WEBPACK_IMPORTED_MODULE_0__);


function hsluvFromRGB(rgb){
    const color = Object(hsluv__WEBPACK_IMPORTED_MODULE_0__["rgbToHsluv"])([rgb.red/255, rgb.green/255, rgb.blue/255]);
    return {
        hue: color[0],
        saturation: color[1],
        lightness: color[2]
    }
}

/***/ }),

/***/ "./javascripts/colorMethods/hsvFromRGB.js":
/*!************************************************!*\
  !*** ./javascripts/colorMethods/hsvFromRGB.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return hsvFromRGB; });
/* harmony import */ var _hueFromRGB__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hueFromRGB */ "./javascripts/colorMethods/hueFromRGB.js");
/* harmony import */ var _utils_extrema__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/extrema */ "./javascripts/utils/extrema.js");



function hsvFromRGB(rgb){
    const {max, min} = Object(_utils_extrema__WEBPACK_IMPORTED_MODULE_1__["default"])(rgb);
    const saturation = (1-rgb[min]/rgb[max]) * 100;
    const value = rgb[max]/255 * 100;
    const hue  = Object(_hueFromRGB__WEBPACK_IMPORTED_MODULE_0__["default"])(rgb);
    return {hue, saturation, value}
}

/***/ }),

/***/ "./javascripts/colorMethods/hueFromRGB.js":
/*!************************************************!*\
  !*** ./javascripts/colorMethods/hueFromRGB.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return hueFromRGB; });
/* harmony import */ var _utils_extrema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/extrema */ "./javascripts/utils/extrema.js");

function hueFromRGB(rgb){
	const { max, min } = Object(_utils_extrema__WEBPACK_IMPORTED_MODULE_0__["default"])(rgb);
	const c = rgb[max] - rgb[min];
	let hue = null
	if (max === 'red'){
		hue = ((rgb.green - rgb.blue)/c + 6)%6
	} else if (max === 'green') {
		hue = (rgb.blue - rgb.red)/c + 2;
	} else if (max === 'blue'){
		hue = (rgb.red - rgb.green)/c + 4;
	}
	
	return hue/6 * 360;
}

/***/ }),

/***/ "./javascripts/colorMethods/index.js":
/*!*******************************************!*\
  !*** ./javascripts/colorMethods/index.js ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hslFromRGB__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hslFromRGB */ "./javascripts/colorMethods/hslFromRGB.js");
/* harmony import */ var _hsluvFromRGB__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hsluvFromRGB */ "./javascripts/colorMethods/hsluvFromRGB.js");
/* harmony import */ var _hsvFromRGB__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hsvFromRGB */ "./javascripts/colorMethods/hsvFromRGB.js");
/* harmony import */ var _cmykFromRGB__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./cmykFromRGB */ "./javascripts/colorMethods/cmykFromRGB.js");
/* harmony import */ var _rgbFromHSL__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./rgbFromHSL */ "./javascripts/colorMethods/rgbFromHSL.js");
/* harmony import */ var _rgbFromHSLUV__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./rgbFromHSLUV */ "./javascripts/colorMethods/rgbFromHSLUV.js");
/* harmony import */ var _rgbFromHSV__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./rgbFromHSV */ "./javascripts/colorMethods/rgbFromHSV.js");
/* harmony import */ var _rgbFromCMYK__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./rgbFromCMYK */ "./javascripts/colorMethods/rgbFromCMYK.js");










/* harmony default export */ __webpack_exports__["default"] = ({
    getRGB: {
        hsl: _rgbFromHSL__WEBPACK_IMPORTED_MODULE_4__["default"],
        hsluv: _rgbFromHSLUV__WEBPACK_IMPORTED_MODULE_5__["default"],
        hsv: _rgbFromHSV__WEBPACK_IMPORTED_MODULE_6__["default"],
        cmyk: _rgbFromCMYK__WEBPACK_IMPORTED_MODULE_7__["default"],
        rgb: v => v,
    },
    fromRGB: {
        hsl: _hslFromRGB__WEBPACK_IMPORTED_MODULE_0__["default"],
        hsluv: _hsluvFromRGB__WEBPACK_IMPORTED_MODULE_1__["default"],
        hsv: _hsvFromRGB__WEBPACK_IMPORTED_MODULE_2__["default"],
        cmyk: _cmykFromRGB__WEBPACK_IMPORTED_MODULE_3__["default"],
        rgb: v => v
    }
});

/***/ }),

/***/ "./javascripts/colorMethods/pureFromHue.js":
/*!*************************************************!*\
  !*** ./javascripts/colorMethods/pureFromHue.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return pureFromHue; });
function color(sixth){
	switch (Math.floor(sixth)){
		case 0:
			return [255, 255*(sixth%1), 0, 255];
		case 1:
			return [255 * (1-sixth%1), 255, 0, 255];
		case 2:
			return [0, 255, 255 * (sixth%1), 255];
		case 3:
			return [0, 255 * (1-sixth%1), 255, 255];
		case 4:
			return [255 * (sixth%1), 0, 255, 255];
		case 5:
			return [255, 0, 255 * (1-sixth%1), 255];
	}
return [0,0,0,0]
}

function pureFromHue(hue){
    const [red, green, blue] = color(hue/60);
    return { red, green, blue }
}

/***/ }),

/***/ "./javascripts/colorMethods/rgbFromCMYK.js":
/*!*************************************************!*\
  !*** ./javascripts/colorMethods/rgbFromCMYK.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function(color){
    const {cyan, magenta, yellow, black} = color;
    const c = cyan/100;
    const m = magenta/100;
    const y = yellow/100;
    const k = black/100;
    return {
        red: (1-c)*(1-k)*255,
        green: (1-m)*(1-k)*255,
        blue: (1-y)*(1-k)*255
    }
});

/***/ }),

/***/ "./javascripts/colorMethods/rgbFromHSL.js":
/*!************************************************!*\
  !*** ./javascripts/colorMethods/rgbFromHSL.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return rgbFromHSL; });

function rgbFromHSL(hsl){
    const C = (1 - Math.abs(2*hsl.lightness/100 - 1))*hsl.saturation/100;
    const H = hsl.hue/60;
    const X = C * (1 - Math.abs(H%2-1));
    const m = hsl.lightness/100 - C/2;
    switch (Math.floor(H)){
        case 6:
        case 0:
            return {
                red: 255*(C + m),
                green: 255*(X + m),
                blue: 255*m
            }
        case 1:
            return {
                red: 255*(X + m),
                green: 255*(C + m),
                blue: 255*m
            }
        case 2:
            return {
                red: 255*m,
                green: 255*(C + m),
                blue: 255*(X + m)
            }
        case 3:
            return {
                red: 255*m,
                green: 255*(X + m),
                blue: 255*(C + m),
            }
        case 4:
            return {
                red: 255*(X + m),
                green: 255*m,
                blue: 255*(C + m),
            }
        case 5:
            return {
                red: 255*(C + m),
                green: 255*m,
                blue: 255*(X + m),
            }
    }
}

/***/ }),

/***/ "./javascripts/colorMethods/rgbFromHSLUV.js":
/*!**************************************************!*\
  !*** ./javascripts/colorMethods/rgbFromHSLUV.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return hsluvFromRGB; });
/* harmony import */ var hsluv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hsluv */ "./node_modules/hsluv/hsluv.js");
/* harmony import */ var hsluv__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(hsluv__WEBPACK_IMPORTED_MODULE_0__);



window.h2r = hsluv__WEBPACK_IMPORTED_MODULE_0__["hsluvToRgb"];
window.r2h = hsluv__WEBPACK_IMPORTED_MODULE_0__["rgbToHsluv"];

function hsluvFromRGB(hsluv){
    const color = Object(hsluv__WEBPACK_IMPORTED_MODULE_0__["hsluvToRgb"])([hsluv.hue, hsluv.saturation, hsluv.lightness]);
    return {
        red: color[0]*255,
        green: color[1]*255,
        blue: color[2]*255
    }
}

/***/ }),

/***/ "./javascripts/colorMethods/rgbFromHSV.js":
/*!************************************************!*\
  !*** ./javascripts/colorMethods/rgbFromHSV.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return rgbFromHSV; });
function rgbFromHSV(hsv){
	let max, min, mid;
	if ((hsv.hue + 60)%360 <= 120){
		max = 'red';
		[min, mid] = hsv.hue <= 60 ? ['blue', 'green'] : ['green', 'blue'];	
	} else if (hsv.hue <= 180) {
		max = 'green';
		[min, mid] = hsv.hue <= 120 ? ['blue', 'red'] : ['red', 'blue'] 
	} else {
		max = 'blue';
		[min, mid] = hsv.hue <= 240 ? ['red', 'green'] : ['green', 'red']
	}
	
	let progress = (hsv.hue%60) / 60;
	if (Math.floor(hsv.hue/60)%2 === 1){
		progress = 1 - progress
	};
	
	
	const maxval = 255/100 * hsv.value;
	const minval = (100 - hsv.saturation) * maxval / 100;
	const midval = minval + (maxval - minval)*progress;
	
	return {
		[max]: maxval,
		[min]: minval,
		[mid]: midval,
	}
}

/***/ }),

/***/ "./javascripts/colorMethods/triFromRGB.js":
/*!************************************************!*\
  !*** ./javascripts/colorMethods/triFromRGB.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _rgbFromHSV__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rgbFromHSV */ "./javascripts/colorMethods/rgbFromHSV.js");
/* harmony import */ var _hsvFromRGB__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hsvFromRGB */ "./javascripts/colorMethods/hsvFromRGB.js");
/* harmony import */ var _utils_extrema__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/extrema */ "./javascripts/utils/extrema.js");




/* harmony default export */ __webpack_exports__["default"] = (function(rgb){
   const { max, min } = Object(_utils_extrema__WEBPACK_IMPORTED_MODULE_2__["default"])(rgb);
   const white = rgb[min]/255;
   const color = (rgb[max] - 255*white)/255;
   const black = 1 - white - color;
   return {white, black, color};
});

/***/ }),

/***/ "./javascripts/constants.js":
/*!**********************************!*\
  !*** ./javascripts/constants.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
let hueSlider;

/* harmony default export */ __webpack_exports__["default"] = ({
  hueSlider: {
    svgMargin: 20,
    radius: 140,
    trackThickness: 8,
    set(that) { hueSlider = that; },
    get() { return hueSlider; },
  },
  triangleSlider: {
  },
});


/***/ }),

/***/ "./javascripts/createSVG.js":
/*!**********************************!*\
  !*** ./javascripts/createSVG.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return createSVG; });
function createSVG(type,props){
    const el = document.createElementNS('http://www.w3.org/2000/svg', type);
    el.id = createSVG.id++;
    Object.keys(props).forEach(key => {
        el.setAttribute(key,props[key]);
    })
    return el;
}
createSVG.id = 0;

/***/ }),

/***/ "./javascripts/gradientGenerators/conicGradient.js":
/*!*********************************************************!*\
  !*** ./javascripts/gradientGenerators/conicGradient.js ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return conicGradient; });
/* harmony import */ var _webgl_shaders_conicGradient_glsl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../webgl/shaders/conicGradient.glsl */ "./javascripts/webgl/shaders/conicGradient.glsl");
/* harmony import */ var _utils_getPattern__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/getPattern */ "./javascripts/gradientGenerators/utils/getPattern.js");



function conicGradient({
  height,
  width,
  element,
}) {
  function getDims() {
    return element.getBoundingClientRect();
  }
  return Object(_utils_getPattern__WEBPACK_IMPORTED_MODULE_1__["default"])({
    getDims,
    height,
    width,
    script: _webgl_shaders_conicGradient_glsl__WEBPACK_IMPORTED_MODULE_0__["default"],
    staticUniforms: {},
    dynamicUniforms: {
      u_saturation: {
        type: 'uniform1f',
        setter: ((COLOR, PREV) => {
          if (COLOR.hsl.saturation === PREV.hsl.saturation) return false;
          return COLOR.hsl.saturation / 100;
        }),
      },
      u_lightness: {
        type: 'uniform1f',
        setter: ((COLOR, PREV) => {
          if (COLOR.hsl.lightness === PREV.hsl.lightness) return false;
          return COLOR.hsl.lightness / 100;
        }),
      },
    },
  });
}


/***/ }),

/***/ "./javascripts/gradientGenerators/linearGradient.js":
/*!**********************************************************!*\
  !*** ./javascripts/gradientGenerators/linearGradient.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return linearGradient; });
/* harmony import */ var _colorMathConstants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../colorMathConstants */ "./javascripts/colorMathConstants.js");
/* harmony import */ var _webgl_shaders_gradient1D_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../webgl/shaders/gradient1D.glsl */ "./javascripts/webgl/shaders/gradient1D.glsl");
/* harmony import */ var _utils_allEqualExcept__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/allEqualExcept */ "./javascripts/utils/allEqualExcept.js");
/* harmony import */ var _utils_getPattern__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/getPattern */ "./javascripts/gradientGenerators/utils/getPattern.js");





function linearGradient({
  colorSpace,
  channel,
  padding,
  height,
  width,
  element,
}) {
  function getDims() {
    return element.getBoundingClientRect();
  }
  return Object(_utils_getPattern__WEBPACK_IMPORTED_MODULE_3__["default"])({
    getDims,
    height,
    width,
    script: _webgl_shaders_gradient1D_glsl__WEBPACK_IMPORTED_MODULE_1__["default"],
    staticUniforms: {
      u_colorspace: {
        type: 'uniform1i',
        value: _colorMathConstants__WEBPACK_IMPORTED_MODULE_0__["COLOR_SPACE"][colorSpace],
      },
      u_padding: {
        type: 'uniform1f',
        value: padding,
      },
      u_chan: {
        type: 'uniform1i',
        value: _colorMathConstants__WEBPACK_IMPORTED_MODULE_0__["COLOR_ORD"][colorSpace][channel],
      },
    },
    dynamicUniforms: {
      u_color: {
        type: 'uniform3f',
        setter: (COLOR, PREV) => {
          // don't need to update if every other channel in this colorspace is the same.
          if (Object(_utils_allEqualExcept__WEBPACK_IMPORTED_MODULE_2__["default"])(channel, COLOR[colorSpace], PREV[colorSpace])) {
            return false;
          }
          const vecColor = [];
          Object.keys(COLOR[colorSpace]).forEach((k) => {
            vecColor[_colorMathConstants__WEBPACK_IMPORTED_MODULE_0__["COLOR_ORD"][colorSpace][k]] = COLOR[colorSpace][k] / _colorMathConstants__WEBPACK_IMPORTED_MODULE_0__["CHAN_MAX"][colorSpace][k];
          });
          return vecColor;
        },
      },
    },
  });
}


/***/ }),

/***/ "./javascripts/gradientGenerators/triangleGradient.js":
/*!************************************************************!*\
  !*** ./javascripts/gradientGenerators/triangleGradient.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return triangleGradient; });
/* harmony import */ var _colorMethods_pureFromHue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../colorMethods/pureFromHue */ "./javascripts/colorMethods/pureFromHue.js");
/* harmony import */ var _webgl_shaders_triangleGradient_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../webgl/shaders/triangleGradient.glsl */ "./javascripts/webgl/shaders/triangleGradient.glsl");
/* harmony import */ var _utils_getPattern__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/getPattern */ "./javascripts/gradientGenerators/utils/getPattern.js");
/* harmony import */ var _utils_isEqual__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/isEqual */ "./javascripts/utils/isEqual.js");





function triangleGradient({
  height,
  width,
  side,
  margin,
  element,
}) {
  function getDims() {
    const { height: h, width: w } = element.getBoundingClientRect();
    return { width: h, height: w };
  }
  return Object(_utils_getPattern__WEBPACK_IMPORTED_MODULE_2__["default"])({
    getDims,
    height,
    width,
    script: _webgl_shaders_triangleGradient_glsl__WEBPACK_IMPORTED_MODULE_1__["default"],
    staticUniforms: {
      u_side: {
        type: 'uniform1f',
        value: side,
      },
      u_margin: {
        type: 'uniform1f',
        value: margin,
      },
    },
    dynamicUniforms: {
      u_color: {
        type: 'uniform3f',
        setter: (COLOR, PREV) => {
          const pure = Object(_colorMethods_pureFromHue__WEBPACK_IMPORTED_MODULE_0__["default"])(COLOR.hsl.hue % 360);
          const prevPure = Object(_colorMethods_pureFromHue__WEBPACK_IMPORTED_MODULE_0__["default"])(PREV.hsl.hue % 360);
          if (Object(_utils_isEqual__WEBPACK_IMPORTED_MODULE_3__["default"])(pure, prevPure)) return false;
          return ['red', 'green', 'blue'].map((k) => pure[k] / 255);
        },
      },
    },
  });
}


/***/ }),

/***/ "./javascripts/gradientGenerators/utils/getPattern.js":
/*!************************************************************!*\
  !*** ./javascripts/gradientGenerators/utils/getPattern.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return getPattern; });
/* harmony import */ var _webgl_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../webgl/utils */ "./javascripts/webgl/utils.js");
/* harmony import */ var _ColorObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../ColorObject */ "./javascripts/ColorObject.js");
/* harmony import */ var _createSVG__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../createSVG */ "./javascripts/createSVG.js");
/* harmony import */ var _webgl_shaders_basicVertexShader_glsl__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../webgl/shaders/basicVertexShader.glsl */ "./javascripts/webgl/shaders/basicVertexShader.glsl");
/* harmony import */ var _resizeEvents__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../resizeEvents */ "./javascripts/resizeEvents.js");






function getPattern({
  getDims,
  height,
  width,
  staticUniforms,
  dynamicUniforms,
  script,
}) {
  const pattern = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('pattern', {
    height: 1,
    width: 1,
    patternUnits: 'objectBoundingBox',
    patternContentUnits: 'objectBoundingBox',
  });
  pattern.id = `GRADIENT_${getPattern.callCounter++}`;
  const image = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('image', {
    height: 1,
    width: 1,
    x: 0,
    y: 0,
    preserveAspectRatio: 'none',
  });
  pattern.appendChild(image);

  const canvas = document.createElement('canvas');
  canvas.height = height;
  canvas.width = width;

  const gl = canvas.getContext('webgl');
  if (!gl) throw new Error('Could not find WebGL context');

  const vertexShader = Object(_webgl_utils__WEBPACK_IMPORTED_MODULE_0__["createShader"])(gl, gl.VERTEX_SHADER, _webgl_shaders_basicVertexShader_glsl__WEBPACK_IMPORTED_MODULE_3__["default"]);
  const fragmentShader = Object(_webgl_utils__WEBPACK_IMPORTED_MODULE_0__["createShader"])(gl, gl.FRAGMENT_SHADER, script);

  const program = Object(_webgl_utils__WEBPACK_IMPORTED_MODULE_0__["createProgram"])(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const u_res = gl.getUniformLocation(program, 'u_res');
  gl.uniform2f(u_res, gl.canvas.width, gl.canvas.height);

  function resize() {
    setTimeout(() => {
      const { height: h, width: w } = getDims();
      gl.uniform2f(u_res, w, h);
      Object(_webgl_utils__WEBPACK_IMPORTED_MODULE_0__["drawVertices"])(gl, program, 'a_position');
      image.setAttribute('href', canvas.toDataURL());
    });
  }
  _resizeEvents__WEBPACK_IMPORTED_MODULE_4__["default"].subscribe(resize);

  Object.keys(staticUniforms).forEach((name) => {
    const { type, value } = staticUniforms[name];
    const loc = gl.getUniformLocation(program, name);
    gl[type](loc, ...(Array.isArray(value) ? value : [value]));
  });

  _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].subscribe((COLOR, PREV) => {
    const newUniforms = Object.keys(dynamicUniforms).map((name) => {
      const { setter, type } = dynamicUniforms[name];
      const loc = gl.getUniformLocation(program, name);
      return {
        value: setter(COLOR, PREV),
        type,
        loc,
      };
    });
    if (!newUniforms.every((u) => u.value === false)) {
      newUniforms.forEach((u) => {
        // return false when you don't want to update.
        if (u.value === false) return;
        gl[u.type](u.loc, ...(Array.isArray(u.value) ? u.value : [u.value]));
      });
    }

    Object(_webgl_utils__WEBPACK_IMPORTED_MODULE_0__["drawVertices"])(gl, program, 'a_position');
    image.setAttribute('href', canvas.toDataURL());
  });

  // element.setAttribute('fill', `url(#${pattern.id})`);

  return pattern;
}
getPattern.callCounter = 0;


/***/ }),

/***/ "./javascripts/gradientGenerators/xyGradient.js":
/*!******************************************************!*\
  !*** ./javascripts/gradientGenerators/xyGradient.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return xyGradient; });
/* harmony import */ var _webgl_shaders_xyGradient_glsl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../webgl/shaders/xyGradient.glsl */ "./javascripts/webgl/shaders/xyGradient.glsl");
/* harmony import */ var _colorMathConstants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../colorMathConstants */ "./javascripts/colorMathConstants.js");
/* harmony import */ var _utils_getPattern__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/getPattern */ "./javascripts/gradientGenerators/utils/getPattern.js");




function xyGradient({
  height,
  width,
  padding,
  colorSpace,
  xChannel,
  yChannel,
  zChannel,
  element,
}) {
  function getDims() {
    return element.getBoundingClientRect();
  }
  return Object(_utils_getPattern__WEBPACK_IMPORTED_MODULE_2__["default"])({
    getDims,
    height,
    width,
    script: _webgl_shaders_xyGradient_glsl__WEBPACK_IMPORTED_MODULE_0__["default"],
    staticUniforms: {
      u_colorspace: {
        type: 'uniform1i',
        value: _colorMathConstants__WEBPACK_IMPORTED_MODULE_1__["COLOR_SPACE"][colorSpace],
      },
      u_ord: {
        type: 'uniform3i',
        value: [xChannel, yChannel, zChannel]
          .map((c) => _colorMathConstants__WEBPACK_IMPORTED_MODULE_1__["COLOR_ORD"][colorSpace][c]),
      },
      u_padding: {
        type: 'uniform1f',
        value: padding,
      },
    },
    dynamicUniforms: {
      u_z: {
        type: 'uniform1f',
        setter: (COLOR, PREV) => {
          if (COLOR[colorSpace][zChannel] === PREV[colorSpace][zChannel]) return false;
          const color = COLOR[colorSpace][zChannel] / _colorMathConstants__WEBPACK_IMPORTED_MODULE_1__["CHAN_MAX"][colorSpace][zChannel];
          return color;
        },
      },
    },
  });
}


/***/ }),

/***/ "./javascripts/hueSlider.js":
/*!**********************************!*\
  !*** ./javascripts/hueSlider.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return hueSlider; });
/* harmony import */ var _ColorObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColorObject */ "./javascripts/ColorObject.js");
/* harmony import */ var _gradientGenerators_conicGradient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gradientGenerators/conicGradient */ "./javascripts/gradientGenerators/conicGradient.js");
/* harmony import */ var _createSVG__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createSVG */ "./javascripts/createSVG.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "./javascripts/constants.js");
/* harmony import */ var _resizeEvents__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./resizeEvents */ "./javascripts/resizeEvents.js");






let RADIUS = 100;
const huePipH = 12;
const huePipW = 10;
const huePipStroke = 2;

function hueSlider(target) {
  if (!target) target = document.body;

  const thickness = _constants__WEBPACK_IMPORTED_MODULE_3__["default"].hueSlider.trackThickness;
  const marg = _constants__WEBPACK_IMPORTED_MODULE_3__["default"].hueSlider.svgMargin;

  const svg = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('svg', {
    viewBox: `0 0 ${RADIUS * 2 + marg} ${RADIUS * 2 + marg}`,
    height: RADIUS * 2 + marg,
  });

  const input = document.createElement('input');
  input.onblur = () => {
    input.value = _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].color.hsv.hue.toFixed(0);
  };
  input.oninput = () => {
    const v = +input.value;
    if (isNaN(v)) return;
    _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].set('hsv', { hue: v });
  };

  Object.assign(input.style, {
    position: 'absolute',
    transform: 'translateY(50%)',
  });

  _constants__WEBPACK_IMPORTED_MODULE_3__["default"].hueSlider.set(svg);

  const defs = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('defs', {});
  const mask = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('mask', {});

  const maskBG = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('rect', {
    fill: 'white',
  });

  const maskCircle = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('circle', {
    fill: 'black',
  });

  mask.appendChild(maskBG);
  mask.appendChild(maskCircle);
  defs.appendChild(mask);

  const gBody = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('g', { transform: `translate( ${marg / 2} ${marg / 2})` });

  const gHue = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('g', {});

  const hueTrack = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('circle', {

    mask: `url(#${mask.id})`,
    id: 'hue-track',
  });
  const pattern = Object(_gradientGenerators_conicGradient__WEBPACK_IMPORTED_MODULE_1__["default"])({
    height: 400,
    width: 400,
    element: hueTrack,
  });
  defs.appendChild(pattern);
  hueTrack.setAttribute('fill', `url(#${pattern.id})`);

  const gPip = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('g', {
    filter: 'url(#shadow)',
  });
  const pipRect = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('rect', {
    width: huePipW,
    height: huePipH,
    rx: 2,
    fill: 'transparent',
    'stroke-width': 2,
    stroke: 'white',
    'vector-effect': 'non-scaling-stroke',
  });
  gBody.appendChild(gHue);
  gHue.appendChild(hueTrack);

  gBody.appendChild(gPip);
  gPip.appendChild(pipRect);

  target.appendChild(input);
  target.appendChild(svg);
  svg.appendChild(defs);
  svg.appendChild(gBody);

  function resize() {
    const { height } = target.getBoundingClientRect();
    RADIUS = (height - marg) / 2;
    svg.setAttribute('viewBox', `0 0 ${height} ${height}`);
    svg.setAttribute('height', height);
    maskCircle.setAttribute('r', RADIUS - thickness);
    maskCircle.setAttribute('cx', RADIUS);
    maskCircle.setAttribute('cy', RADIUS);
    maskBG.setAttribute('height', RADIUS * 2);
    maskBG.setAttribute('width', RADIUS * 2);
    hueTrack.setAttribute('r', RADIUS);
    hueTrack.setAttribute('cx', RADIUS);
    hueTrack.setAttribute('cy', RADIUS);
    gPip.setAttribute('transform', `translate(${RADIUS} ${RADIUS})`);
    setPipFromColor(_ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].color);
  }
  _resizeEvents__WEBPACK_IMPORTED_MODULE_4__["default"].subscribe(resize);

  function setPipFromColor(COLOR, PREV) {
    if (PREV && COLOR.hsv.hue === PREV.hsv.hue) return;
    const x = -huePipW / 2 + RADIUS - thickness / 2;
    const y = -huePipH / 2;
    pipRect.setAttribute('transform', `rotate(${COLOR.hsv.hue - 90})translate(${x} ${y})`);
    const xRot = Math.sin(COLOR.hsv.hue * Math.PI / 180) * (RADIUS - thickness / 2);
    const yRot = -Math.cos(COLOR.hsv.hue * Math.PI / 180) * (RADIUS - thickness / 2);
    const tx = xRot < 0 ? 'translateX(-100%)' : '';
    const ty = 'translateY(-50%)';
    input.style.transform = `${tx}${ty}`;
    const offset = xRot < 0 ? -huePipH - huePipStroke - 8 : 8;
    input.style.left = `${xRot + target.getBoundingClientRect().height / 2 + offset}px`;
    input.style.top = `${yRot + target.getBoundingClientRect().height / 2}px`;
    if (document.activeElement !== input) input.value = COLOR.hsv.hue.toFixed(0);
  }

  _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(setPipFromColor);

  pipRect.addEventListener('mousedown', (e) => {
    let [x, y] = [e.clientX, e.clientY];
    function move(e) {
      const delx = e.clientX - x; // note that this needs scaling if svg space is diff from user space
      const dely = e.clientY - y;

      const xnew = Math.cos((_ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].color.hsv.hue - 90) / 180 * Math.PI) * (RADIUS - thickness / 2) + delx;
      const ynew = Math.sin((_ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].color.hsv.hue - 90) / 180 * Math.PI) * (RADIUS - thickness / 2) + dely;

      let angle = Math.atan(ynew / xnew);
      if (xnew < 0) angle = Math.PI + angle;

      _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].set('hsv', { hue: angle / Math.PI * 180 + 90 });

      x = e.clientX;
      y = e.clientY;
    }

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', move);
    }, { once: true });
  });
}


/***/ }),

/***/ "./javascripts/index.js":
/*!******************************!*\
  !*** ./javascripts/index.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ColorObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColorObject */ "./javascripts/ColorObject.js");
/* harmony import */ var _hueSlider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hueSlider */ "./javascripts/hueSlider.js");
/* harmony import */ var _triangle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./triangle */ "./javascripts/triangle.js");
/* harmony import */ var _resizeEvents__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./resizeEvents */ "./javascripts/resizeEvents.js");
/* harmony import */ var _xySlider__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./xySlider */ "./javascripts/xySlider.js");
/* harmony import */ var _lightnessBlocks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lightnessBlocks */ "./javascripts/lightnessBlocks.js");
/* harmony import */ var _sliderSet__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./sliderSet */ "./javascripts/sliderSet.js");
/* harmony import */ var _makeColorPalette__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./makeColorPalette */ "./javascripts/makeColorPalette.js");










document.addEventListener('DOMContentLoaded', () => {
  setup();
});

function setup() {
  _resizeEvents__WEBPACK_IMPORTED_MODULE_3__["default"].init();

  Object(_xySlider__WEBPACK_IMPORTED_MODULE_4__["default"])({
    xChannel: 'hue',
    yChannel: 'saturation',
    zChannel: 'lightness',
    colorSpace: 'hsl',
    target: document.getElementById('hsl'),
  });

  Object(_xySlider__WEBPACK_IMPORTED_MODULE_4__["default"])({
    xChannel: 'saturation',
    yChannel: 'value',
    zChannel: 'hue',
    colorSpace: 'hsv',
    target: document.getElementById('hsv'),
  });

  Object(_hueSlider__WEBPACK_IMPORTED_MODULE_1__["default"])(document.getElementById('main'));
  Object(_triangle__WEBPACK_IMPORTED_MODULE_2__["default"])(document.getElementById('main'));

  // buildChannels([
  //     {type: 'rgb', channel: 'red'},
  //     {type: 'rgb', channel: 'green'},
  //     {type: 'rgb', channel: 'blue'},
  // ],{
  //     recipient: document.getElementById('rgb-cmyk')
  // });

  // buildChannels([
  //     {type: 'cmyk', channel: 'cyan'},
  //     {type: 'cmyk', channel: 'magenta'},
  //     {type: 'cmyk', channel: 'yellow'},
  //     {type: 'cmyk', channel: 'black'},
  // ], {
  //     recipient: document.getElementById('rgb-cmyk')
  // });

  // makelightnessBlocks('hsl', {name: 'lightness', max: 100}, document.getElementById('lightness-blocks'));
  // makelightnessBlocks('hsl', {name: 'saturation', max: 100}, document.getElementById('lightness-blocks'));

  // makeColorPalette({ target: document.getElementById('color-palette') });

  _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].set('rgb', { red: 50, green: 100, blue: 200 });
}


/***/ }),

/***/ "./javascripts/lightnessBlocks.js":
/*!****************************************!*\
  !*** ./javascripts/lightnessBlocks.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ColorObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColorObject */ "./javascripts/ColorObject.js");
/* harmony import */ var _createSVG__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./createSVG */ "./javascripts/createSVG.js");
/* harmony import */ var _colorMethods_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./colorMethods/index */ "./javascripts/colorMethods/index.js");





/* harmony default export */ __webpack_exports__["default"] = (function (colorSpace, channel, target){
    const W = 510;
    const N = 16;
    const m = 1;
    const w = (W-(m*(N-1)))/N;
    const wmarg = 10;
    const hmarg = 10;

    const dir = "v";

    if (!target) target = document.body;


    const [ width, height ] = dir === 'v' ? [w + hmarg*2, W + wmarg*2] : [W + hmarg*2, w + wmarg*2]
    

    const svg = Object(_createSVG__WEBPACK_IMPORTED_MODULE_1__["default"])('svg',{
        viewBox: `0 0 ${width} ${height}`
    })

    svg.style.height = '100%';
    svg.style.width = 'auto';

    const body = Object(_createSVG__WEBPACK_IMPORTED_MODULE_1__["default"])('g',{
        transform: `translate(${dir === "v" ? hmarg : wmarg} ${dir === "v" ? wmarg : hmarg})`
    });
    svg.appendChild(body);


    const blocks = []
    for (let i=0; i<N; i++){
        const block = Object(_createSVG__WEBPACK_IMPORTED_MODULE_1__["default"])('rect',{
            height: w,
            width: w,
            [dir === 'v' ? 'y' : 'x']: i * (w + m),
        })
        block.addEventListener('click',()=>{
            _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].set(colorSpace,
                Object.assign(
                    {},
                    _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].color[colorSpace],
                    {[channel.name]: i*[channel.max]/(N-1)}
                )
            )
        })
        body.appendChild(block);
        blocks.push(block);
    }

    const wDel = 0;
    const frame = Object(_createSVG__WEBPACK_IMPORTED_MODULE_1__["default"])('rect',{
        height: w + wDel,
        width: w + wDel,

        fill: 'transparent',
        stroke: 'white',
        'stroke-width': 2,
        filter: 'url(#shadow)',
        rx: 2,
        ry: 2
    });
    body.appendChild(frame);

    _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe((COLOR, PREV) => {
        const inc = (channel.max/(N-1));
        const replacementIndex = Math.round(COLOR[colorSpace][channel.name]/inc);

        for (let i=0; i<N; i++){
            if (i === replacementIndex){
                blocks[i].setAttribute(
                    'fill',
                    `rgb(${COLOR.rgb.red},${COLOR.rgb.green},${COLOR.rgb.blue})`,
                );
                frame.setAttribute(dir === 'v' ? 'y' : 'x', i*(w+m) - wDel/2);
                frame.setAttribute(dir === 'v' ? 'x' : 'y', -wDel/2)
                continue;
            }
            const tempChannel = inc*i;
            const color = _colorMethods_index__WEBPACK_IMPORTED_MODULE_2__["default"].getRGB[colorSpace](
                Object.assign(
                    {},
                    COLOR[colorSpace],
                    {[channel.name]: tempChannel})
                );
            blocks[i].setAttribute(
                'fill',
                `rgb(${color.red},${color.green},${color.blue})`,
            );
            blocks[i].setAttribute('stroke', 'transparent');
        }
    })

    function resize(){
        Object.assign(svg.style, {
            height: target.getBoundingClientRect().height + 'px',
        })
    }
    document.addEventListener('resize', resize);
    resize();

    Object.assign(svg.style, {
        border: 'none',
        borderRadius: 0,
        boxShadow: 'none',
        margin: 'none',
    })
    target.appendChild(svg);
});

/***/ }),

/***/ "./javascripts/makeColorPalette.js":
/*!*****************************************!*\
  !*** ./javascripts/makeColorPalette.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return makeColorPalette; });
/* harmony import */ var _ColorObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColorObject */ "./javascripts/ColorObject.js");
/* harmony import */ var _namedColors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./namedColors */ "./javascripts/namedColors.json");
var _namedColors__WEBPACK_IMPORTED_MODULE_1___namespace = /*#__PURE__*/__webpack_require__.t(/*! ./namedColors */ "./javascripts/namedColors.json", 1);
/* harmony import */ var _colorMethods_hsvFromRGB__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./colorMethods/hsvFromRGB */ "./javascripts/colorMethods/hsvFromRGB.js");








function hexFromRGB(rgb) {
    const color = [
        Math.round(rgb.red).toString(16).split('.')[0],
        Math.round(rgb.green).toString(16).split('.')[0],
        Math.round(rgb.blue).toString(16).split('.')[0]
    ];
    const zeros = '00';
    const result = '#' + color.map(color => zeros.slice(color.length) + color).join('');
    return result;
}

const channels = ['red','green','blue'];


const c1Lookup = {};

function colorNameHSV(name){
    if (c1Lookup[name]){
        return c1Lookup[name];
    }
    c1Lookup[name] = Object(_colorMethods_hsvFromRGB__WEBPACK_IMPORTED_MODULE_2__["default"])({
        red: parseInt(_namedColors__WEBPACK_IMPORTED_MODULE_1__[name].slice(1, 3),16),
        green: parseInt(_namedColors__WEBPACK_IMPORTED_MODULE_1__[name].slice(3, 5),16),
        blue: parseInt(_namedColors__WEBPACK_IMPORTED_MODULE_1__[name].slice(5, 7),16)
    });
    return c1Lookup[name];
}

function closestNamedColor(color){
    let best = null;
    Object.keys(_namedColors__WEBPACK_IMPORTED_MODULE_1__).forEach(k => {
        const c1 = colorNameHSV(k);
    
        const c2 = Object(_colorMethods_hsvFromRGB__WEBPACK_IMPORTED_MODULE_2__["default"])(color);
    
        const hmin = Math.min(c1.hue, c2.hue);
        const hmax = Math.max(c1.hue, c2.hue);
        let hdiff = Math.min(hmax-hmin, hmin+360-hmax);
        hdiff = isNaN(hdiff) ? 0 : hdiff;
        const sdiff = isNaN(c1.saturation - c2.saturation) ? 0 : c1.saturation - c2.saturation;
        const squareSum = (hdiff/360)**2*2 + (sdiff/100)**2 + ((c1.value - c2.value)/100)**2*2;

        if (!best || best.distance > squareSum){
            best = {
                color: k,
                distance: squareSum
            }
        }
    })
    return {
        color: best.color,
        distance: ((1 - Math.sqrt(best.distance/6))*100).toFixed(),
    };
}



function mix(c1, c2, t){
    return {
        red: c1.red + (c2.red - c1.red)*t,
        green: c1.green + (c2.green - c1.green)*t,
        blue: c1.blue + (c2.blue - c1.blue)*t,
    }
}


function isDark(rgb) {
    return .2126*rgb.red + .7152*rgb.green + .0722*rgb.blue < .68*255;
}




const inputStyle = `
    font-size: 14px; 
    width: 32px; 
    color: inherit; 
    text-shadow: inherit; 
    border: none;
`;

const opts = [
    () => {
        const closest = closestNamedColor(_ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].color.rgb)
        return `
            <div style="display: flex; width: 100%; justify-content: space-between">  
            <div class="color-description">
                <div>${closest.color.toUpperCase()}</div>
                <div>${closest.distance}% match</div>
            </div>
            </div>
        `
    },
    () => {
        const { color: { rgb: { red, green, blue } } } = _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"];
        return `
            <div>
            <span style="font-weight: 900; color: inherit;">RGB(</span>
            <input onInput="console.log(event.target.value)" onClick="event.stopPropagation()" style="${inputStyle}" value='${Math.round(red)}'/>, 
            <input onInput="console.log(event.target.value)" onClick="event.stopPropagation()" style="${inputStyle}" value='${Math.round(green)}'/>, 
            <input onInput="console.log(event.target.value)" onClick="event.stopPropagation()" style="${inputStyle}" value='${Math.round(blue)}'/>
            <span style="font-weight: 900; color: inherit;">)</span>
            </div>
        `
    }
]



function makeColorPalette({target}) {
    let showIdx = 0;
    const currentColor = document.createElement('div');
    currentColor.classList.add('current-color');
    currentColor.addEventListener('click',()=>{
        showIdx = (showIdx+1)%opts.length;
        currentColor.innerHTML = opts[showIdx]();
    })

    target.appendChild(currentColor);
    _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(COLOR => {
       const hexColor = hexFromRGB(COLOR.rgb);
       currentColor.style.background = hexColor;
       currentColor.classList.add(isDark(COLOR.rgb) ? 'dark' : 'light');
       currentColor.classList.remove(isDark(COLOR.rgb) ? 'light' : 'dark');
       currentColor.innerHTML = hexColor;
       currentColor.innerHTML = opts[showIdx]();
    })
}

{/* <button class="arrow">&#9664;</button>
 <button class="arrow">&#9654;</button> */}

/***/ }),

/***/ "./javascripts/namedColors.json":
/*!**************************************!*\
  !*** ./javascripts/namedColors.json ***!
  \**************************************/
/*! exports provided: aliceblue, antiquewhite, aqua, aquamarine, azure, beige, bisque, black, blanchedalmond, blue, blueviolet, brown, burlywood, cadetblue, chartreuse, chocolate, coral, cornflowerblue, cornsilk, crimson, cyan, darkblue, darkcyan, darkgoldenrod, darkgray, darkgreen, darkgrey, darkkhaki, darkmagenta, darkolivegreen, darkorange, darkorchid, darkred, darksalmon, darkseagreen, darkslateblue, darkslategray, darkslategrey, darkturquoise, darkviolet, deeppink, deepskyblue, dimgray, dimgrey, dodgerblue, firebrick, floralwhite, forestgreen, fuchsia, gainsboro, ghostwhite, goldenrod, gold, gray, green, greenyellow, grey, honeydew, hotpink, indianred, indigo, ivory, khaki, lavenderblush, lavender, lawngreen, lemonchiffon, lightblue, lightcoral, lightcyan, lightgoldenrodyellow, lightgray, lightgreen, lightgrey, lightpink, lightsalmon, lightseagreen, lightskyblue, lightslategray, lightslategrey, lightsteelblue, lightyellow, lime, limegreen, linen, magenta, maroon, mediumaquamarine, mediumblue, mediumorchid, mediumpurple, mediumseagreen, mediumslateblue, mediumspringgreen, mediumturquoise, mediumvioletred, midnightblue, mintcream, mistyrose, moccasin, navajowhite, navy, oldlace, olive, olivedrab, orange, orangered, orchid, palegoldenrod, palegreen, paleturquoise, palevioletred, papayawhip, peachpuff, peru, pink, plum, powderblue, purple, rebeccapurple, red, rosybrown, royalblue, saddlebrown, salmon, sandybrown, seagreen, seashell, sienna, silver, skyblue, slateblue, slategray, slategrey, snow, springgreen, steelblue, tan, teal, thistle, tomato, turquoise, violet, wheat, white, whitesmoke, yellow, yellowgreen, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"aliceblue\":\"#f0f8ff\",\"antiquewhite\":\"#faebd7\",\"aqua\":\"#00ffff\",\"aquamarine\":\"#7fffd4\",\"azure\":\"#f0ffff\",\"beige\":\"#f5f5dc\",\"bisque\":\"#ffe4c4\",\"black\":\"#000000\",\"blanchedalmond\":\"#ffebcd\",\"blue\":\"#0000ff\",\"blueviolet\":\"#8a2be2\",\"brown\":\"#a52a2a\",\"burlywood\":\"#deb887\",\"cadetblue\":\"#5f9ea0\",\"chartreuse\":\"#7fff00\",\"chocolate\":\"#d2691e\",\"coral\":\"#ff7f50\",\"cornflowerblue\":\"#6495ed\",\"cornsilk\":\"#fff8dc\",\"crimson\":\"#dc143c\",\"cyan\":\"#00ffff\",\"darkblue\":\"#00008b\",\"darkcyan\":\"#008b8b\",\"darkgoldenrod\":\"#b8860b\",\"darkgray\":\"#a9a9a9\",\"darkgreen\":\"#006400\",\"darkgrey\":\"#a9a9a9\",\"darkkhaki\":\"#bdb76b\",\"darkmagenta\":\"#8b008b\",\"darkolivegreen\":\"#556b2f\",\"darkorange\":\"#ff8c00\",\"darkorchid\":\"#9932cc\",\"darkred\":\"#8b0000\",\"darksalmon\":\"#e9967a\",\"darkseagreen\":\"#8fbc8f\",\"darkslateblue\":\"#483d8b\",\"darkslategray\":\"#2f4f4f\",\"darkslategrey\":\"#2f4f4f\",\"darkturquoise\":\"#00ced1\",\"darkviolet\":\"#9400d3\",\"deeppink\":\"#ff1493\",\"deepskyblue\":\"#00bfff\",\"dimgray\":\"#696969\",\"dimgrey\":\"#696969\",\"dodgerblue\":\"#1e90ff\",\"firebrick\":\"#b22222\",\"floralwhite\":\"#fffaf0\",\"forestgreen\":\"#228b22\",\"fuchsia\":\"#ff00ff\",\"gainsboro\":\"#dcdcdc\",\"ghostwhite\":\"#f8f8ff\",\"goldenrod\":\"#daa520\",\"gold\":\"#ffd700\",\"gray\":\"#808080\",\"green\":\"#008000\",\"greenyellow\":\"#adff2f\",\"grey\":\"#808080\",\"honeydew\":\"#f0fff0\",\"hotpink\":\"#ff69b4\",\"indianred\":\"#cd5c5c\",\"indigo\":\"#4b0082\",\"ivory\":\"#fffff0\",\"khaki\":\"#f0e68c\",\"lavenderblush\":\"#fff0f5\",\"lavender\":\"#e6e6fa\",\"lawngreen\":\"#7cfc00\",\"lemonchiffon\":\"#fffacd\",\"lightblue\":\"#add8e6\",\"lightcoral\":\"#f08080\",\"lightcyan\":\"#e0ffff\",\"lightgoldenrodyellow\":\"#fafad2\",\"lightgray\":\"#d3d3d3\",\"lightgreen\":\"#90ee90\",\"lightgrey\":\"#d3d3d3\",\"lightpink\":\"#ffb6c1\",\"lightsalmon\":\"#ffa07a\",\"lightseagreen\":\"#20b2aa\",\"lightskyblue\":\"#87cefa\",\"lightslategray\":\"#778899\",\"lightslategrey\":\"#778899\",\"lightsteelblue\":\"#b0c4de\",\"lightyellow\":\"#ffffe0\",\"lime\":\"#00ff00\",\"limegreen\":\"#32cd32\",\"linen\":\"#faf0e6\",\"magenta\":\"#ff00ff\",\"maroon\":\"#800000\",\"mediumaquamarine\":\"#66cdaa\",\"mediumblue\":\"#0000cd\",\"mediumorchid\":\"#ba55d3\",\"mediumpurple\":\"#9370db\",\"mediumseagreen\":\"#3cb371\",\"mediumslateblue\":\"#7b68ee\",\"mediumspringgreen\":\"#00fa9a\",\"mediumturquoise\":\"#48d1cc\",\"mediumvioletred\":\"#c71585\",\"midnightblue\":\"#191970\",\"mintcream\":\"#f5fffa\",\"mistyrose\":\"#ffe4e1\",\"moccasin\":\"#ffe4b5\",\"navajowhite\":\"#ffdead\",\"navy\":\"#000080\",\"oldlace\":\"#fdf5e6\",\"olive\":\"#808000\",\"olivedrab\":\"#6b8e23\",\"orange\":\"#ffa500\",\"orangered\":\"#ff4500\",\"orchid\":\"#da70d6\",\"palegoldenrod\":\"#eee8aa\",\"palegreen\":\"#98fb98\",\"paleturquoise\":\"#afeeee\",\"palevioletred\":\"#db7093\",\"papayawhip\":\"#ffefd5\",\"peachpuff\":\"#ffdab9\",\"peru\":\"#cd853f\",\"pink\":\"#ffc0cb\",\"plum\":\"#dda0dd\",\"powderblue\":\"#b0e0e6\",\"purple\":\"#800080\",\"rebeccapurple\":\"#663399\",\"red\":\"#ff0000\",\"rosybrown\":\"#bc8f8f\",\"royalblue\":\"#4169e1\",\"saddlebrown\":\"#8b4513\",\"salmon\":\"#fa8072\",\"sandybrown\":\"#f4a460\",\"seagreen\":\"#2e8b57\",\"seashell\":\"#fff5ee\",\"sienna\":\"#a0522d\",\"silver\":\"#c0c0c0\",\"skyblue\":\"#87ceeb\",\"slateblue\":\"#6a5acd\",\"slategray\":\"#708090\",\"slategrey\":\"#708090\",\"snow\":\"#fffafa\",\"springgreen\":\"#00ff7f\",\"steelblue\":\"#4682b4\",\"tan\":\"#d2b48c\",\"teal\":\"#008080\",\"thistle\":\"#d8bfd8\",\"tomato\":\"#ff6347\",\"turquoise\":\"#40e0d0\",\"violet\":\"#ee82ee\",\"wheat\":\"#f5deb3\",\"white\":\"#ffffff\",\"whitesmoke\":\"#f5f5f5\",\"yellow\":\"#ffff00\",\"yellowgreen\":\"#9acd32\"}");

/***/ }),

/***/ "./javascripts/resizeEvents.js":
/*!*************************************!*\
  !*** ./javascripts/resizeEvents.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
class ResizeEvents {
  constructor() {
    this.subscriptions = [];
    window.addEventListener('resize', this.resize.bind(this));
  }

  subscribe(fn) {
    setTimeout(fn);
    window.addEventListener('resize', fn);
  }

  init() {
    this.resize();
  }

  // eslint-disable-next-line class-methods-use-this
  resize() {
    const ooo = document.getElementById('ooo');
    const iii = document.getElementById('iii');
    const bs = document.getElementById('block-sliders');
    const top = document.getElementById('top');
    const main = document.getElementById('main');
    const hsl = document.getElementById('hsl');
    const hsv = document.getElementById('hsv');
    const lb = document.getElementById('lightness-blocks');
    const rc = document.getElementById('right-container');

    const minRatio = 1.6;
    const maxRatio = 1.8;

    const rect = ooo.getBoundingClientRect();
    const container = {
      height: 0,
      width: 0,
    };
    if (rect.width / rect.height > maxRatio) {
      container.height = rect.height;
      container.width = rect.height * maxRatio;
    } else if (rect.width / rect.height < minRatio) {
      container.width = rect.width;
      container.height = rect.width / minRatio;
    } else {
      container.height = rect.height;
      container.width = rect.width;
    }
    iii.style.height = `${container.height}px`;
    iii.style.width = `${container.width}px`;

    const topHeight = (container.height - 20) * 0.6;
    main.style.height = `${topHeight}px`;
    main.style.width = `${topHeight}px`;
    top.style.height = `${topHeight}px`;
    bs.style.height = `${(container.height - 20) * 0.4}px`;
    lb.style.width = `${(container.width - 20) * 0.2}px`;

    const rightWidth = (container.width - 20) * 0.8;
    rc.style.width = `${rightWidth}px`;
    hsl.style.width = `${(rightWidth - 20) * 0.55}px`;
    hsv.style.width = `${(rightWidth - 20) * 0.45}px`;
  }
}

/* harmony default export */ __webpack_exports__["default"] = (new ResizeEvents());


/***/ }),

/***/ "./javascripts/sliderSet.js":
/*!**********************************!*\
  !*** ./javascripts/sliderSet.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return buildChannels; });
/* harmony import */ var _createSVG__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createSVG */ "./javascripts/createSVG.js");
/* harmony import */ var _ColorObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ColorObject */ "./javascripts/ColorObject.js");
/* harmony import */ var _utils_allEqualExcept__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/allEqualExcept */ "./javascripts/utils/allEqualExcept.js");
/* harmony import */ var _colorMethods_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./colorMethods/index */ "./javascripts/colorMethods/index.js");
/* harmony import */ var _resizeEvents__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./resizeEvents */ "./javascripts/resizeEvents.js");








const paramLookup = {
    cyan: 'C',
    magenta: 'M',
    yellow: 'Y',
    black: 'K',
    red: 'R',
    green: 'G',
    blue: 'B'
}

function buildChannels(channels, {
    trackLength = 300,
    trackThickness = 8,
    pipWidth = 12,
    orientation = 'horizontal',
    margin = 24,
    outerMargin = 24,
    spacing = 0,
    recipient
}){

    const HH = outerMargin * 2 + margin * (channels.length-1) + trackThickness*(channels.length);
    const WW = outerMargin * 2 + trackLength;

    const div = document.createElement('div');
    div.style.position = 'relative';
    div.style[orientation === 'horizontal' ? 'width' : 'height'] = trackLength + 2*outerMargin + 2*spacing;
    div.style[orientation === 'horizontal' ? 'height' : 'width'] = channels.length * trackThickness + (channels.length - 1)*margin + 2*outerMargin + 2*spacing;
    div.style.display = 'flex';
    div.style['justify-content'] = 'center';
    div.style['align-items'] = 'flex-start';


    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');
    inputContainer.style.margin = spacing + 'px';
    

    (recipient ? recipient : document.body).appendChild(div);


    const container = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('svg',{
        [orientation === 'horizontal' ? 'width' : 'height']: trackLength + 2*outerMargin,
        [orientation === 'horizontal' ? 'height' : 'width']: channels.length * trackThickness + (channels.length - 1)*margin + 2*outerMargin
    })

    Object.assign(container.style, {
        marign: spacing,
        display: 'block',
        height: 'auto',
        flexShrink: '0',
    });

    container.setAttribute('viewBox', `0 0 ${WW} ${HH}`);

    div.appendChild(container);
    div.appendChild(inputContainer);

    let DIM_RATIO;
    function resetRatio(){
        DIM_RATIO = WW/container.getBoundingClientRect().width;
    }
    _resizeEvents__WEBPACK_IMPORTED_MODULE_4__["default"].subscribe(resetRatio);
 
    channels.forEach((param,i) => {    
        let maxValue;
        switch (param.type){
            case 'rgb':
                maxValue = 255;
                break;
            default:
                maxValue = 100;
        }


        const INPUT_HEIGHT = 24;
        const input = document.createElement('input');
        Object.assign(input.style, {
            height: `${INPUT_HEIGHT}px`,
            display: 'block',
            position: 'absolute',
            top: `${outerMargin/DIM_RATIO + i * (trackThickness + margin)/DIM_RATIO + (trackThickness/2)/DIM_RATIO - INPUT_HEIGHT/2}`,
            margin: 0,
        })


        // const label = document.createElement('label');
        // Object.assign(label.style, {
        //     userSelect: 'none'
        // })

        Object.assign(inputContainer.style, {
            userSelect: 'none',
            height: `${HH/DIM_RATIO}px`,
            position: 'absolute',
            right: '16px',
        })

        // label.innerHTML = paramLookup[param.channel];
        // inputContainer.appendChild(label);
        inputContainer.appendChild(input);
        let lastValid = 0;
        
        _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].subscribe((COLOR, PREV) => {
            lastValid = COLOR[param.type][param.channel];
            const value = Math.round(COLOR[param.type][param.channel] * 10)/10;
            if (document.activeElement !== input) input.value = value.toFixed(1);
        })

        input.addEventListener('input',e => {
            e.preventDefault();
            if (isNaN(+input.value) || +input.value < 0 || +input.value > maxValue) return;
            _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].set(
                param.type,
                { [param.channel]: +input.value }
            )
        })

        input.addEventListener('blur',()=>{
            input.value = lastValid.toFixed(1)
        })

        const gradient = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('linearGradient',{
            [orientation === 'horizontal' ? 'x1' : 'y1' ]: pipWidth/2 + outerMargin,
            [orientation === 'horizontal' ? 'x2' : 'y2' ]: trackLength-pipWidth/2 + outerMargin,
            [orientation === 'horizontal' ? 'y1' : 'x1' ]: 0,
            [orientation === 'horizontal' ? 'y2' : 'x2' ]: 0,
            gradientUnits: 'userSpaceOnUse',
        })

        const stop1 = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('stop',{
            offset: 0,
            'stop-color': 'black', //TODO: initialize
        })

        const stop2 = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('stop',{
            offset: .5,
            'stop-color': 'red', //TODO: initialize
        })

        const stop3 = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('stop',{
            offset: 1,
            'stop-color': 'red', //TODO: initialize
        })

        const track_ = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('rect',{
            [ orientation === 'horizontal' ? 'width' : 'height']: trackLength,
            [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness,
            [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + margin)*i + outerMargin,
            [ orientation === 'horizontal' ? 'x' : 'y']: outerMargin,
            rx: 2,
            fill: `url(#${gradient.id})`
        })

        const pip_ = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('rect',{
            [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness + 2,
            [ orientation === 'horizontal' ? 'width' : 'height']: pipWidth,
            fill: 'transparent',
            [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + margin)*i - 1 + outerMargin,
            stroke: 'white',
            'stroke-width': 2,
            'vector-effect': 'non-scaling-stroke',
            filter: 'url(#shadow)',
            rx: 2
        })

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        gradient.appendChild(stop3);

        container.appendChild(gradient);
        container.appendChild(track_);
        container.appendChild(pip_);

        _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].subscribe((COLOR, PREV)=>{  
            if (
                COLOR[param.type][param.channel] !==
                PREV[param.type][param.channel]
            ) pip_.setAttribute(
                orientation === 'horizontal' ? 'x' : 'y',
                orientation === 'horizontal' ?
                    COLOR[param.type][param.channel]/maxValue*(trackLength-pipWidth) + outerMargin :
                    (1-COLOR[param.type][param.channel]/maxValue)*(trackLength-pipWidth) + outerMargin
            );		

            if (Object(_utils_allEqualExcept__WEBPACK_IMPORTED_MODULE_2__["default"])(
                param.channel,
                COLOR[param.type],
                PREV[param.type],
            )) return;
            

            let left;
            let middle;
            let right;

            const base = COLOR[param.type]
            if (param.type !== 'rgb'){
                left = _colorMethods_index__WEBPACK_IMPORTED_MODULE_3__["default"].getRGB[param.type]({...base, [param.channel]: 0 });
                right = _colorMethods_index__WEBPACK_IMPORTED_MODULE_3__["default"].getRGB[param.type]({...base, [param.channel]: maxValue });
                middle = _colorMethods_index__WEBPACK_IMPORTED_MODULE_3__["default"].getRGB[param.type]({...base, [param.channel]: maxValue/2});
            } else {
                left = { ...base , [param.channel]: 0  }
                right = { ...base , [param.channel]: maxValue }
                middle = { ...base , [param.channel]: maxValue/2 }
            }

        const l = `rgb(${left.red},${left.green},${left.blue})`;
        const m = `rgb(${middle.red},${middle.green},${middle.blue})`;
        const r = `rgb(${right.red},${right.green},${right.blue})`;
        
        
        stop1.setAttribute('stop-color', orientation === "horizontal" ? l : r);
        stop2.setAttribute('stop-color', m);
        stop3.setAttribute('stop-color', orientation === "horizontal" ? r : l);
    })
    
    
    pip_.addEventListener('mousedown',e=>{
        let x = orientation === 'horizontal' ? e.clientX : e.clientY;
        let rawProgress = _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].color[param.type][param.channel];
        
        function move(e){
            const newX = orientation === 'horizontal' ? e.clientX : e.clientY;
            const delx = DIM_RATIO*(orientation === 'horizontal' ? newX - x : x - newX); //note need to scale if svg space is diff from user space;
            rawProgress += delx/(trackLength-pipWidth)*maxValue;
            
            let newVal = Math.min(rawProgress, maxValue);
            newVal = Math.max(newVal, 0);
            _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].set(param.type,{[param.channel]: newVal});
            x = orientation === 'horizontal' ? e.clientX : e.clientY;
        }
        
        document.addEventListener('mousemove',move);
        document.addEventListener('mouseup',()=>{
            document.removeEventListener('mousemove',move);
        },{once:true})	
    })	
})
}

/***/ }),

/***/ "./javascripts/triangle.js":
/*!*********************************!*\
  !*** ./javascripts/triangle.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return make; });
/* harmony import */ var _ColorObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColorObject */ "./javascripts/ColorObject.js");
/* harmony import */ var _colorMethods_triFromRGB__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./colorMethods/triFromRGB */ "./javascripts/colorMethods/triFromRGB.js");
/* harmony import */ var _createSVG__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./createSVG */ "./javascripts/createSVG.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "./javascripts/constants.js");
/* harmony import */ var _gradientGenerators_triangleGradient__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gradientGenerators/triangleGradient */ "./javascripts/gradientGenerators/triangleGradient.js");
/* harmony import */ var _colorMethods_pureFromHue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./colorMethods/pureFromHue */ "./javascripts/colorMethods/pureFromHue.js");
/* harmony import */ var _resizeEvents__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./resizeEvents */ "./javascripts/resizeEvents.js");








const sq3 = Math.sqrt(3);
let pip;
let l1;
let l2;
let l3;
let input1;
let input2;
let input3;

const ratio = sq3 / 2;
const margin = 8;

let SIDE = 400;
let RECT_WIDTH = SIDE + margin * 2;
let RECT_HEIGHT = Math.ceil(SIDE * ratio + margin * 2);
let X_TRANS = -SIDE / 2 / sq3 - margin + 100 / 2;
let Y_TRANS = RECT_WIDTH + (100 - RECT_WIDTH) / 2;
let TRIANGLE_HEIGHT = SIDE * ratio;

// todo we need to rebuild this every time and modify the uniforms to be dynamic
// problem is that ratio of margin to heigth/width will change

function make(target) {
  const container = document.createElement('div');
  Object.assign(container.style, {
    width: `${RECT_WIDTH}px`,
    height: `${RECT_HEIGHT}px`,
  });

  const svg = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('g', {});
  const body = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('g', {});
  const defs = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('defs', {});
  const clip = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('clipPath', {});
  const clippath = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('path', {});
  const r = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('rect', {});

  const pattern = Object(_gradientGenerators_triangleGradient__WEBPACK_IMPORTED_MODULE_4__["default"])({
    element: r,
    width: RECT_WIDTH,
    height: RECT_HEIGHT,
    side: SIDE,
    margin,
  });

  l1 = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('line', {
    stroke: 'white',
    'stroke-width': 0.5,
  });

  l2 = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('line', {
    stroke: 'white',
    'stroke-width': 0.5,
  });

  l3 = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('line', {
    stroke: 'white',
    'stroke-width': 0.5,
  });

  input1 = document.createElement('input');
  input1.addEventListener('input', setChannel('color'));
  input1.addEventListener('blur', setFromLastValid('color'));

  input2 = document.createElement('input');
  input2.addEventListener('input', setChannel('white'));
  input2.addEventListener('blur', setFromLastValid('white'));

  input3 = document.createElement('input');
  input3.addEventListener('input', setChannel('black'));
  input3.addEventListener('blur', setFromLastValid('black'));

  [input1, input2, input3].forEach((i) => {
    Object.assign(i.style, {
      position: 'absolute',
      margin: 0,
    });
  });

  input1.style.transform = 'translateX(-100%)translateY(50%)';
  input2.style.transform = 'translateY(100%)';

  target.appendChild(input1);
  target.appendChild(input2);
  target.appendChild(input3);

  _constants__WEBPACK_IMPORTED_MODULE_3__["default"].hueSlider.get().appendChild(svg);
  svg.appendChild(defs);
  svg.appendChild(body);
  defs.appendChild(pattern);
  defs.appendChild(clip);
  clip.appendChild(clippath);

  r.setAttribute('clip-path', `url(#${clip.id})`);
  r.setAttribute('fill', `url(#${pattern.id})`);
  r.setAttribute('filter', 'url(#shadow2)');
  const g = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('g', {});
  body.appendChild(g);
  g.appendChild(r);

  pip = Object(_createSVG__WEBPACK_IMPORTED_MODULE_2__["default"])('circle', {});
  body.appendChild(l1);
  body.appendChild(l2);
  body.appendChild(l3);
  body.appendChild(pip);

  pip.setAttribute('r', 5);
  pip.setAttribute('cx', margin);
  pip.setAttribute('cy', margin);
  pip.setAttribute('stroke', 'white');
  pip.setAttribute('fill', 'transparent');
  pip.setAttribute('vector-effect', 'non-scaling-stroke');
  pip.setAttribute('filter', 'url(#shadow2)');

  function resize() {
    const { height } = target.getBoundingClientRect();
    // TODO maybe do real math and be less lazy about this
    const radius = document.getElementById('hue-track').r.baseVal.value;
    SIDE = 2 * Math.sin(1 / 3 * Math.PI) * (radius - _constants__WEBPACK_IMPORTED_MODULE_3__["default"].hueSlider.trackThickness) - 2 * margin - 24;

    RECT_WIDTH = SIDE + margin * 2;
    RECT_HEIGHT = Math.ceil(SIDE * ratio + margin * 2);
    X_TRANS = -SIDE / 2 / sq3 - margin + height / 2;
    Y_TRANS = RECT_WIDTH + (height - RECT_WIDTH) / 2;
    TRIANGLE_HEIGHT = SIDE * ratio;

    clippath.setAttribute('d', `
    M ${margin} 0 
    l ${SIDE} 0 
    a ${margin} ${margin} 0 0 1 ${margin * Math.sin(Math.PI / 3)} ${margin + margin * Math.cos(Math.PI / 3)}
    l ${-SIDE / 2} ${SIDE * ratio} 
    a ${margin} ${margin} 0 0 1 ${-margin * 2 * Math.sin(Math.PI / 3)} 0
    l ${-SIDE / 2} ${-SIDE * ratio}
    A ${margin} ${margin} 0 0 1 ${margin} 0
  `);

    r.setAttribute('height', RECT_HEIGHT);
    r.setAttribute('width', RECT_WIDTH);
    setTriangle(_ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].color);

    body.setAttribute('transform', `translate(${X_TRANS} ${Y_TRANS})rotate(-90)`);
  }
  _resizeEvents__WEBPACK_IMPORTED_MODULE_6__["default"].subscribe(resize);

  let lastValidTri = null;

  _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(setTriangle);

  _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe((COLOR) => {
    lastValidTri = Object(_colorMethods_triFromRGB__WEBPACK_IMPORTED_MODULE_1__["default"])(COLOR.rgb);
  });

  function setFromLastValid(channel) {
    return function (e) {
      e.target.value = Math.abs(lastValidTri[channel] * 100).toFixed(1);
    };
  }

  pip.addEventListener('mousedown', setPip);
}

function setPip(e) {
  let x = e.clientX;
  let y = e.clientY;

  const pure = Object(_colorMethods_pureFromHue__WEBPACK_IMPORTED_MODULE_5__["default"])(_ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].color.hsv.hue % 360);
  function move(e) {
    const dely = (e.clientX - x);
    const delx = -(e.clientY - y);

    let xAttempt = pip.cx.baseVal.value + delx;
    let yAttempt = pip.cy.baseVal.value + dely;

    if (yAttempt - margin > SIDE * ratio) {
      // tip of triangle
      yAttempt = SIDE * ratio + margin;
      xAttempt = SIDE / 2 + margin;
    }

    if ((yAttempt - margin) < 0) {
      yAttempt = margin;
    }

    if ((xAttempt - margin) < 0) {
      xAttempt = margin;
    }

    if ((xAttempt - margin) > SIDE) {
      xAttempt = SIDE + margin;
    }

    if ((yAttempt - margin) > (xAttempt - margin) * Math.sqrt(3)) {
      if (-Math.sqrt(3) * dely > delx) {
        yAttempt = (xAttempt - margin) * Math.sqrt(3) + margin;
      } else {
        xAttempt = (yAttempt - margin) / Math.sqrt(3) + margin;
      }
    }

    if ((yAttempt - margin) > (xAttempt - margin - SIDE) * -Math.sqrt(3)) {
      if (Math.sqrt(3) * dely > delx) {
        xAttempt = (yAttempt - margin) / -Math.sqrt(3) + margin + SIDE;
      } else {
        yAttempt = (xAttempt - margin - SIDE) * -Math.sqrt(3) + margin;
      }
    }

    const yy = yAttempt - margin;
    const xx = xAttempt - margin;

    pip.setAttribute('cy', yy + margin);
    pip.setAttribute('cx', xx + margin);

    const top = yy / TRIANGLE_HEIGHT;
    const left = (xx * Math.sqrt(3) - yy) / TRIANGLE_HEIGHT / 2;

    const newColor = {
      red: pure.red * top + 255 * left,
      green: pure.green * top + 255 * left,
      blue: pure.blue * top + 255 * left,
    };

    _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].set('rgb', newColor);

    x = e.clientX;
    y = e.clientY;
  }

  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', move);
  }, { once: true });
}

function setTriangle(COLOR, PREV) {
  const tri = Object(_colorMethods_triFromRGB__WEBPACK_IMPORTED_MODULE_1__["default"])(COLOR.rgb);
  if (!PREV || COLOR.hsv.saturation !== PREV.hsv.saturation || COLOR.hsv.value !== PREV.hsv.value) {
    const y = tri.color * SIDE * ratio;
    // most obvious; move as a percentage of s*ratio units away from x axis.

    const ym = y + margin;

    pip.setAttribute('cy', ym);
    const xP = sq3 / 2 * tri.white * SIDE * ratio;
    // find unit vector with slope perpindicular to sqrt(3), then multiply by s*ratio.
    // this gives a point that is the correct number of units away from the WHITE vertex.
    // Make a line with slope of sqrt(3) intersecting this point using the point-slope formula.
    // Find where this line intersects y = tri.color*s*ratio.
    const yP = -1 / 2 * tri.white * SIDE * ratio;
    const x = (y - yP) / sq3 + xP;
    const xm = x + margin;
    pip.setAttribute('cx', xm);

    l1.setAttribute('y2', ym);
    l1.setAttribute('x1', xm);
    l1.setAttribute('x2', xm);

    const mm1 = margin + 3 * margin / sq3;
    const xx1 = (sq3 * (SIDE + mm1) + 1 / sq3 * (xm) - ym) / (1 / sq3 + sq3);
    const yy1 = -sq3 * (xx1 - (SIDE + mm1));

    const mm2 = margin - sq3 * margin / 2 - 3 / 2 * margin / sq3;
    const xx2 = (1 / sq3 * xm + ym + sq3 * mm2) / (1 / sq3 + sq3);
    const yy2 = sq3 * (xx2 - mm2);

    l2.setAttribute('x1', x + margin);
    l2.setAttribute('y1', y + margin);
    l2.setAttribute('x2', xx1);
    l2.setAttribute('y2', yy1);

    input3.style.left = `${yy1 + X_TRANS}px`;
    input3.style.bottom = `${xx1 + Y_TRANS - RECT_WIDTH}px`;

    input2.style.left = `${yy2 + X_TRANS}px`;
    input2.style.bottom = `${xx2 + Y_TRANS - RECT_WIDTH}px`;

    input1.style.left = `${0 + X_TRANS}px`;
    input1.style.bottom = `${xm + Y_TRANS - RECT_WIDTH}px`;

    if (document.activeElement !== input1) input1.value = Math.abs(tri.color * 100).toFixed(1);
    if (document.activeElement !== input2) input2.value = Math.abs(tri.white * 100).toFixed(1);
    if (document.activeElement !== input3) input3.value = Math.abs(tri.black * 100).toFixed(1);

    l3.setAttribute('x1', x + margin);
    l3.setAttribute('y1', y + margin);
    l3.setAttribute('x2', xx2);
    l3.setAttribute('y2', yy2);
  }
}

function setChannel(channel) {
  return function (e) {
    e.preventDefault();
    if (isNaN(+e.target.value) || +e.target.value > 100 || +e.target.value < 0) return;
    const tri = Object(_colorMethods_triFromRGB__WEBPACK_IMPORTED_MODULE_1__["default"])(_ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].color.rgb);
    const newVal = +e.target.value;
    tri[channel] = 0;
    const denom = Object.values(tri).reduce((a, l) => a + l, 0);
    const newTri = {
      white: (100 - newVal) * (denom ? tri.white / denom : 1),
      color: (100 - newVal) * (denom ? tri.color / denom : 1),
      black: (100 - newVal) * (denom ? tri.black / denom : 1),
    };
    newTri[channel] = newVal;

    const { hue } = _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].color.hsv;
    const rgb = Object(_colorMethods_pureFromHue__WEBPACK_IMPORTED_MODULE_5__["default"])(hue % 360);

    _ColorObject__WEBPACK_IMPORTED_MODULE_0__["default"].set('rgb', {
      red: (rgb.red * newTri.color + 0 * newTri.black + 255 * newTri.white) / 100,
      green: (rgb.green * newTri.color + 0 * newTri.black + 255 * newTri.white) / 100,
      blue: (rgb.blue * newTri.color + 0 * newTri.black + 255 * newTri.white) / 100,
    });
  };
}


/***/ }),

/***/ "./javascripts/utils/allEqualExcept.js":
/*!*********************************************!*\
  !*** ./javascripts/utils/allEqualExcept.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return allEqualExcept; });
function allEqualExcept(key, obj1, obj2){
    const keys = Object.keys(obj1 || {});
    if (Object.keys(obj2 || {}).length !== keys.length) return false;
    for (let i=0; i<keys.length; i++){
        if (key === keys[i]) continue;
        if (obj1[keys[i]] !== obj2[keys[i]]) return false;
    }
    return true;
}

/***/ }),

/***/ "./javascripts/utils/extrema.js":
/*!**************************************!*\
  !*** ./javascripts/utils/extrema.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return extrema; });
function extrema(obj){
	let max = null;
	let min = null;
	Object.keys(obj).forEach(channel => {
		if (!min) min = channel;
		if (!max) max = channel;
		if (obj[channel] < obj[min]) min = channel;
		if (obj[channel] > obj[max]) max = channel;
	});
	return {max, min};
}

/***/ }),

/***/ "./javascripts/utils/isEqual.js":
/*!**************************************!*\
  !*** ./javascripts/utils/isEqual.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return isEqual; });
function isEqual(obj,obj2){
	const keys1 = Object.keys(obj || {});
	const keys2 = Object.keys(obj2 || {});
	if (keys1.length !== keys2.length) return false;
	for (let i=0; i<keys1.length; i++){
		if (obj[keys1[i]] !== obj2[keys1[i]]) return false;
	}
	return true;
}


/***/ }),

/***/ "./javascripts/webgl/shaders/basicVertexShader.glsl":
/*!**********************************************************!*\
  !*** ./javascripts/webgl/shaders/basicVertexShader.glsl ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("// an attribute will receive data from a buffer\nattribute vec4 a_position;\nvarying vec2 v_pos;\n\n// all shaders have a main function\nvoid main() {\n\n    // gl_Position is a special variable a vertex shader\n    // is responsible for setting\n    gl_Position = a_position;\n    v_pos = vec2(a_position);\n}");

/***/ }),

/***/ "./javascripts/webgl/shaders/conicGradient.glsl":
/*!******************************************************!*\
  !*** ./javascripts/webgl/shaders/conicGradient.glsl ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("precision mediump float;\nvarying vec2 v_pos;\nuniform float u_saturation;\nuniform float u_lightness;\n\n\nfloat floatMod(float a, float b){\n    return a - floor(a/b) * b;\n}\n\nvec3 rgb_hsl(vec3 hsl){\n    float C = (1.0 - abs(2.0*hsl.z- 1.0))*hsl.y;\n    float H = hsl.x*6.0;\n    float X = C * (1.0 - abs(floatMod(H, 2.0)-1.0));\n    float m = hsl.z - C/2.0;\n\n    if (H == 6.0 || H < 1.0) {\n        return vec3(C + m, X + m, m);\n    } else if (H < 2.0) {\n        return vec3(X + m, C + m, m);\n    } else if (H < 3.0) {\n        return vec3(m, C + m, X + m);\n    } else if (H < 4.0) {\n        return vec3(m, X + m, C + m);\n    } else if (H < 5.0) {\n        return vec3(X + m, m, C + m);\n    } else {\n        return vec3(C + m, m, X + m);\n    }\n}\n\nfloat frac(float x) {\n    return x - floor(x);\n}\n\nvoid main() {\n    float pi = 3.14159265359;\n\n    float y = v_pos.y;\n    float x = v_pos.x;\n\n    float angle = atan(x/y);\n    if (y < 0.0) angle = pi + angle;\n\tif (x < 0.0 && y >= 0.0) angle = 2.0*pi + angle;\n\n    \n    float hue = angle/(2.0*pi);\n    gl_FragColor = vec4(\n        rgb_hsl(vec3(hue, u_saturation, u_lightness)), \n        1.0\n    );\n}");

/***/ }),

/***/ "./javascripts/webgl/shaders/gradient1D.glsl":
/*!***************************************************!*\
  !*** ./javascripts/webgl/shaders/gradient1D.glsl ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("precision mediump float;\nvarying vec2 v_pos;\nuniform vec2 u_res;\nuniform int u_colorspace;\nuniform int u_chan;\nuniform vec3 u_color;\nuniform float u_padding;\n\nfloat floatMod(float a, float b){\n    return a - floor(a/b) * b;\n}\n\n//HSL u_colorspace == 0\nvec3 rgb_hsl(vec3 hsl){\n    float C = (1.0 - abs(2.0*hsl.z- 1.0))*hsl.y;\n    float H = hsl.x*6.0;\n    float X = C * (1.0 - abs(floatMod(H, 2.0)-1.0));\n    float m = hsl.z - C/2.0;\n\n    if (H == 6.0 || H < 1.0) {\n        return vec3(C + m, X + m, m);\n    } else if (H < 2.0) {\n        return vec3(X + m, C + m, m);\n    } else if (H < 3.0) {\n        return vec3(m, C + m, X + m);\n    } else if (H < 4.0) {\n        return vec3(m, X + m, C + m);\n    } else if (H < 5.0) {\n        return vec3(X + m, m, C + m);\n    } else {\n        return vec3(C + m, m, X + m);\n    }\n}\n\n// //HSV u_colorspace == 1\nvec3 rgb_hsv(vec3 hsv){\n\n    float H = hsv.x*6.0;\n\n\tfloat progress = floatMod(H, 1.0);\n\tif (floatMod(floor(H),2.0) == 1.0){\n\t\tprogress = 1.0 - progress;\n\t};\n\t\n\tfloat maxval = hsv.z;\n\tfloat minval = (1.0 - hsv.y) * maxval;\n\tfloat midval = minval + (maxval - minval)*progress;\n\n    vec3 max2min = vec3(maxval, midval, minval);\n\n    if (H == 6.0 || H < 1.0) {\n        return max2min.rgb;\n    } else if (H < 2.0) {\n        return max2min.grb;\n    } else if (H < 3.0) {\n        return max2min.brg;\n    } else if (H < 4.0) {\n        return max2min.bgr;\n    } else if (H < 5.0) {\n        return max2min.gbr;\n    } else {\n        return max2min.rbg;\n    }\n}\n\n\nvec3 assign(vec3 color, int chan, float new_value) {\n  vec3 new_color = color.xyz;\n  if (chan == 0) {\n      new_color.x = new_value;\n  } else if (chan == 1){\n      new_color.y = new_value;\n  } else if (chan == 2) {\n      new_color.z = new_value;\n  }\n  return new_color;\n}\n\nvoid main() {\n    float val = ((v_pos.y + 1.0)/2.0*u_res.y - u_padding)/(u_res.y-2.0*u_padding);\n    val = min(1.0,val);\n    val = max(0.0,val);\n\n    vec3 new_color = assign(u_color, u_chan, val);\n    if (u_colorspace == 0) {\n        gl_FragColor = vec4(rgb_hsl(new_color),1);\n    } else if (u_colorspace == 1) {\n        gl_FragColor = vec4(rgb_hsv(new_color),1);\n    } else {\n        gl_FragColor = vec4(1,0,0,1);\n    }\n}\n");

/***/ }),

/***/ "./javascripts/webgl/shaders/triangleGradient.glsl":
/*!*********************************************************!*\
  !*** ./javascripts/webgl/shaders/triangleGradient.glsl ***!
  \*********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("precision mediump float;\nvarying vec2 v_pos;\nuniform vec2 u_res;\nuniform vec3 u_color;\nuniform float u_side;\nuniform float u_margin;\n\nfloat distToLine(vec2 slope, vec2 linePoint, vec2 point) {\n  vec2 n = slope/length(slope);\n  vec2 dir = linePoint - point;\n  return length(dir - dot(dir,n)*n);\n}\n\nvec2 mapToLine(vec2 slope, vec2 linePoint, vec2 point) {\n  vec2 n = slope/length(slope);\n  vec2 dir = point - linePoint;\n  return linePoint + dot(dir, n)*n;\n}\n\n\nvec3 tri(vec2 point, vec3 color){\n  vec3 black = vec3(0.0, 0.0, 0.0);\n  vec3 white = vec3(1.0, 1.0, 1.0);\n\n  float sq3 = 1.732050807568877;\n  float ratio = sq3/2.0;\n  vec2 y0 = vec2(0.0, ratio);\n  vec2 slope1 = vec2(1.0,sq3);\n  vec2 slope2 = vec2(-1.0,sq3);\n\n  float top = point.y/ratio;\n  float left = distToLine(slope1,y0,point)/ratio;\n  float right = distToLine(slope2,y0,point)/ratio;\n\n  return top*color + left*white + right*black;\n}\n\nvoid main() {\n  float sq3 = 1.732050807568877;\n  float ratio = sq3/2.0;\n\n  vec2 slope1 = vec2(1.0,sq3);\n  vec2 slope2 = vec2(-1.0,sq3);\n  vec2 y0 = vec2(0.0, ratio);\n\n  float xm = u_margin/u_res.x;\n  float ym = u_margin/u_res.y;\n\n  float x = (v_pos.x/(1.0-2.0*xm))/2.0;\n  float y = (((1.0 - v_pos.y)/2.0) - ym)/(1.0-2.0*ym)*ratio;\n  \n  vec2 point = vec2(x, y);\n\n   if (y < 0.0){\n    point = mapToLine(vec2(1,0),vec2(0,0),point);\n   } else if (y > (x + .5)*sq3 && y > (.5 - x)*sq3) {\n     // above both sides of triangle.\n     // max this out at the color so we don't get channel overflow.\n     gl_FragColor = vec4(u_color,1);\n     return;\n   } else if (y > (x + .5)*sq3) {\n    point = mapToLine(slope1,y0,point);\n   } else if (y > (.5 - x)*sq3) {\n    point = mapToLine(slope2,y0,point);\n   }\n\n  gl_FragColor = vec4(\n    tri(point, u_color),\n    1.0\n  );\n   \n\n   \t// if (y < sq3*x && y < (x-u_side)*-sq3 && y > 0.0){\n    //   gl_FragColor = vec4(top*u_color + left*white + right*black, 1.0);\n    // } else if (y <= 0.0) {\n    //   gl_FragColor = vec4(1,0,0,1);\n \t  //   // gl_FragColor = vec4(x/u_side*white + (1.0-x/u_side)*black, 1.0);\n    // } else if (x > u_side/2.0 && y > 0.0){\n    //   gl_FragColor = vec4(1,0,0,1);\n    //   // float w = min((-(x-u_side)/2.0 + ratio*y)/u_side,1.0);\n    //   // gl_FragColor = vec4((1.0-w)*white + w*u_color, 1.0);\n    // } else {\n    //   gl_FragColor = vec4(1,0,0,1);\n    //   // float w = min((x/2.0 + ratio*y)/u_side, 1.0);\n    //   // gl_FragColor = vec4((1.0-w)*black + w*u_color, 1);\n    // }\n}\n\n");

/***/ }),

/***/ "./javascripts/webgl/shaders/xyGradient.glsl":
/*!***************************************************!*\
  !*** ./javascripts/webgl/shaders/xyGradient.glsl ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("precision mediump float;\nvarying vec2 v_pos;\nuniform vec2 u_res;\nuniform float u_z;\nuniform int u_colorspace;\nuniform ivec3 u_ord;\nuniform float u_padding;\n\nfloat floatMod(float a, float b){\n    return a - floor(a/b) * b;\n}\n\n//HSL u_colorspace == 0\nvec3 rgb_hsl(vec3 hsl){\n    float C = (1.0 - abs(2.0*hsl.z- 1.0))*hsl.y;\n    float H = hsl.x*6.0;\n    float X = C * (1.0 - abs(floatMod(H, 2.0)-1.0));\n    float m = hsl.z - C/2.0;\n\n    if (H == 6.0 || H < 1.0) {\n        return vec3(C + m, X + m, m);\n    } else if (H < 2.0) {\n        return vec3(X + m, C + m, m);\n    } else if (H < 3.0) {\n        return vec3(m, C + m, X + m);\n    } else if (H < 4.0) {\n        return vec3(m, X + m, C + m);\n    } else if (H < 5.0) {\n        return vec3(X + m, m, C + m);\n    } else {\n        return vec3(C + m, m, X + m);\n    }\n}\n\n//HSV u_colorspace == 1\nvec3 rgb_hsv(vec3 hsv){\n\n    float H = hsv.x*6.0;\n\n\tfloat progress = floatMod(H, 1.0);\n\tif (floatMod(floor(H),2.0) == 1.0){\n\t\tprogress = 1.0 - progress;\n\t};\n\t\n\tfloat maxval = hsv.z;\n\tfloat minval = (1.0 - hsv.y) * maxval;\n\tfloat midval = minval + (maxval - minval)*progress;\n\n    vec3 max2min = vec3(maxval, midval, minval);\n\n    if (H == 6.0 || H < 1.0) {\n        return max2min.rgb;\n    } else if (H < 2.0) {\n        return max2min.grb;\n    } else if (H < 3.0) {\n        return max2min.brg;\n    } else if (H < 4.0) {\n        return max2min.bgr;\n    } else if (H < 5.0) {\n        return max2min.gbr;\n    } else {\n        return max2min.rbg;\n    }\n}\n\n\nvec3 swizzle(vec3 channels, ivec3 u_ord) {\n    if (u_ord.x == 0 && u_ord.y == 1 && u_ord.z == 2) {\n        return channels.xyz;\n    } else if (u_ord.x == 0 && u_ord.y == 2 && u_ord.z == 1) {\n        return channels.xzy;\n    } else if (u_ord.x == 1 && u_ord.y == 0 && u_ord.z == 2) {\n        return channels.yxz;\n    } else if (u_ord.x == 1 && u_ord.y == 2 && u_ord.z == 0) {\n        return channels.zxy;\n    } else if (u_ord.x == 2 && u_ord.y == 0 && u_ord.z == 1) {\n        return channels.yzx;\n    } else {\n        return channels.zyx;\n    }\n}\n\nvoid main() {\n    float x = (v_pos.x + 1.0)/2.0*u_res.x - u_padding;\n    x = max(x, 0.0);\n    x = min(x, u_res.x - 2.0*u_padding);\n    \n    float x_unit = x/(u_res.x - 2.0*u_padding);\n\n    float y = (1.0 + v_pos.y)/2.0*u_res.y - u_padding;\n    y = max(y, 0.0);\n    y = min(y, u_res.y - 2.0*u_padding);\n\n    float y_unit = y/(u_res.y - 2.0*u_padding);\n\n    vec3 rgb;\n\n    //manually swizzle the channels\n    vec3 channels = vec3(x_unit, y_unit, u_z);\n \n    vec3 newChannels = swizzle(channels, u_ord);\n\n    if (u_colorspace == 0) {\n        rgb = rgb_hsl(newChannels);\n    } else if (u_colorspace == 1) {\n        rgb = rgb_hsv(newChannels);\n    } else {\n        rgb = vec3(1.0,0.0,0.0);\n    }\n    gl_FragColor = vec4(rgb, 1.0);\n}\n");

/***/ }),

/***/ "./javascripts/webgl/utils.js":
/*!************************************!*\
  !*** ./javascripts/webgl/utils.js ***!
  \************************************/
/*! exports provided: drawVertices, clear, createShader, createProgram */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "drawVertices", function() { return drawVertices; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clear", function() { return clear; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createShader", function() { return createShader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createProgram", function() { return createProgram; });
/* harmony import */ var _shaders_basicVertexShader_glsl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaders/basicVertexShader.glsl */ "./javascripts/webgl/shaders/basicVertexShader.glsl");
/* harmony import */ var _shaders_triangleGradient_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shaders/triangleGradient.glsl */ "./javascripts/webgl/shaders/triangleGradient.glsl");
/* harmony import */ var _shaders_gradient1D_glsl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shaders/gradient1D.glsl */ "./javascripts/webgl/shaders/gradient1D.glsl");




//TODO turn triangleGradient and gradient1D into classes in /gradientGenerators
//TODO create a superclass for gradients
function drawVertices(gl, program, positionAttribute) {
    const position = gl.getAttribLocation(program, positionAttribute);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -1, -1,
        1, -1,
        1,  1,
        1,  1,
        -1, 1,
        -1, -1,
      ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function clear(gl){
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('Could not create shader');

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    gl.deleteShader(shader);
    throw new Error(`Could not create shader: ${gl.getShaderInfoLog(shader)}`)
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    if (!program) throw new Error('Could not create program');
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
      return program;
    }
   
    gl.deleteProgram(program);
    throw new Error(`Could not create program: ${gl.getProgramInfoLog(program)}`);
}

/***/ }),

/***/ "./javascripts/xySlider.js":
/*!*********************************!*\
  !*** ./javascripts/xySlider.js ***!
  \*********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return makeXYSlider; });
/* harmony import */ var _createSVG__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createSVG */ "./javascripts/createSVG.js");
/* harmony import */ var _ColorObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ColorObject */ "./javascripts/ColorObject.js");
/* harmony import */ var _colorMathConstants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./colorMathConstants */ "./javascripts/colorMathConstants.js");
/* harmony import */ var _gradientGenerators_xyGradient__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gradientGenerators/xyGradient */ "./javascripts/gradientGenerators/xyGradient.js");
/* harmony import */ var _gradientGenerators_linearGradient__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gradientGenerators/linearGradient */ "./javascripts/gradientGenerators/linearGradient.js");
/* harmony import */ var _resizeEvents__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./resizeEvents */ "./javascripts/resizeEvents.js");







function makeXYSlider({
  xChannel,
  yChannel,
  zChannel,
  colorSpace,
  trackWidth = 20,
  spaceBetween = 10,
  outerMargin = 20,
  target,
}) {
  const SLIDER_PIP_WIDTH = 22;
  const SLIDER_PIP_HEIGHT = 8;
  const XY_SLIDER_PADDING = 0;
  const DIM_RATIO = 1;
  let lastValid;
  let SVG_HEIGHT = 0;
  let SVG_WIDTH = 0;
  let CONTENT_HEIGHT = 0;
  const CONTENT_WIDTH = 0;
  let XY_WIDTH = 0;

  const xMax = _colorMathConstants__WEBPACK_IMPORTED_MODULE_2__["CHAN_MAX"][colorSpace][xChannel];
  const yMax = _colorMathConstants__WEBPACK_IMPORTED_MODULE_2__["CHAN_MAX"][colorSpace][yChannel];
  const zMax = _colorMathConstants__WEBPACK_IMPORTED_MODULE_2__["CHAN_MAX"][colorSpace][zChannel];

  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'relative',
    height: '100%',
    width: '100%',
  });

  if (!target) target = document.body;

  const xySVG = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('rect', {
    height: CONTENT_HEIGHT,
    width: CONTENT_WIDTH,
    rx: XY_SLIDER_PADDING,
  });
  const xyGradientPattern = Object(_gradientGenerators_xyGradient__WEBPACK_IMPORTED_MODULE_3__["default"])({
    height: 400,
    width: 400,
    padding: XY_SLIDER_PADDING,
    colorSpace,
    xChannel,
    yChannel,
    zChannel,
    element: xySVG,
  });
  xySVG.setAttribute('fill', `url(#${xyGradientPattern.id})`);
  const defs = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('defs', {});

  const svg = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('svg', {
    viewBox: `0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`,
  });

  Object.assign(svg.style, {
    display: 'block',
    flexShrink: 0,
  });

  const body = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('g', {
    transform: `translate(${outerMargin} ${outerMargin})`,
  });

  const pip = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('circle', {
    r: 5,
    stroke: 'white',
    fill: 'transparent',
    filter: 'url(#shadow)',
  });

  const v = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('line', {
    stroke: 'white',
    'stroke-width': 0.5,
  });

  const inputX = document.createElement('input');
  Object.assign(inputX.style, {
    position: 'absolute',
    margin: 0,
    transform: 'translateX(-50%)',
    bottom: 0,
  });
  inputX.addEventListener('input', (e) => {
    e.preventDefault();
    if (isNaN(+inputX.value) || +inputX.value < 0 || +inputX.value > xMax) return;
    _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].set(
      colorSpace,
      { [xChannel]: +inputX.value },
    );
  });
  inputX.addEventListener('blur', () => {
    inputX.value = lastValid.x.toFixed(1);
  });

  const h = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('line', {
    stroke: 'white',
    'stroke-width': 0.5,
  });
  const inputY = document.createElement('input');
  inputY.addEventListener('input', (e) => {
    e.preventDefault();
    if (isNaN(+inputY.value) || +inputY.value < 0 || +inputY.value > yMax) return;
    _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].set(
      colorSpace,
      { [yChannel]: +inputY.value },
    );
  });
  inputY.addEventListener('blur', () => {
    inputY.value = lastValid.y.toFixed(1);
  });

  const inputZ = document.createElement('input');

  const sliderPip = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('rect', {
    height: SLIDER_PIP_HEIGHT,
    width: SLIDER_PIP_WIDTH,
    stroke: 'white',
    filter: 'url(#shadow)',
    fill: 'transparent',
  });

  sliderPip.addEventListener('mousedown', (e) => {
    let y = e.clientY;
    function move(e) {
      const delY = (y - e.clientY) / (CONTENT_HEIGHT - SLIDER_PIP_HEIGHT) * zMax * DIM_RATIO;
      const yAttempt = _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].color[colorSpace][zChannel] + delY;
      let newY = Math.min(zMax, yAttempt);
      newY = Math.max(newY, 0);
      _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].set(colorSpace, {
        [zChannel]: newY,
      });
      if (newY === yAttempt) y = e.clientY;
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', move);
    }, { once: true });
  });

  function zSubscription(COLOR) {
    const y = (1 - (COLOR[colorSpace][zChannel] / zMax)) * (CONTENT_HEIGHT - SLIDER_PIP_HEIGHT);
    sliderPip.setAttribute('y', y);
  }
  _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].subscribe(zSubscription);

  const sliderTrack = Object(_createSVG__WEBPACK_IMPORTED_MODULE_0__["default"])('rect', {
    width: trackWidth,
  });
  const linearGradientPattern = Object(_gradientGenerators_linearGradient__WEBPACK_IMPORTED_MODULE_4__["default"])({
    height: 400,
    width: 1,
    colorSpace,
    channel: zChannel,
    padding: SLIDER_PIP_HEIGHT / 2,
    element: sliderTrack,
  });
  sliderTrack.setAttribute('fill', `url(#${linearGradientPattern.id})`);
  body.appendChild(sliderTrack);
  body.appendChild(sliderPip);

  function resize() {
    const { height, width } = container.getBoundingClientRect();
    SVG_HEIGHT = height;
    SVG_WIDTH = width;
    CONTENT_HEIGHT = SVG_HEIGHT - 2 * outerMargin;
    XY_WIDTH = SVG_WIDTH - 2 * outerMargin - trackWidth - spaceBetween;
    xySVG.setAttribute('height', CONTENT_HEIGHT);
    xySVG.setAttribute('width', XY_WIDTH);
    sliderTrack.setAttribute('x', XY_WIDTH + spaceBetween);
    sliderTrack.setAttribute('height', CONTENT_HEIGHT);
    sliderPip.setAttribute('x', XY_WIDTH + spaceBetween - (SLIDER_PIP_WIDTH - trackWidth) / 2);
    v.setAttribute('y2', CONTENT_HEIGHT);
    h.setAttribute('x2', XY_WIDTH);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.height = `${height}px`;
    svg.style.width = `${width}px`;
    xySubscription(_ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].color);
    zSubscription(_ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].color);
  }
  _resizeEvents__WEBPACK_IMPORTED_MODULE_5__["default"].subscribe(resize);

  function xySubscription(COLOR) {
    lastValid = {
      x: COLOR[colorSpace][xChannel],
      y: COLOR[colorSpace][yChannel],
      z: COLOR[colorSpace][zChannel],
    };

    const xVal = COLOR[colorSpace][xChannel] / xMax * (XY_WIDTH - XY_SLIDER_PADDING * 2) + XY_SLIDER_PADDING;
    const yVal = (1 - COLOR[colorSpace][yChannel] / yMax) * (CONTENT_HEIGHT - XY_SLIDER_PADDING * 2) + XY_SLIDER_PADDING;

    pip.setAttribute('cx', xVal);
    pip.setAttribute('cy', yVal);
    v.setAttribute('x1', xVal);
    v.setAttribute('x2', xVal);
    inputX.style.left = (xVal + outerMargin) / DIM_RATIO;
    if (document.activeElement !== inputX) inputX.value = COLOR[colorSpace][xChannel].toFixed(1);

    h.setAttribute('y1', yVal);
    h.setAttribute('y2', yVal);
    inputY.style.top = (yVal + outerMargin) / DIM_RATIO;
    if (document.activeElement !== inputY) inputY.value = COLOR[colorSpace][yChannel].toFixed(1);

    if (document.activeElement !== inputZ) inputZ.value = COLOR[colorSpace][zChannel].toFixed(1);
  }
  _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].subscribe(xySubscription);

  pip.addEventListener('mousedown', (e) => {
    let x = e.clientX;
    let y = e.clientY;
    function move(e) {
      const delX = (e.clientX - x) / (XY_WIDTH - 2 * XY_SLIDER_PADDING) * DIM_RATIO * xMax;
      const delY = (y - e.clientY) / (CONTENT_HEIGHT - 2 * XY_SLIDER_PADDING) * DIM_RATIO * yMax;
      const rawY = _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].color[colorSpace][yChannel] + delY;
      const rawX = _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].color[colorSpace][xChannel] + delX;

      let nY = Math.max(rawY, 0);
      nY = Math.min(nY, yMax);

      let nX = Math.max(rawX, 0);
      nX = Math.min(nX, xMax);

      _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].set(colorSpace, {
        [xChannel]: nX,
        [yChannel]: nY,
      });

      if (nY === rawY) y = e.clientY;
      // note: the conditional here prevents deltas from being erroneously registered when we're outside of the slider box.
      if (nX === rawX) x = e.clientX;
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', move);
    }, { once: true });
  });

  target.appendChild(container);
  container.appendChild(svg);
  container.appendChild(inputX);
  container.appendChild(inputY);
  container.appendChild(inputZ);
  svg.appendChild(defs);
  svg.appendChild(body);
  body.appendChild(xySVG);
  body.appendChild(v);
  body.appendChild(h);
  body.appendChild(pip);
  defs.appendChild(linearGradientPattern);
  defs.appendChild(xyGradientPattern);

  Object.assign(inputZ.style, {
    position: 'absolute',
    margin: 0,
    right: (outerMargin + trackWidth / 2) / DIM_RATIO,
    top: '10px',
    transform: 'translateX(50%)translateY(-100%)',
  });
  inputZ.addEventListener('input', (e) => {
    e.preventDefault();
    if (isNaN(+inputZ.value) || +inputZ.value < 0 || +inputZ.value > zMax) return;
    _ColorObject__WEBPACK_IMPORTED_MODULE_1__["default"].set(
      colorSpace,
      { [zChannel]: +inputZ.value },
    );
  });
  inputZ.addEventListener('blur', () => {
    inputZ.value = lastValid.z.toFixed(1);
  });

  Object.assign(inputY.style, {
    position: 'absolute',
    margin: 0,
    left: outerMargin / DIM_RATIO,
    transform: 'translateY(-50%)translateX(-100%)',
  });
}


/***/ }),

/***/ "./node_modules/hsluv/hsluv.js":
/*!*************************************!*\
  !*** ./node_modules/hsluv/hsluv.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Generated by Haxe 3.4.4
var hsluv = hsluv || {};
hsluv.Geometry = function() { };
hsluv.Geometry.intersectLineLine = function(a,b) {
	var x = (a.intercept - b.intercept) / (b.slope - a.slope);
	var y = a.slope * x + a.intercept;
	return { x : x, y : y};
};
hsluv.Geometry.distanceFromOrigin = function(point) {
	return Math.sqrt(Math.pow(point.x,2) + Math.pow(point.y,2));
};
hsluv.Geometry.distanceLineFromOrigin = function(line) {
	return Math.abs(line.intercept) / Math.sqrt(Math.pow(line.slope,2) + 1);
};
hsluv.Geometry.perpendicularThroughPoint = function(line,point) {
	var slope = -1 / line.slope;
	var intercept = point.y - slope * point.x;
	return { slope : slope, intercept : intercept};
};
hsluv.Geometry.angleFromOrigin = function(point) {
	return Math.atan2(point.y,point.x);
};
hsluv.Geometry.normalizeAngle = function(angle) {
	var m = 2 * Math.PI;
	return (angle % m + m) % m;
};
hsluv.Geometry.lengthOfRayUntilIntersect = function(theta,line) {
	return line.intercept / (Math.sin(theta) - line.slope * Math.cos(theta));
};
hsluv.Hsluv = function() { };
hsluv.Hsluv.getBounds = function(L) {
	var result = [];
	var sub1 = Math.pow(L + 16,3) / 1560896;
	var sub2 = sub1 > hsluv.Hsluv.epsilon ? sub1 : L / hsluv.Hsluv.kappa;
	var _g = 0;
	while(_g < 3) {
		var c = _g++;
		var m1 = hsluv.Hsluv.m[c][0];
		var m2 = hsluv.Hsluv.m[c][1];
		var m3 = hsluv.Hsluv.m[c][2];
		var _g1 = 0;
		while(_g1 < 2) {
			var t = _g1++;
			var top1 = (284517 * m1 - 94839 * m3) * sub2;
			var top2 = (838422 * m3 + 769860 * m2 + 731718 * m1) * L * sub2 - 769860 * t * L;
			var bottom = (632260 * m3 - 126452 * m2) * sub2 + 126452 * t;
			result.push({ slope : top1 / bottom, intercept : top2 / bottom});
		}
	}
	return result;
};
hsluv.Hsluv.maxSafeChromaForL = function(L) {
	var bounds = hsluv.Hsluv.getBounds(L);
	var min = Infinity;
	var _g = 0;
	while(_g < bounds.length) {
		var bound = bounds[_g];
		++_g;
		var length = hsluv.Geometry.distanceLineFromOrigin(bound);
		min = Math.min(min,length);
	}
	return min;
};
hsluv.Hsluv.maxChromaForLH = function(L,H) {
	var hrad = H / 360 * Math.PI * 2;
	var bounds = hsluv.Hsluv.getBounds(L);
	var min = Infinity;
	var _g = 0;
	while(_g < bounds.length) {
		var bound = bounds[_g];
		++_g;
		var length = hsluv.Geometry.lengthOfRayUntilIntersect(hrad,bound);
		if(length >= 0) {
			min = Math.min(min,length);
		}
	}
	return min;
};
hsluv.Hsluv.dotProduct = function(a,b) {
	var sum = 0;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		sum += a[i] * b[i];
	}
	return sum;
};
hsluv.Hsluv.fromLinear = function(c) {
	if(c <= 0.0031308) {
		return 12.92 * c;
	} else {
		return 1.055 * Math.pow(c,0.416666666666666685) - 0.055;
	}
};
hsluv.Hsluv.toLinear = function(c) {
	if(c > 0.04045) {
		return Math.pow((c + 0.055) / 1.055,2.4);
	} else {
		return c / 12.92;
	}
};
hsluv.Hsluv.xyzToRgb = function(tuple) {
	return [hsluv.Hsluv.fromLinear(hsluv.Hsluv.dotProduct(hsluv.Hsluv.m[0],tuple)),hsluv.Hsluv.fromLinear(hsluv.Hsluv.dotProduct(hsluv.Hsluv.m[1],tuple)),hsluv.Hsluv.fromLinear(hsluv.Hsluv.dotProduct(hsluv.Hsluv.m[2],tuple))];
};
hsluv.Hsluv.rgbToXyz = function(tuple) {
	var rgbl = [hsluv.Hsluv.toLinear(tuple[0]),hsluv.Hsluv.toLinear(tuple[1]),hsluv.Hsluv.toLinear(tuple[2])];
	return [hsluv.Hsluv.dotProduct(hsluv.Hsluv.minv[0],rgbl),hsluv.Hsluv.dotProduct(hsluv.Hsluv.minv[1],rgbl),hsluv.Hsluv.dotProduct(hsluv.Hsluv.minv[2],rgbl)];
};
hsluv.Hsluv.yToL = function(Y) {
	if(Y <= hsluv.Hsluv.epsilon) {
		return Y / hsluv.Hsluv.refY * hsluv.Hsluv.kappa;
	} else {
		return 116 * Math.pow(Y / hsluv.Hsluv.refY,0.333333333333333315) - 16;
	}
};
hsluv.Hsluv.lToY = function(L) {
	if(L <= 8) {
		return hsluv.Hsluv.refY * L / hsluv.Hsluv.kappa;
	} else {
		return hsluv.Hsluv.refY * Math.pow((L + 16) / 116,3);
	}
};
hsluv.Hsluv.xyzToLuv = function(tuple) {
	var X = tuple[0];
	var Y = tuple[1];
	var Z = tuple[2];
	var divider = X + 15 * Y + 3 * Z;
	var varU = 4 * X;
	var varV = 9 * Y;
	if(divider != 0) {
		varU /= divider;
		varV /= divider;
	} else {
		varU = NaN;
		varV = NaN;
	}
	var L = hsluv.Hsluv.yToL(Y);
	if(L == 0) {
		return [0,0,0];
	}
	var U = 13 * L * (varU - hsluv.Hsluv.refU);
	var V = 13 * L * (varV - hsluv.Hsluv.refV);
	return [L,U,V];
};
hsluv.Hsluv.luvToXyz = function(tuple) {
	var L = tuple[0];
	var U = tuple[1];
	var V = tuple[2];
	if(L == 0) {
		return [0,0,0];
	}
	var varU = U / (13 * L) + hsluv.Hsluv.refU;
	var varV = V / (13 * L) + hsluv.Hsluv.refV;
	var Y = hsluv.Hsluv.lToY(L);
	var X = 0 - 9 * Y * varU / ((varU - 4) * varV - varU * varV);
	var Z = (9 * Y - 15 * varV * Y - varV * X) / (3 * varV);
	return [X,Y,Z];
};
hsluv.Hsluv.luvToLch = function(tuple) {
	var L = tuple[0];
	var U = tuple[1];
	var V = tuple[2];
	var C = Math.sqrt(U * U + V * V);
	var H;
	if(C < 0.00000001) {
		H = 0;
	} else {
		var Hrad = Math.atan2(V,U);
		H = Hrad * 180.0 / Math.PI;
		if(H < 0) {
			H = 360 + H;
		}
	}
	return [L,C,H];
};
hsluv.Hsluv.lchToLuv = function(tuple) {
	var L = tuple[0];
	var C = tuple[1];
	var H = tuple[2];
	var Hrad = H / 360.0 * 2 * Math.PI;
	var U = Math.cos(Hrad) * C;
	var V = Math.sin(Hrad) * C;
	return [L,U,V];
};
hsluv.Hsluv.hsluvToLch = function(tuple) {
	var H = tuple[0];
	var S = tuple[1];
	var L = tuple[2];
	if(L > 99.9999999) {
		return [100,0,H];
	}
	if(L < 0.00000001) {
		return [0,0,H];
	}
	var max = hsluv.Hsluv.maxChromaForLH(L,H);
	var C = max / 100 * S;
	return [L,C,H];
};
hsluv.Hsluv.lchToHsluv = function(tuple) {
	var L = tuple[0];
	var C = tuple[1];
	var H = tuple[2];
	if(L > 99.9999999) {
		return [H,0,100];
	}
	if(L < 0.00000001) {
		return [H,0,0];
	}
	var max = hsluv.Hsluv.maxChromaForLH(L,H);
	var S = C / max * 100;
	return [H,S,L];
};
hsluv.Hsluv.hpluvToLch = function(tuple) {
	var H = tuple[0];
	var S = tuple[1];
	var L = tuple[2];
	if(L > 99.9999999) {
		return [100,0,H];
	}
	if(L < 0.00000001) {
		return [0,0,H];
	}
	var max = hsluv.Hsluv.maxSafeChromaForL(L);
	var C = max / 100 * S;
	return [L,C,H];
};
hsluv.Hsluv.lchToHpluv = function(tuple) {
	var L = tuple[0];
	var C = tuple[1];
	var H = tuple[2];
	if(L > 99.9999999) {
		return [H,0,100];
	}
	if(L < 0.00000001) {
		return [H,0,0];
	}
	var max = hsluv.Hsluv.maxSafeChromaForL(L);
	var S = C / max * 100;
	return [H,S,L];
};
hsluv.Hsluv.rgbToHex = function(tuple) {
	var h = "#";
	var _g = 0;
	while(_g < 3) {
		var i = _g++;
		var chan = tuple[i];
		var c = Math.round(chan * 255);
		var digit2 = c % 16;
		var digit1 = (c - digit2) / 16 | 0;
		h += hsluv.Hsluv.hexChars.charAt(digit1) + hsluv.Hsluv.hexChars.charAt(digit2);
	}
	return h;
};
hsluv.Hsluv.hexToRgb = function(hex) {
	hex = hex.toLowerCase();
	var ret = [];
	var _g = 0;
	while(_g < 3) {
		var i = _g++;
		var digit1 = hsluv.Hsluv.hexChars.indexOf(hex.charAt(i * 2 + 1));
		var digit2 = hsluv.Hsluv.hexChars.indexOf(hex.charAt(i * 2 + 2));
		var n = digit1 * 16 + digit2;
		ret.push(n / 255.0);
	}
	return ret;
};
hsluv.Hsluv.lchToRgb = function(tuple) {
	return hsluv.Hsluv.xyzToRgb(hsluv.Hsluv.luvToXyz(hsluv.Hsluv.lchToLuv(tuple)));
};
hsluv.Hsluv.rgbToLch = function(tuple) {
	return hsluv.Hsluv.luvToLch(hsluv.Hsluv.xyzToLuv(hsluv.Hsluv.rgbToXyz(tuple)));
};
hsluv.Hsluv.hsluvToRgb = function(tuple) {
	return hsluv.Hsluv.lchToRgb(hsluv.Hsluv.hsluvToLch(tuple));
};
hsluv.Hsluv.rgbToHsluv = function(tuple) {
	return hsluv.Hsluv.lchToHsluv(hsluv.Hsluv.rgbToLch(tuple));
};
hsluv.Hsluv.hpluvToRgb = function(tuple) {
	return hsluv.Hsluv.lchToRgb(hsluv.Hsluv.hpluvToLch(tuple));
};
hsluv.Hsluv.rgbToHpluv = function(tuple) {
	return hsluv.Hsluv.lchToHpluv(hsluv.Hsluv.rgbToLch(tuple));
};
hsluv.Hsluv.hsluvToHex = function(tuple) {
	return hsluv.Hsluv.rgbToHex(hsluv.Hsluv.hsluvToRgb(tuple));
};
hsluv.Hsluv.hpluvToHex = function(tuple) {
	return hsluv.Hsluv.rgbToHex(hsluv.Hsluv.hpluvToRgb(tuple));
};
hsluv.Hsluv.hexToHsluv = function(s) {
	return hsluv.Hsluv.rgbToHsluv(hsluv.Hsluv.hexToRgb(s));
};
hsluv.Hsluv.hexToHpluv = function(s) {
	return hsluv.Hsluv.rgbToHpluv(hsluv.Hsluv.hexToRgb(s));
};
hsluv.Hsluv.m = [[3.240969941904521,-1.537383177570093,-0.498610760293],[-0.96924363628087,1.87596750150772,0.041555057407175],[0.055630079696993,-0.20397695888897,1.056971514242878]];
hsluv.Hsluv.minv = [[0.41239079926595,0.35758433938387,0.18048078840183],[0.21263900587151,0.71516867876775,0.072192315360733],[0.019330818715591,0.11919477979462,0.95053215224966]];
hsluv.Hsluv.refY = 1.0;
hsluv.Hsluv.refU = 0.19783000664283;
hsluv.Hsluv.refV = 0.46831999493879;
hsluv.Hsluv.kappa = 903.2962962;
hsluv.Hsluv.epsilon = 0.0088564516;
hsluv.Hsluv.hexChars = "0123456789abcdef";
var root = {
    "hsluvToRgb": hsluv.Hsluv.hsluvToRgb,
    "rgbToHsluv": hsluv.Hsluv.rgbToHsluv,
    "hpluvToRgb": hsluv.Hsluv.hpluvToRgb,
    "rgbToHpluv": hsluv.Hsluv.rgbToHpluv,
    "hsluvToHex": hsluv.Hsluv.hsluvToHex,
    "hexToHsluv": hsluv.Hsluv.hexToHsluv,
    "hpluvToHex": hsluv.Hsluv.hpluvToHex,
    "hexToHpluv": hsluv.Hsluv.hexToHpluv,
    "lchToHpluv": hsluv.Hsluv.lchToHpluv,
    "hpluvToLch": hsluv.Hsluv.hpluvToLch,
    "lchToHsluv": hsluv.Hsluv.lchToHsluv,
    "hsluvToLch": hsluv.Hsluv.hsluvToLch,
    "lchToLuv": hsluv.Hsluv.lchToLuv,
    "luvToLch": hsluv.Hsluv.luvToLch,
    "xyzToLuv": hsluv.Hsluv.xyzToLuv,
    "luvToXyz": hsluv.Hsluv.luvToXyz,
    "xyzToRgb": hsluv.Hsluv.xyzToRgb,
    "rgbToXyz": hsluv.Hsluv.rgbToXyz,
    "lchToRgb": hsluv.Hsluv.lchToRgb,
    "rgbToLch": hsluv.Hsluv.rgbToLch
};

module.exports = root;


/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map