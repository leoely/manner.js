"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compressOutput;
var _zlib = _interopRequireDefault(require("zlib"));
var _stream = require("stream");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function onError(err) {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
}
function compressOutput(req, res, buffer, path) {
  res.setHeader('Vary', 'Accept-Encoding');
  let acceptEncoding = req.headers['accept-encoding'];
  if (/gzip/.test(acceptEncoding)) {
    res.writeHead(200, {
      'Content-Encoding': 'gzip'
    });
    this.dealCompress(_zlib.default.gzipSync(buffer), path, res);
  } else {
    res.writeHead(200, {});
    this.dealDirect(buffer, path, res);
  }
}