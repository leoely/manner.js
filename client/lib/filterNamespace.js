"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filterNamespace;
function filterNamespace(namespace) {
  const ans = {};
  Object.keys(namespace).forEach(k => {
    if (k !== 'expires') {
      ans[k] = namespace[k];
    }
  });
  return ans;
}