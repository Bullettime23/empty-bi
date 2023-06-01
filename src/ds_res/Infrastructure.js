(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("bi-internal/utils"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "bi-internal/utils"], factory);
	else if(typeof exports === 'object')
		exports["@luxms/bi-resources"] = factory(require("react"), require("bi-internal/utils"));
	else
		root["@luxms/bi-resources"] = factory(root["react"], root["bi-internal/utils"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__297__, __WEBPACK_EXTERNAL_MODULE__48__) {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 811:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;
/*!
 * content-type
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * RegExp to match *( ";" parameter ) in RFC 7231 sec 3.1.1.1
 *
 * parameter     = token "=" ( token / quoted-string )
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 * quoted-string = DQUOTE *( qdtext / quoted-pair ) DQUOTE
 * qdtext        = HTAB / SP / %x21 / %x23-5B / %x5D-7E / obs-text
 * obs-text      = %x80-FF
 * quoted-pair   = "\" ( HTAB / SP / VCHAR / obs-text )
 */
var PARAM_REGEXP = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g
var TEXT_REGEXP = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/
var TOKEN_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/

/**
 * RegExp to match quoted-pair in RFC 7230 sec 3.2.6
 *
 * quoted-pair = "\" ( HTAB / SP / VCHAR / obs-text )
 * obs-text    = %x80-FF
 */
var QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g

/**
 * RegExp to match chars that must be quoted-pair in RFC 7230 sec 3.2.6
 */
var QUOTE_REGEXP = /([\\"])/g

/**
 * RegExp to match type in RFC 7231 sec 3.1.1.1
 *
 * media-type = type "/" subtype
 * type       = token
 * subtype    = token
 */
var TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/

/**
 * Module exports.
 * @public
 */

__webpack_unused_export__ = format
exports.Q = parse

/**
 * Format object to media type.
 *
 * @param {object} obj
 * @return {string}
 * @public
 */

function format (obj) {
  if (!obj || typeof obj !== 'object') {
    throw new TypeError('argument obj is required')
  }

  var parameters = obj.parameters
  var type = obj.type

  if (!type || !TYPE_REGEXP.test(type)) {
    throw new TypeError('invalid type')
  }

  var string = type

  // append parameters
  if (parameters && typeof parameters === 'object') {
    var param
    var params = Object.keys(parameters).sort()

    for (var i = 0; i < params.length; i++) {
      param = params[i]

      if (!TOKEN_REGEXP.test(param)) {
        throw new TypeError('invalid parameter name')
      }

      string += '; ' + param + '=' + qstring(parameters[param])
    }
  }

  return string
}

/**
 * Parse media type to object.
 *
 * @param {string|object} string
 * @return {Object}
 * @public
 */

function parse (string) {
  if (!string) {
    throw new TypeError('argument string is required')
  }

  // support req/res-like objects as argument
  var header = typeof string === 'object'
    ? getcontenttype(string)
    : string

  if (typeof header !== 'string') {
    throw new TypeError('argument string is required to be a string')
  }

  var index = header.indexOf(';')
  var type = index !== -1
    ? header.substr(0, index).trim()
    : header.trim()

  if (!TYPE_REGEXP.test(type)) {
    throw new TypeError('invalid media type')
  }

  var obj = new ContentType(type.toLowerCase())

  // parse parameters
  if (index !== -1) {
    var key
    var match
    var value

    PARAM_REGEXP.lastIndex = index

    while ((match = PARAM_REGEXP.exec(header))) {
      if (match.index !== index) {
        throw new TypeError('invalid parameter format')
      }

      index += match[0].length
      key = match[1].toLowerCase()
      value = match[2]

      if (value[0] === '"') {
        // remove quotes and escapes
        value = value
          .substr(1, value.length - 2)
          .replace(QESC_REGEXP, '$1')
      }

      obj.parameters[key] = value
    }

    if (index !== header.length) {
      throw new TypeError('invalid parameter format')
    }
  }

  return obj
}

/**
 * Get content-type from req/res objects.
 *
 * @param {object}
 * @return {Object}
 * @private
 */

function getcontenttype (obj) {
  var header

  if (typeof obj.getHeader === 'function') {
    // res-like
    header = obj.getHeader('content-type')
  } else if (typeof obj.headers === 'object') {
    // req-like
    header = obj.headers && obj.headers['content-type']
  }

  if (typeof header !== 'string') {
    throw new TypeError('content-type header is missing from object')
  }

  return header
}

/**
 * Quote a string if necessary.
 *
 * @param {string} val
 * @return {string}
 * @private
 */

function qstring (val) {
  var str = String(val)

  // no need to quote tokens
  if (TOKEN_REGEXP.test(str)) {
    return str
  }

  if (str.length > 0 && !TEXT_REGEXP.test(str)) {
    throw new TypeError('invalid parameter value')
  }

  return '"' + str.replace(QUOTE_REGEXP, '\\$1') + '"'
}

/**
 * Class to represent a content type.
 * @private
 */
function ContentType (type) {
  this.parameters = Object.create(null)
  this.type = type
}


/***/ }),

/***/ 424:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(537);
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(645);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".infrastructure-wrapper{width:100%;display:flex;justify-content:space-between;padding:20px}@keyframes color-change{0%,100%{stroke:#d3d3d3}50%{stroke:crimson}}.svg-wrapper{padding:5px}.svg-wrapper svg{height:150px;width:90px}.svg-wrapper svg *{fill:crimson;color:crimson}.infrastructure .column{display:flex;flex-direction:column;gap:10px}.infrastructure .container{height:160px;width:100px;border:2px solid #708090;border-radius:6px}.infrastructure .container img{height:160px;width:100px}.infrastructure .path{position:absolute;width:fit-content}.infrastructure .path *{animation:color-change 3s linear infinite}", "",{"version":3,"sources":["webpack://./src/ds_res/Infrastructure.scss"],"names":[],"mappings":"AAAA,wBACE,UAAA,CACA,YAAA,CACA,6BAAA,CACA,YAAA,CAGF,wBACE,QAEE,cAAA,CAEF,IACE,cAAA,CAAA,CAIJ,aACE,WAAA,CAEA,iBACE,YAAA,CACA,UAAA,CAGF,mBACE,YAAA,CACA,aAAA,CAKF,wBACE,YAAA,CACA,qBAAA,CACA,QAAA,CAGF,2BACE,YAAA,CACA,WAAA,CACA,wBAAA,CACA,iBAAA,CAGF,+BACE,YAAA,CACA,WAAA,CAGF,sBACE,iBAAA,CACA,iBAAA,CAEA,wBAEE,yCAAA","sourcesContent":[".infrastructure-wrapper {\r\n  width: 100%;\r\n  display: flex;\r\n  justify-content: space-between;\r\n  padding: 20px;\r\n}\r\n\r\n@keyframes color-change {\r\n  0%,\r\n  100% {\r\n    stroke: lightgray;\r\n  }\r\n  50% {\r\n    stroke: crimson;\r\n  }\r\n}\r\n\r\n.svg-wrapper {\r\n  padding: 5px;\r\n\r\n  svg {\r\n    height: 150px;\r\n    width: 90px;\r\n  }\r\n\r\n  svg * {\r\n    fill: crimson;\r\n    color: crimson;\r\n  }\r\n}\r\n\r\n.infrastructure {\r\n  .column {\r\n    display: flex;\r\n    flex-direction: column;\r\n    gap: 10px;\r\n  }\r\n\r\n  .container {\r\n    height: 160px;\r\n    width: 100px;\r\n    border: 2px solid slategray;\r\n    border-radius: 6px;\r\n  }\r\n\r\n  .container img {\r\n    height: 160px;\r\n    width: 100px;\r\n  }\r\n\r\n  .path {\r\n    position: absolute;\r\n    width: fit-content;\r\n\r\n    * {\r\n      // transition: all 1s;\r\n      animation: color-change 3s linear infinite;\r\n    }\r\n  }\r\n}\r\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 645:
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var _i = 0; _i < this.length; _i++) {
        var id = this[_i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i2 = 0; _i2 < modules.length; _i2++) {
      var item = [].concat(modules[_i2]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ 537:
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];

  if (!cssMapping) {
    return content;
  }

  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }

  return [content].join("\n");
};

/***/ }),

/***/ 760:
/***/ ((module) => {

module.exports = "srv\\resources\\ds_res\\assets\\icons\\database-server.svg";

/***/ }),

/***/ 544:
/***/ ((module) => {

module.exports = "srv\\resources\\ds_res\\assets\\icons\\electric-tower.svg";

/***/ }),

/***/ 90:
/***/ ((module) => {

module.exports = "srv\\resources\\ds_res\\assets\\icons\\office.svg";

/***/ }),

/***/ 703:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(414);

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ 697:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) { var throwOnDirectAccess, ReactIs; } else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(703)();
}


/***/ }),

/***/ 414:
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),

/***/ 379:
/***/ ((module) => {

"use strict";


var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ 216:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ 565:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ 795:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ 589:
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ 48:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__48__;

/***/ }),

/***/ 297:
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE__297__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Infrastructure_Infrastructure)
});

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf(subClass, superClass);
}
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(297);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}
;// CONCATENATED MODULE: ./node_modules/tslib/tslib.es6.js
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};

function __runInitializers(thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};

function __propKey(x) {
    return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});

function __exportStar(m, o) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/** @deprecated */
function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
    if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
    return typeof state === "function" ? receiver === state : state.has(receiver);
}

// EXTERNAL MODULE: ./node_modules/content-type/index.js
var content_type = __webpack_require__(811);
;// CONCATENATED MODULE: ./node_modules/@tanem/svg-injector/dist/svg-injector.esm.js



var cache = new Map();

var cloneSvg = function cloneSvg(sourceSvg) {
  return sourceSvg.cloneNode(true);
};

var isLocal = function isLocal() {
  return window.location.protocol === 'file:';
};

var makeAjaxRequest = function makeAjaxRequest(url, httpRequestWithCredentials, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    try {
      if (!/\.svg/i.test(url) && httpRequest.readyState === 2) {
        var contentType = httpRequest.getResponseHeader('Content-Type');
        if (!contentType) {
          throw new Error('Content type not found');
        }
        var type = (0,content_type/* parse */.Q)(contentType).type;
        if (!(type === 'image/svg+xml' || type === 'text/plain')) {
          throw new Error("Invalid content type: ".concat(type));
        }
      }
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 404 || httpRequest.responseXML === null) {
          throw new Error(isLocal() ? 'Note: SVG injection ajax calls do not work locally without ' + 'adjusting security settings in your browser. Or consider ' + 'using a local webserver.' : 'Unable to load SVG file: ' + url);
        }
        if (httpRequest.status === 200 || isLocal() && httpRequest.status === 0) {
          callback(null, httpRequest);
        } else {
          throw new Error('There was a problem injecting the SVG: ' + httpRequest.status + ' ' + httpRequest.statusText);
        }
      }
    } catch (error) {
      httpRequest.abort();
      if (error instanceof Error) {
        callback(error, httpRequest);
      } else {
        throw error;
      }
    }
  };
  httpRequest.open('GET', url);
  httpRequest.withCredentials = httpRequestWithCredentials;
  if (httpRequest.overrideMimeType) {
    httpRequest.overrideMimeType('text/xml');
  }
  httpRequest.send();
};

