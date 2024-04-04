"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = formateHttpKey;
function formateHttpKey(key) {
  return key.split('-').map(v => {
    return v.substring(0, 1).toUpperCase() + v.substring(1, v.length);
  }).join('-');
}