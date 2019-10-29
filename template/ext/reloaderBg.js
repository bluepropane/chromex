(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = "g26n");
/******/ })
/************************************************************************/
/******/ ({

/***/ "g26n":
/*!****************************!*\
  !*** ./lib/reloader-bg.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var cce_core_hot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! cce-core/hot */ \"s+cw\");\n/* harmony import */ var cce_core_hot__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(cce_core_hot__WEBPACK_IMPORTED_MODULE_0__);\n\nconsole.log('init bg reloader sdproxy');\n\n//# sourceURL=webpack:///./lib/reloader-bg.js?");

/***/ }),

/***/ "s+cw":
/*!**********************************************************************************************!*\
  !*** /Users/liwei.ong/Projects/others/create-chrome-extension/packages/cce-core/dist/hot.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nconsole.log('Include reloader');\n\nfunction getBrowserContext() {\n  if (typeof window !== 'undefined') {\n    return window;\n  }\n\n  if (typeof document !== 'undefined') {\n    return document;\n  }\n\n  throw new Error('Not in browser context, aborting script');\n}\n\n(async function () {\n  const window = await getBrowserContext();\n  const currentTab = await getCurrentTab();\n  const socket = new window.WebSocket('ws://localhost:8005');\n\n  function getCurrentTab() {\n    return new Promise((res, rej) => {\n      chrome.tabs.query({\n        currentWindow: true,\n        active: true\n      }, function (tabArray) {\n        res(tabArray[0]);\n      });\n    });\n  }\n\n  async function reloadExtension() {\n    console.log('Reloading extension');\n    const extInfo = new Promise(res => chrome.management.getSelf(res));\n\n    if (extInfo.installType === 'development' && extInfo.enabled === true) {\n      await new Promise(res => chrome.management.setEnabled(extInfo.id, false, res));\n      await new Promise(res => chrome.management.setEnabled(extInfo.id, true, res));\n    }\n\n    window.location.reload();\n  }\n\n  socket.addEventListener('open', function (event) {\n    console.log('connection with reloading server established');\n    socket.send(JSON.stringify({\n      type: 'HELLO',\n      id: currentTab && currentTab.id\n    }));\n  });\n  socket.addEventListener('message', function (event) {\n    const msg = JSON.parse(event.data);\n    console.log('Message from server ', msg);\n\n    switch (msg.type) {\n      case 'RELOAD':\n        reloadExtension();\n    }\n  });\n})();\n\n//# sourceURL=webpack:////Users/liwei.ong/Projects/others/create-chrome-extension/packages/cce-core/dist/hot.js?");

/***/ })

/******/ });
});