var requestQueue = {};
var queueRequest = function queueRequest(url, callback) {
  requestQueue[url] = requestQueue[url] || [];
  requestQueue[url].push(callback);
};
var processRequestQueue = function processRequestQueue(url) {
  var _loop_1 = function _loop_1(i, len) {
    setTimeout(function () {
      if (Array.isArray(requestQueue[url])) {
        var cacheValue = cache.get(url);
        var callback = requestQueue[url][i];
        if (cacheValue instanceof SVGSVGElement) {
          callback(null, cloneSvg(cacheValue));
        }
        if (cacheValue instanceof Error) {
          callback(cacheValue);
        }
        if (i === requestQueue[url].length - 1) {
          delete requestQueue[url];
        }
      }
    }, 0);
  };
  for (var i = 0, len = requestQueue[url].length; i < len; i++) {
    _loop_1(i);
  }
};

var loadSvgCached = function loadSvgCached(url, httpRequestWithCredentials, callback) {
  if (cache.has(url)) {
    var cacheValue = cache.get(url);
    if (cacheValue === undefined) {
      queueRequest(url, callback);
      return;
    }
    if (cacheValue instanceof SVGSVGElement) {
      callback(null, cloneSvg(cacheValue));
      return;
    }
  }
  cache.set(url, undefined);
  queueRequest(url, callback);
  makeAjaxRequest(url, httpRequestWithCredentials, function (error, httpRequest) {
    var _a;
    if (error) {
      cache.set(url, error);
    } else if (((_a = httpRequest.responseXML) === null || _a === void 0 ? void 0 : _a.documentElement) instanceof SVGSVGElement) {
      cache.set(url, httpRequest.responseXML.documentElement);
    }
    processRequestQueue(url);
  });
};

