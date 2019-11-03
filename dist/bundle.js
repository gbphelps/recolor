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

/***/ "./javascripts/colorMethods/hueFromRGB.js":
/*!************************************************!*\
  !*** ./javascripts/colorMethods/hueFromRGB.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return hueFromRGB; });\n/* harmony import */ var _utils_extrema__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/extrema */ \"./javascripts/utils/extrema.js\");\n\nfunction hueFromRGB(rgb){\n\tconst { max, min } = Object(_utils_extrema__WEBPACK_IMPORTED_MODULE_0__[\"default\"])(rgb);\n\tconst c = rgb[max] - rgb[min];\n\tif (c === 0) return 0;\n\t\n\tlet hue = null\n\tif (max === 'red'){\n\t\thue = ((rgb.green - rgb.blue)/c + 6)%6\n\t} else if (max === 'green') {\n\t\thue = (rgb.blue - rgb.red)/c + 2;\n\t} else if (max === 'blue'){\n\t\thue = (rgb.red - rgb.green)/c + 4;\n\t}\n\t\n\treturn hue/6 * 360;\n}\n\n//# sourceURL=webpack:///./javascripts/colorMethods/hueFromRGB.js?");

/***/ }),

/***/ "./javascripts/colorMethods/rgbFromHSV.js":
/*!************************************************!*\
  !*** ./javascripts/colorMethods/rgbFromHSV.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return rgbFromHSV; });\nfunction rgbFromHSV(hsv){\n\tlet max, min, mid;\n\tif ((hsv.hue + 60)%360 <= 120){\n\t\tmax = 'red';\n\t\t[min, mid] = hsv.hue <= 60 ? ['blue', 'green'] : ['green', 'blue'];\t\n\t} else if (hsv.hue <= 180) {\n\t\tmax = 'green';\n\t\t[min, mid] = hsv.hue <= 120 ? ['blue', 'red'] : ['red', 'blue'] \n\t} else {\n\t\tmax = 'blue';\n\t\t[min, mid] = hsv.hue <= 240 ? ['red', 'green'] : ['green', 'red']\n\t}\n\t\n\tlet progress = (hsv.hue%60) / 60;\n\tif (Math.floor(hsv.hue/60)%2 === 1){\n\t\tprogress = 1 - progress\n\t};\n\t\n\t\n\tconst maxval = 255/100 * hsv.value;\n\tconst minval = (100 - hsv.saturation) * maxval / 100;\n\tconst midval = minval + (maxval - minval)*progress;\n\t\n\treturn {\n\t\t[max]: maxval,\n\t\t[min]: minval,\n\t\t[mid]: midval,\n\t}\n}\n\n//# sourceURL=webpack:///./javascripts/colorMethods/rgbFromHSV.js?");

/***/ }),

/***/ "./javascripts/index.js":
/*!******************************!*\
  !*** ./javascripts/index.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _colorMethods_rgbFromHSV__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./colorMethods/rgbFromHSV */ \"./javascripts/colorMethods/rgbFromHSV.js\");\n/* harmony import */ var _colorMethods_hueFromRGB__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./colorMethods/hueFromRGB */ \"./javascripts/colorMethods/hueFromRGB.js\");\n/* harmony import */ var _utils_extrema__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/extrema */ \"./javascripts/utils/extrema.js\");\n\n\n\n\ndocument.addEventListener('DOMContentLoaded',()=>{\n    setup();\n})\n\n\nclass Color{\n    constructor(){\n        this.color = {\n            red: 0,\n            green: 0,\n            blue: 0,\n            \n            hue: 0,\n            saturation: 100,\n            value: 0,\n        }\n\n        this.subscriptions = [];\n    }\n\t\n\tsubscribe(callback){\n\t\tthis.subscriptions.push(callback);\n\t}\n\t\n\tsetRGB(rgb){\n        Object.assign(this.color, rgb);\n        const {red,green,blue} = this.color;\n        const {max, min} = Object(_utils_extrema__WEBPACK_IMPORTED_MODULE_2__[\"default\"])({red,green,blue});\n        \n        const saturation = this.color[max] === 0 ? 0 : (1-this.color[min]/this.color[max]) * 100;\n        const value = this.color[max]/255 * 100;\n        const hue = Object(_colorMethods_hueFromRGB__WEBPACK_IMPORTED_MODULE_1__[\"default\"])({red, green, blue});\n\t\tconsole.log(hue)\t\n\n\t\tObject.assign(this.color,{hue, saturation, value})\n\t\tconsole.log(this.color)\n\t\tthis.subscriptions.forEach(subscription => subscription(this.color));\n\t}\n\t\n\tsetHSV(channelObject){\n\t\tObject.assign(this.color,channelObject);\n\t\tconst {hue, saturation, value} = this.color;\n\t\t\n\t\tconst newRGB = Object(_colorMethods_rgbFromHSV__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({hue, saturation, value});\n\t\tObject.assign(this.color, newRGB);\n\t\t\n\t\tthis.subscriptions.forEach(subscription => subscription(this.color));\n\t}\n}\n\n\n\n\nconst mainColor = new Color();\nconsole.log(mainColor)\n\n\n\n\n\n\n\nconst width = 300;\nconst height = 100;\n\n\nfunction createSVG(type,props){\n    const el = document.createElementNS('http://www.w3.org/2000/svg', type);\n    el.id = createSVG.id++;\n    Object.keys(props).forEach(key => {\n        el.setAttribute(key,props[key]);\n    })\n    return el;\n}\ncreateSVG.id = 0;\n\nfunction setup(){\n    hueSlider();\n    \n    function buildChannels(channels, {\n        trackLength = 300,\n        trackThickness = 8,\n        pipWidth = 12,\n        orientation = 'horizontal'\n    }={}){\n        const container = createSVG('svg',{\n            height,\n            width,\n        })\n        document.body.appendChild(container);\n        channels.forEach((channel,i) => {    \n            let maxValue, type;\n            switch (channel){\n                case 'red':\n                case 'green':\n                case 'blue':\n                    maxValue = 255;\n                    type = 'rgb';\n                    break;\n                default:\n                    maxValue = 100;\n                    type = 'hsv';\n            }\n\n            const gradient = createSVG('linearGradient',{\n                [orientation === 'horizontal' ? 'x1' : 'y1' ]: pipWidth/2,\n                [orientation === 'horizontal' ? 'x2' : 'y2' ]: trackLength-pipWidth/2,\n                [orientation === 'horizontal' ? 'y1' : 'x1' ]: 0,\n                [orientation === 'horizontal' ? 'y2' : 'x2' ]: 0,\n                gradientUnits: 'userSpaceOnUse',\n            })\n\n            const stop1 = createSVG('stop',{\n                offset: 0,\n                'stop-color': 'black', //TODO: initialize\n            })\n\n            const stop2 = createSVG('stop',{\n                offset: 1,\n                'stop-color': 'red', //TODO: initialize\n            })\n\n            const track_ = createSVG('rect',{\n                [ orientation === 'horizontal' ? 'width' : 'height']: trackLength,\n                [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness,\n                [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + 25)*i,\n                rx: 2,\n                fill: `url(#${gradient.id})`\n            })\n    \n            const pip_ = createSVG('rect',{\n                [ orientation === 'horizontal' ? 'height' : 'width']: trackThickness + 2,\n                [ orientation === 'horizontal' ? 'width' : 'height']: pipWidth,\n                fill: 'transparent',\n                [ orientation === 'horizontal' ? 'y' : 'x']: (trackThickness + 25)*i - 1,\n                stroke: 'white',\n                'stroke-width': 3,\n                'vector-effect': 'non-scaling-stroke',\n                filter: 'url(#shadow)',\n                rx: 2\n            })\n \n            gradient.appendChild(stop1);\n            gradient.appendChild(stop2);\n            container.appendChild(gradient);\n            container.appendChild(track_);\n            container.appendChild(pip_);\n    \n            mainColor.subscribe(COLOR=>{  \n                let left;\n                let right;\n\n                if (type === 'hsv'){\n                    const base = {\n                        hue: COLOR.hue, \n                        saturation: COLOR.saturation, \n                        value: COLOR.value, \n                    }\n\n                    left = new Color();\n                    left.setHSV({ ...base, [channel]: 0 });\n                    left = { \n                        red: left.color.red, \n                        green: left.color.green, \n                        blue: left.color.blue \n                    }\n\n                    right = new Color();\n                    right.setHSV({ ...base, [channel]: maxValue });\n                    right = {\n                        red: right.color.red,\n                        green: right.color.green,\n                        blue: right.color.blue\n                    }\n                } else {\n                    const base = { \n                        red: COLOR.red, \n                        green: COLOR.green, \n                        blue: COLOR.blue \n                    }\n                    left = { ...base , [channel]: 0  }\n                    right = { ...base , [channel]: maxValue }\n                }\n            \n            \n            const l = `rgb(${left.red},${left.green},${left.blue})`;\n            \n            const r = `rgb(${right.red},${right.green},${right.blue})`;\n            \n            \n            stop1.setAttribute('stop-color', orientation === \"horizontal\" ? l : r);\n            stop2.setAttribute('stop-color', orientation === \"horizontal\" ? r : l);\n            pip_.setAttribute(\n                orientation === 'horizontal' ? 'x' : 'y',\n                orientation === 'horizontal' ?\n                    COLOR[channel]/maxValue*(trackLength-pipWidth) :\n                    (1-COLOR[channel]/maxValue)*(trackLength-pipWidth)\n            );\t\t\n        })\n        \n        \n        pip_.addEventListener('mousedown',e=>{\n            let x = orientation === 'horizontal' ? e.clientX : e.clientY;\n            let rawProgress = mainColor.color[channel];\n            \n            function move(e){\n                const newX = orientation === 'horizontal' ? e.clientX : e.clientY;\n                const delx = orientation === 'horizontal' ? newX - x : x - newX; //note need to scale if svg space is diff from user space;\n                rawProgress += delx/(trackLength-pipWidth)*maxValue;\n                \n                let newVal = Math.min(rawProgress, maxValue);\n                newVal = Math.max(newVal, 0);\n            \n                const setter = `set${type.toUpperCase()}`;\n                mainColor[setter]({[channel]: newVal});\n                x = orientation === 'horizontal' ? e.clientX : e.clientY;\n            }\n            \n            document.addEventListener('mousemove',move);\n            document.addEventListener('mouseup',()=>{\n                document.removeEventListener('mousemove',move);\n            },{once:true})\t\n        })\t\n    })\n    }\n    buildChannels.counter = 0;\n    \n    buildChannels(['red','green','blue']);\n    buildChannels(['saturation', 'value'], {trackLength: 100, trackThickness: 20, orientation: 'vertical' });\n}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n//Build Conic Gradient \n\nfunction conicGradient(){\n\tconst c = document.getElementById('c');\n\n\tc.width = 400;\n\tc.height = 400;\n\n\n\tconst ctx = c.getContext('2d');\n\n\tconst img = ctx.createImageData(c.width, c.height);\n\n\n\tfor (let i=0; i<img.data.length/4; i++){\n\t\tlet y = i%c.width;\n\t\tlet x = Math.floor(i/c.width);\n\n\t\tx = c.width/2 - x;\n\t\ty = y - c.height/2;\n\n\t\tlet angle = Math.atan(y/x);\n\t\tif (x < 0) angle = Math.PI + angle;\n\t\tif (y < 0 && x >= 0) angle = 2*Math.PI + angle;\n\n\t\tconst sixth = angle/(Math.PI*2)*6;\n\t\tconst rgba = color(sixth);\n\n\t\tfor (let j=0;j<4;j++) img.data[i*4+j] = rgba[j];\n\t}\n\n\tctx.putImageData(img,0,0);\n\treturn c.toDataURL();\n}\n\n\n\n\nfunction color(sixth){\n\t\tswitch (Math.floor(sixth)){\n\t\t\tcase 0:\n\t\t\t\treturn [255, 255*(sixth%1), 0, 255];\n\t\t\tcase 1:\n\t\t\t\treturn [255 * (1-sixth%1), 255, 0, 255];\n\t\t\tcase 2:\n\t\t\t\treturn [0, 255, 255 * (sixth%1), 255];\n\t\t\tcase 3:\n\t\t\t\treturn [0, 255 * (1-sixth%1), 255, 255];\n\t\t\tcase 4:\n\t\t\t\treturn [255 * (sixth%1), 0, 255, 255];\n\t\t\tcase 5:\n\t\t\t\treturn [255, 0, 255 * (1-sixth%1), 255];\n\t\t}\n\treturn [0,0,0,0]\n}\n\n\n///////////////////////////////////////////////////\n\n//Set Up Hue Slider\n\nfunction hueSlider(){\n    document\n\t    .getElementById('conic-gradient')\n        .setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',conicGradient());\n\n    const RADIUS = 100;\n    const thickness = 8;\n\nfunction set(id,props){\n\tconst el = document.getElementById(id);\n\tObject.keys(props).forEach(key => {\n\t\tel.setAttribute(key, props[key])\n\t})\n}\n\nset('hue-svg',{ viewBox: `0 0 ${RADIUS*2 + 20} ${RADIUS*2 + 20}`, height: RADIUS*2 });\nset('conic-gradient',{ height: 2*RADIUS });\nset('inner-circle',{r: RADIUS- thickness, cx: RADIUS, cy: RADIUS});\nset('conic-gradient-pattern',{viewBox: `0 0 ${RADIUS*2} ${RADIUS*2}`});\nset('mask-background',{height: RADIUS*2, width: RADIUS*2});\nset('hue-track',{r: RADIUS, cx: RADIUS, cy: RADIUS})\n\nconst huePip = document.getElementById('hue-pip');\nconst huePipH = huePip.height.baseVal.value;\nconst huePipW = huePip.width.baseVal.value;\n\nconst pc = document.getElementById('pc');\npc.setAttribute('transform',`translate(${RADIUS} ${RADIUS})`);\nhuePip.setAttribute('transform',`rotate(-90)translate(${-huePipW/2 + RADIUS -thickness/2} ${ -huePipH/2})`)\n\n\n\n\n\n\n\nmainColor.subscribe(COLOR => {\n\thuePip.setAttribute('transform', `rotate(${COLOR.hue - 90})translate(${-huePipW/2 + RADIUS -thickness/2} ${ -huePipH/2})`)\n})\n\nhuePip.addEventListener('mousedown',e=>{\n\t\n\tlet [x,y] = [e.clientX, e.clientY];\n\tfunction move(e){\n\t\t\t\t\t\n\t\tconst delx = e.clientX - x; //note that this needs scaling if svg space is diff from user space\n\t\tconst dely = e.clientY - y;\n\t\t\n\t\tconst xnew = Math.cos((mainColor.color.hue - 90)/180*Math.PI)*(RADIUS-thickness/2) + delx;\n\t\tconst ynew = Math.sin((mainColor.color.hue - 90)/180*Math.PI)*(RADIUS-thickness/2) + dely;\n\t\t\n\t\t\n\t\t\n\t\tlet angle = Math.atan(ynew/xnew);\n\t\tif (xnew < 0) angle = Math.PI + angle;\n\n\t\t\n\n\t\t\n\t\tmainColor.setHSV({hue: angle/Math.PI*180 + 90});\n\t\t\n\t\t\n\t\tx = e.clientX;\n\t\ty = e.clientY;\n\t\t\n\t}\n\t\n\tdocument.addEventListener('mousemove', move);\n\tdocument.addEventListener('mouseup',()=>{\n\t\tdocument.removeEventListener('mousemove', move)\n\t},{once:true})\n})\n\n}\n\n\n\n/////////////////////////////////////////////\n\n//# sourceURL=webpack:///./javascripts/index.js?");

/***/ }),

/***/ "./javascripts/utils/extrema.js":
/*!**************************************!*\
  !*** ./javascripts/utils/extrema.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return extrema; });\nfunction extrema(obj){\n\tlet max = null;\n\tlet min = null;\n\tObject.keys(obj).forEach(channel => {\n\t\tif (!min) min = channel;\n\t\tif (!max) max = channel;\n\t\tif (obj[channel] < obj[min]) min = channel;\n\t\tif (obj[channel] > obj[max]) max = channel;\n\t});\n\treturn {max, min};\n}\n\n//# sourceURL=webpack:///./javascripts/utils/extrema.js?");

/***/ })

/******/ });