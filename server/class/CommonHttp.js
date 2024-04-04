"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _zlib = _interopRequireDefault(require("zlib"));
var _getHtml = _interopRequireDefault(require("../lib/getHtml"));
var _parseDateString = _interopRequireDefault(require("../lib/parseDateString"));
var _formateHttpDate = _interopRequireDefault(require("../lib/formateHttpDate"));
var _formateHttpKey = _interopRequireDefault(require("../lib/formateHttpKey"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getLists(list) {
  return list.join('|');
}
class CommonHttp {
  constructor(options) {
    this.time = new Date().getTime();
    const {
      fonts
    } = options;
    if (options.fonts === undefined) {
      options.fonts = [];
    }
    this.time = new Date().getTime();
    this.modify = {};
    this.file = {};
    this.raw = {};
    this.compress = {};
    this.options = options;
    this.regexp = new RegExp(`\.(${getLists(options.fonts.concat(['html, ico', 'js']))})$`);
  }
  compressOutput(req, res, buffer, path) {
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
  cacheOutput(req, res, path, file, ms) {
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
      if ((0, _parseDateString.default)(new Date().toString()) < (0, _parseDateString.default)(this.modify[path])) {
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
  dealCompress(data, path, res) {
    if (this.compress[path] === undefined) {
      this.compress[path] = data;
    }
    res.end(this.compress[path]);
  }
  directDeal(data, path, res) {
    if (this.raw[path] === undefined) {
      this.compress[path] = data;
    }
    res.end(this.raw[path]);
  }
  async process(req, res) {
    try {
      const {
        url
      } = req;
      if (url === '/update/time') {
        const {
          time
        } = this;
        res.end(time);
      } else if (this.regexp.test(url)) {
        const restPath = url.substring(1, url.length);
        this.cacheOutput(req, res, restPath, _fs.default.readFileSync(_path.default.resolve('static', restPath)), parseInt(_fs.default.statSync(_path.default.resolve('static', restPath)).mtimeMs));
      } else if (url.substring(0, 4) === '/api') {
        const body = await new Promise((resolve, reject) => {
          req.on('data', data => {
            resolve(data.toString());
          });
        });
        const {
          location
        } = this.options;
        if (location !== undefined) {
          const response = await fetch(location + url, {
            method: 'POST',
            body
          });
          for (const k of response.headers.keys()) {
            res.setHeader((0, _formateHttpKey.default)(k), response.headers.get(k));
          }
          const data = await response.text();
          res.end(JSON.stringify(data));
        }
      } else {
        if (this.html === undefined) {
          const {
            title,
            content
          } = this.options;
          this.html = (0, _getHtml.default)(title, content);
        }
        this.cacheOutput(req, res, '*html', this.html, this.time);
      }
    } catch (e) {
      const {
        develope
      } = this.options;
      if (develope === true) {
        throw e;
      } else {
        res.writeHead(500);
        res.end();
      }
    }
  }
}
exports.default = CommonHttp;