var loadSvgUncached = function loadSvgUncached(url, httpRequestWithCredentials, callback) {
  makeAjaxRequest(url, httpRequestWithCredentials, function (error, httpRequest) {
    var _a;
    if (error) {
      callback(error);
    } else if (((_a = httpRequest.responseXML) === null || _a === void 0 ? void 0 : _a.documentElement) instanceof SVGSVGElement) {
      callback(null, httpRequest.responseXML.documentElement);
    }
  });
};

var idCounter = 0;
var uniqueId = function uniqueId() {
  return ++idCounter;
};

var injectedElements = [];
var ranScripts = {};
var svgNamespace = 'http://www.w3.org/2000/svg';
var xlinkNamespace = 'http://www.w3.org/1999/xlink';
var injectElement = function injectElement(el, evalScripts, renumerateIRIElements, cacheRequests, httpRequestWithCredentials, beforeEach, callback) {
  var elUrl = el.getAttribute('data-src') || el.getAttribute('src');
  if (!elUrl) {
    callback(new Error('Invalid data-src or src attribute'));
    return;
  }
  if (injectedElements.indexOf(el) !== -1) {
    injectedElements.splice(injectedElements.indexOf(el), 1);
    el = null;
    return;
  }
  injectedElements.push(el);
  el.setAttribute('src', '');
  var loadSvg = cacheRequests ? loadSvgCached : loadSvgUncached;
  loadSvg(elUrl, httpRequestWithCredentials, function (error, svg) {
    if (!svg) {
      injectedElements.splice(injectedElements.indexOf(el), 1);
      el = null;
      callback(error);
      return;
    }
    var elId = el.getAttribute('id');
    if (elId) {
      svg.setAttribute('id', elId);
    }
    var elTitle = el.getAttribute('title');
    if (elTitle) {
      svg.setAttribute('title', elTitle);
    }
    var elWidth = el.getAttribute('width');
    if (elWidth) {
      svg.setAttribute('width', elWidth);
    }
    var elHeight = el.getAttribute('height');
    if (elHeight) {
      svg.setAttribute('height', elHeight);
    }
    var mergedClasses = Array.from(new Set(__spreadArray(__spreadArray(__spreadArray([], (svg.getAttribute('class') || '').split(' '), true), ['injected-svg'], false), (el.getAttribute('class') || '').split(' '), true))).join(' ').trim();
    svg.setAttribute('class', mergedClasses);
    var elStyle = el.getAttribute('style');
    if (elStyle) {
      svg.setAttribute('style', elStyle);
    }
    svg.setAttribute('data-src', elUrl);
    var elData = [].filter.call(el.attributes, function (at) {
      return /^data-\w[\w-]*$/.test(at.name);
    });
    Array.prototype.forEach.call(elData, function (dataAttr) {
      if (dataAttr.name && dataAttr.value) {
        svg.setAttribute(dataAttr.name, dataAttr.value);
      }
    });
    if (renumerateIRIElements) {
      var iriElementsAndProperties_1 = {
        clipPath: ['clip-path'],
        'color-profile': ['color-profile'],
        cursor: ['cursor'],
        filter: ['filter'],
        linearGradient: ['fill', 'stroke'],
        marker: ['marker', 'marker-start', 'marker-mid', 'marker-end'],
        mask: ['mask'],
        path: [],
        pattern: ['fill', 'stroke'],
        radialGradient: ['fill', 'stroke']
      };
      var element_1;
      var elements_1;
      var properties_1;
      var currentId_1;
      var newId_1;
      Object.keys(iriElementsAndProperties_1).forEach(function (key) {
        element_1 = key;
        properties_1 = iriElementsAndProperties_1[key];
        elements_1 = svg.querySelectorAll(element_1 + '[id]');
        var _loop_1 = function _loop_1(a, elementsLen) {
          currentId_1 = elements_1[a].id;
          newId_1 = currentId_1 + '-' + uniqueId();
          var referencingElements;
          Array.prototype.forEach.call(properties_1, function (property) {
            referencingElements = svg.querySelectorAll('[' + property + '*="' + currentId_1 + '"]');
            for (var b = 0, referencingElementLen = referencingElements.length; b < referencingElementLen; b++) {
              var attrValue = referencingElements[b].getAttribute(property);
              if (attrValue && !attrValue.match(new RegExp('url\\("?#' + currentId_1 + '"?\\)'))) {
                continue;
              }
              referencingElements[b].setAttribute(property, 'url(#' + newId_1 + ')');
            }
          });
          var allLinks = svg.querySelectorAll('[*|href]');
          var links = [];
          for (var c = 0, allLinksLen = allLinks.length; c < allLinksLen; c++) {
            var href = allLinks[c].getAttributeNS(xlinkNamespace, 'href');
            if (href && href.toString() === '#' + elements_1[a].id) {
              links.push(allLinks[c]);
            }
          }
          for (var d = 0, linksLen = links.length; d < linksLen; d++) {
            links[d].setAttributeNS(xlinkNamespace, 'href', '#' + newId_1);
          }
          elements_1[a].id = newId_1;
        };
        for (var a = 0, elementsLen = elements_1.length; a < elementsLen; a++) {
          _loop_1(a);
        }
      });
    }
    svg.removeAttribute('xmlns:a');
    var scripts = svg.querySelectorAll('script');
    var scriptsToEval = [];
    var script;
    var scriptType;
    for (var i = 0, scriptsLen = scripts.length; i < scriptsLen; i++) {
      scriptType = scripts[i].getAttribute('type');
      if (!scriptType || scriptType === 'application/ecmascript' || scriptType === 'application/javascript' || scriptType === 'text/javascript') {
        script = scripts[i].innerText || scripts[i].textContent;
        if (script) {
          scriptsToEval.push(script);
        }
        svg.removeChild(scripts[i]);
      }
    }
    if (scriptsToEval.length > 0 && (evalScripts === 'always' || evalScripts === 'once' && !ranScripts[elUrl])) {
      for (var l = 0, scriptsToEvalLen = scriptsToEval.length; l < scriptsToEvalLen; l++) {
        new Function(scriptsToEval[l])(window);
      }
      ranScripts[elUrl] = true;
    }
    var styleTags = svg.querySelectorAll('style');
    Array.prototype.forEach.call(styleTags, function (styleTag) {
      styleTag.textContent += '';
    });
    svg.setAttribute('xmlns', svgNamespace);
    svg.setAttribute('xmlns:xlink', xlinkNamespace);
    beforeEach(svg);
    if (!el.parentNode) {
      injectedElements.splice(injectedElements.indexOf(el), 1);
      el = null;
      callback(new Error('Parent node is null'));
      return;
    }
    el.parentNode.replaceChild(svg, el);
    injectedElements.splice(injectedElements.indexOf(el), 1);
    el = null;
    callback(null, svg);
  });
};

