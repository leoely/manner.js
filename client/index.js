"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "clearCookie", {
  enumerable: true,
  get: function () {
    return _setCookie.default;
  }
});
Object.defineProperty(exports, "filterNamespace", {
  enumerable: true,
  get: function () {
    return _filename.default;
  }
});
Object.defineProperty(exports, "readCookie", {
  enumerable: true,
  get: function () {
    return _setCookie.default;
  }
});
Object.defineProperty(exports, "setCookie", {
  enumerable: true,
  get: function () {
    return _setCookie.default;
  }
});
var _filename = _interopRequireDefault(require("./lib/filename"));
var _setCookie = _interopRequireDefault(require("./lib/setCookie"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }