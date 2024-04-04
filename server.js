"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommonHttp = void 0;
exports.default = getHtml;
exports.parseOption = parseOption;
exports.readCookie = readCookie;
var _path = _interopRequireDefault(require("path"));
var _fs = _interopRequireDefault(require("fs"));
var _zlib = _interopRequireDefault(require("zlib"));
var _stream = require("stream");
var _handlebars = _interopRequireDefault(require("handlebars"));
var _htmlMinifier = require("html-minifier");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function onError(err) {
  if (err) {
    console.error('An error occurred:', err);
    process.exitCode = 1;
  }
}
function parseDateString(dateString) {
  return new Date(httpDate).getTime();
}
function formateHttpDate(date) {
  let [week, month, day, year, time, zone] = date.toString().split(' ');
  zone = zone.split('+')[0];
  return month + ', ' + day + ' ' + month + ' ' + year + ' ' + time + ' ' + zone;
}
function isOption(string) {
  let ans = true;
  if (typeof string === 'string') {
    let i = 0;
    for (i = 0; i < 1; i += 1) {
      if (string.charAt(i) === '-') {
        break;
      }
    }
    if (i === 0) {
      ans = false;
    }
  } else {
    ans = false;
  }
  return ans;
}
function transformOption(value) {
  let ans;
  const s = value.split('-');
  if (s.length >= 1) {
    ans = s.map((e, i) => {
      if (i === 0) {
        return e;
      } else {
        return e.charAt(0).toUpperCase() + e.substring(1, e.length);
      }
    });
  } else {
    ans = value;
  }
  return ans.join('');
}
function parseOption(...params) {
  const ans = {};
  for (let i = 0; i < params.length; i += 1) {
    const param = params[i];
    if (param.charAt(0) === '-') {
      const regexp = /^\-([a-z])$/;
      if (regexp.test(param)) {
        const [_, k] = param.match(regexp);
        if (isOption(params[i + 1])) {
          ans[k] = params[i + 1];
          i += 1;
        } else {
          ans[k] = true;
        }
      }
      if (param.charAt(1) === '-') {
        const regexp = /^\-\-([a-z\-]+)$/;
        if (regexp.test(param)) {
          const [_, k] = param.match(regexp);
          if (isOption(params[i + 1])) {
            ans[transformOption(k)] = params[i + 1];
            i += 1;
          } else {
            ans[k] = true;
          }
        }
      }
    }
  }
  return ans;
}
function readCookie(cookie) {
  const cookies = {};
  if (typeof cookie === 'string') {
    cookie.split(';').forEach(i => {
      const [key, value] = i.split('=');
      cookies[key.trim()] = value;
    });
  }
  const namespaces = {};
  Object.keys(cookies).forEach(k => {
    const result = k.split('_');
    if (result.length === 2) {
      const [namespace, key] = result;
      if (namespaces[namespace] === undefined) {
        namespaces[namespace] = {};
      }
      namespaces[namespace][key] = cookies[k];
    }
  });
  return namespaces;
}
function formateHttpKey(key) {
  return key.split('-').map(v => {
    return v.substring(0, 1).toUpperCase() + v.substring(1, v.length);
  }).join('-');
}
function getHtml(title, content) {
  const template = _handlebars.default.compile(`
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8" />
    <title>{{title}}</title>
    <meta name="description" content="{{content}}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
    <main id="root"></main>
    <script src="main.bundle.js"></script>
    </body>
    </html>
  `);
  return (0, _htmlMinifier.minify)(template({
    title,
    content
  }), {
    collapseWhitespace: true
  });
}
function getLists(list) {
  return list.join('|');
}
const time = new Date().getTime();
class CommonHttp {
  constructor(options) {
    this.time = new Date().getTime();
    const {
      fonts
    } = options;
    if (options.fonts === undefined) {
      options.fonts = [];
    }
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
      res.setHeader('Last-Modified', formateHttpDate(this.modify[path]));
      this.compressOutput(req, res, this.file[path], path);
    } else {
      if (this.modify[path] === undefined) {
        this.modify[path] = new Date(ms).toString();
      }
      if (parseDateString(new Date().toString()) < parseDateString(this.modify[path])) {
        if (this.file[path] === undefined) {
          this.file[path] = file;
        }
        res.setHeader('Last-Modified', formateHttpDate(this.modify[path]));
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
            res.setHeader(formateHttpKey(k), response.headers.get(k));
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
          this.html = getHtml(title, content);
        }
        this.cacheOutput(req, res, '*html', this.html, time);
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
exports.CommonHttp = CommonHttp;