var SVGInjector = function SVGInjector(elements, _a) {
  var _b = _a === void 0 ? {} : _a,
    _c = _b.afterAll,
    afterAll = _c === void 0 ? function () {
      return undefined;
    } : _c,
    _d = _b.afterEach,
    afterEach = _d === void 0 ? function () {
      return undefined;
    } : _d,
    _e = _b.beforeEach,
    beforeEach = _e === void 0 ? function () {
      return undefined;
    } : _e,
    _f = _b.cacheRequests,
    cacheRequests = _f === void 0 ? true : _f,
    _g = _b.evalScripts,
    evalScripts = _g === void 0 ? 'never' : _g,
    _h = _b.httpRequestWithCredentials,
    httpRequestWithCredentials = _h === void 0 ? false : _h,
    _j = _b.renumerateIRIElements,
    renumerateIRIElements = _j === void 0 ? true : _j;
  if (elements && 'length' in elements) {
    var elementsLoaded_1 = 0;
    for (var i = 0, j = elements.length; i < j; i++) {
      injectElement(elements[i], evalScripts, renumerateIRIElements, cacheRequests, httpRequestWithCredentials, beforeEach, function (error, svg) {
        afterEach(error, svg);
        if (elements && 'length' in elements && elements.length === ++elementsLoaded_1) {
          afterAll(elementsLoaded_1);
        }
      });
    }
  } else if (elements) {
    injectElement(elements, evalScripts, renumerateIRIElements, cacheRequests, httpRequestWithCredentials, beforeEach, function (error, svg) {
      afterEach(error, svg);
      afterAll(1);
      elements = null;
    });
  } else {
    afterAll(0);
  }
};


