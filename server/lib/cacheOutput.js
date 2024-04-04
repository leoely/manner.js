"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cacheOutput;
var _formateHttpDate = _interopRequireDefault(require("./formateHttpDate"));
var _parseHttpDate = _interopRequireDefault(require("./parseHttpDate"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function cacheOutput(req, res, path, file, ms) {
  let ifModifiedSince = req.headers['If-Modified-Since'];
  if (ifModifiedSince === undefined) {
    if (this.modify[path] === undefined) {
      this.modify[path] = new Date(ms).toString();
    }
    if (this.file[path] === undefined) {
      this.file[path] = file;
    }
    res.setHeader('Last-Modified', (0, _formateHttpDate.default)(this.modify[path]));
    this.compressOutput(req, res, this.file[path], path);
  } else {
    if (this.modify[path] === undefined) {
      this.modify[path] = new Date(ms).toString();
    }
    if ((0, _parseHttpDate.default)(new Date().toString()) < (0, _parseHttpDate.default)(this.modify[path])) {
      if (this.file[path] === undefined) {
        this.file[path] = file;
      }
      res.setHeader('Last-Modified', (0, _formateHttpDate.default)(this.modify[path]));
      this.compressOutput(req, res, this.file[path], path);
    } else {
      res.writeHead(304);
      res.end();
    }
  }
}