//# sourceMappingURL=svg-injector.esm.js.map

// EXTERNAL MODULE: ./node_modules/prop-types/index.js
var prop_types = __webpack_require__(697);
;// CONCATENATED MODULE: ./node_modules/react-svg/dist/react-svg.esm.js







// Hat-tip: https://github.com/mui/material-ui/tree/master/packages/mui-utils/src.
var ownerWindow = function ownerWindow(node) {
  var doc = (node == null ? void 0 : node.ownerDocument) || document;
  return doc.defaultView || window;
};

// Hat-tip: https://github.com/developit/preact-compat/blob/master/src/index.js#L402.
var shallowDiffers = function shallowDiffers(a, b) {
  for (var i in a) {
    if (!(i in b)) {
      return true;
    }
  }
  for (var _i in b) {
    if (a[_i] !== b[_i]) {
      return true;
    }
  }
  return false;
};

var _excluded = ["afterInjection", "beforeInjection", "desc", "evalScripts", "fallback", "httpRequestWithCredentials", "loading", "renumerateIRIElements", "src", "title", "useRequestCache", "wrapper"];
var react_svg_esm_svgNamespace = 'http://www.w3.org/2000/svg';
var react_svg_esm_xlinkNamespace = 'http://www.w3.org/1999/xlink';
var ReactSVG = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ReactSVG, _React$Component);
  function ReactSVG() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _React$Component.call.apply(_React$Component, [this].concat(args)) || this;
    _this.initialState = {
      hasError: false,
      isLoading: true
    };
    _this.state = _this.initialState;
    _this._isMounted = false;
    _this.reactWrapper = void 0;
    _this.nonReactWrapper = void 0;
    _this.refCallback = function (reactWrapper) {
      _this.reactWrapper = reactWrapper;
    };
    return _this;
  }
  var _proto = ReactSVG.prototype;
  _proto.renderSVG = function renderSVG() {
    var _this2 = this;
    /* istanbul ignore else */
    if (this.reactWrapper instanceof ownerWindow(this.reactWrapper).Node) {
      var _this$props = this.props,
        desc = _this$props.desc,
        evalScripts = _this$props.evalScripts,
        httpRequestWithCredentials = _this$props.httpRequestWithCredentials,
        renumerateIRIElements = _this$props.renumerateIRIElements,
        src = _this$props.src,
        title = _this$props.title,
        useRequestCache = _this$props.useRequestCache;
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      var onError = this.props.onError;
      var beforeInjection = this.props.beforeInjection;
      var afterInjection = this.props.afterInjection;
      var wrapper = this.props.wrapper;
      var nonReactWrapper;
      var nonReactTarget;
      if (wrapper === 'svg') {
        nonReactWrapper = document.createElementNS(react_svg_esm_svgNamespace, wrapper);
        nonReactWrapper.setAttribute('xmlns', react_svg_esm_svgNamespace);
        nonReactWrapper.setAttribute('xmlns:xlink', react_svg_esm_xlinkNamespace);
        nonReactTarget = document.createElementNS(react_svg_esm_svgNamespace, wrapper);
      } else {
        nonReactWrapper = document.createElement(wrapper);
        nonReactTarget = document.createElement(wrapper);
      }
      nonReactWrapper.appendChild(nonReactTarget);
      nonReactTarget.dataset.src = src;
      this.nonReactWrapper = this.reactWrapper.appendChild(nonReactWrapper);
      var handleError = function handleError(error) {
        _this2.removeSVG();
        if (!_this2._isMounted) {
          onError(error);
          return;
        }
        _this2.setState(function () {
          return {
            hasError: true,
            isLoading: false
          };
        }, function () {
          onError(error);
        });
      };
      var afterEach = function afterEach(error, svg) {
        if (error) {
          handleError(error);
          return;
        }
        // TODO (Tane): It'd be better to cleanly unsubscribe from SVGInjector
        // callbacks instead of tracking a property like this.
        if (_this2._isMounted) {
          _this2.setState(function () {
            return {
              isLoading: false
            };
          }, function () {
            try {
              afterInjection(svg);
            } catch (afterInjectionError) {
              handleError(afterInjectionError);
            }
          });
        }
      };
      var beforeEach = function beforeEach(svg) {
        svg.setAttribute('role', 'img');
        if (desc) {
          var originalDesc = svg.querySelector(':scope > desc');
          if (originalDesc) {
            svg.removeChild(originalDesc);
          }
          var newDesc = document.createElement('desc');
          newDesc.innerHTML = desc;
          svg.prepend(newDesc);
        }
        if (title) {
          var originalTitle = svg.querySelector(':scope > title');
          if (originalTitle) {
            svg.removeChild(originalTitle);
          }
          var newTitle = document.createElement('title');
          newTitle.innerHTML = title;
          svg.prepend(newTitle);
        }
        try {
          beforeInjection(svg);
        } catch (error) {
          handleError(error);
        }
      };
      SVGInjector(nonReactTarget, {
        afterEach: afterEach,
        beforeEach: beforeEach,
        cacheRequests: useRequestCache,
        evalScripts: evalScripts,
        httpRequestWithCredentials: httpRequestWithCredentials,
        renumerateIRIElements: renumerateIRIElements
      });
    }
  };
  _proto.removeSVG = function removeSVG() {
    var _this$nonReactWrapper;
    if ((_this$nonReactWrapper = this.nonReactWrapper) != null && _this$nonReactWrapper.parentNode) {
      this.nonReactWrapper.parentNode.removeChild(this.nonReactWrapper);
      this.nonReactWrapper = null;
    }
  };
  _proto.componentDidMount = function componentDidMount() {
    this._isMounted = true;
    this.renderSVG();
  };
  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _this3 = this;
    if (shallowDiffers(_extends({}, prevProps), this.props)) {
      this.setState(function () {
        return _this3.initialState;
      }, function () {
        _this3.removeSVG();
        _this3.renderSVG();
      });
    }
  };
  _proto.componentWillUnmount = function componentWillUnmount() {
    this._isMounted = false;
    this.removeSVG();
  };
  _proto.render = function render() {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    var _this$props2 = this.props;
      _this$props2.afterInjection;
      _this$props2.beforeInjection;
      _this$props2.desc;
      _this$props2.evalScripts;
      var Fallback = _this$props2.fallback;
      _this$props2.httpRequestWithCredentials;
      var Loading = _this$props2.loading;
      _this$props2.renumerateIRIElements;
      _this$props2.src;
      _this$props2.title;
      _this$props2.useRequestCache;
      var wrapper = _this$props2.wrapper,
      rest = _objectWithoutPropertiesLoose(_this$props2, _excluded);
    /* eslint-enable @typescript-eslint/no-unused-vars */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    var Wrapper = wrapper;
    return /*#__PURE__*/external_react_.createElement(Wrapper, _extends({}, rest, {
      ref: this.refCallback
    }, wrapper === 'svg' ? {
      xmlns: react_svg_esm_svgNamespace,
      xmlnsXlink: react_svg_esm_xlinkNamespace
    } : {}), this.state.isLoading && Loading && /*#__PURE__*/external_react_.createElement(Loading, null), this.state.hasError && Fallback && /*#__PURE__*/external_react_.createElement(Fallback, null));
  };
  return ReactSVG;
}(external_react_.Component);
ReactSVG.defaultProps = {
  afterInjection: function afterInjection() {
    return undefined;
  },
  beforeInjection: function beforeInjection() {
    return undefined;
  },
  desc: '',
  evalScripts: 'never',
  fallback: null,
  httpRequestWithCredentials: false,
  loading: null,
  onError: function onError() {
    return undefined;
  },
  renumerateIRIElements: true,
  title: '',
  useRequestCache: true,
  wrapper: 'div'
};
ReactSVG.propTypes = {
  afterInjection: prop_types.func,
  beforeInjection: prop_types.func,
  desc: prop_types.string,
  evalScripts: prop_types.oneOf(['always', 'once', 'never']),
  fallback: prop_types.oneOfType([prop_types.func, prop_types.object, prop_types.string]),
  httpRequestWithCredentials: prop_types.bool,
  loading: prop_types.oneOfType([prop_types.func, prop_types.object, prop_types.string]),
  onError: prop_types.func,
  renumerateIRIElements: prop_types.bool,
  src: prop_types.string.isRequired,
  title: prop_types.string,
  useRequestCache: prop_types.bool,
  wrapper: prop_types.oneOf(['div', 'span', 'svg'])
} ;


//# sourceMappingURL=react-svg.esm.js.map

// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
var injectStylesIntoStyleTag = __webpack_require__(379);
var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
var styleDomAPI = __webpack_require__(795);
var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
var setAttributesWithoutAttributes = __webpack_require__(565);
var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
var insertStyleElement = __webpack_require__(216);
var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
// EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
var styleTagTransform = __webpack_require__(589);
var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/ds_res/Infrastructure.scss
var Infrastructure = __webpack_require__(424);
;// CONCATENATED MODULE: ./src/ds_res/Infrastructure.scss

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());
options.insert = function insertToHead(element, options) {
                document.head.appendChild(element);
                var utils = __webpack_require__(48);
                if (utils._registerStyleElement)
                  utils._registerStyleElement(element);
              };
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(Infrastructure/* default */.Z, options);




       /* harmony default export */ const ds_res_Infrastructure = (Infrastructure/* default */.Z && Infrastructure/* default.locals */.Z.locals ? Infrastructure/* default.locals */.Z.locals : undefined);

// EXTERNAL MODULE: ./src/ds_res/assets/icons/office.svg
var office = __webpack_require__(90);
var office_default = /*#__PURE__*/__webpack_require__.n(office);
// EXTERNAL MODULE: ./src/ds_res/assets/icons/database-server.svg
var database_server = __webpack_require__(760);
var database_server_default = /*#__PURE__*/__webpack_require__.n(database_server);
// EXTERNAL MODULE: ./src/ds_res/assets/icons/electric-tower.svg
var electric_tower = __webpack_require__(544);
var electric_tower_default = /*#__PURE__*/__webpack_require__.n(electric_tower);
;// CONCATENATED MODULE: ./src/ds_res/Infrastructure.jsx









function CreatePath(coordinates) {
  return /*#__PURE__*/(0,external_react_.createElement)("svg", {
    className: "path",
    viewBox: "0 0 1000 1000"
  }, /*#__PURE__*/(0,external_react_.createElement)("path", {
    fill: "none",
    stroke: "lightgray",
    strokeWidth: "10",
    // d: coordinates,
    d: "M140,384 C200,380 700,180 840,180"
  }));
}

var Infrastructure_Infrastructure = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Infrastructure, _React$Component);

  function Infrastructure(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;

    _this.containerCoordinates = function (id) {
      var container = document.getElementById(id);

      if (!container) {
        console.log("No such Container!");
        return;
      }

      var coords = container.getBoundingClientRect();
      console.log(container.getBoundingClientRect());
      var x = coords.x + coords.width;
      var y = coords.y + coords.height / 2;
      console.log("Returning ", id, {
        x: x,
        y: y
      });
      return {
        x: x,
        y: y
      };
    };

    _this.createBezierCoords = function (start, end) {
      return "M" + start.x + "," + start.y + " C" + "15,5 100,5 " + end.x + "," + end.y;
    };

    _this.state = {
      path: null
    };
    return _this;
  }

  var _proto = Infrastructure.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var path = CreatePath(this.createBezierCoords(this.containerCoordinates("database"), this.containerCoordinates("tower")));
    console.log("path ", path);
    this.setState({
      path: path
    });
  };

  _proto.render = function render() {
    return /*#__PURE__*/external_react_default().createElement("main", {
      className: "infrastructure infrastructure-wrapper"
    }, this.state.path, /*#__PURE__*/external_react_default().createElement("section", {
      className: "column"
    }, /*#__PURE__*/external_react_default().createElement("article", {
      className: "container"
    }, /*#__PURE__*/external_react_default().createElement(ReactSVG, {
      className: "svg-wrapper",
      src: (office_default())
    })), /*#__PURE__*/external_react_default().createElement("article", {
      id: "database",
      className: "container"
    }, /*#__PURE__*/external_react_default().createElement(ReactSVG, {
      className: "svg-wrapper",
      src: (database_server_default())
    }))), /*#__PURE__*/external_react_default().createElement("section", {
      className: "column"
    }, /*#__PURE__*/external_react_default().createElement("article", {
      id: "tower",
      className: "container"
    }, /*#__PURE__*/external_react_default().createElement(ReactSVG, {
      className: "svg-wrapper",
      src: (electric_tower_default())
    }))));
  };

  return Infrastructure;
}((external_react_default()).Component);


})();

__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=Infrastructure.js.map