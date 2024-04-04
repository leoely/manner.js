import path from 'path';
import fs from 'fs';
import zlib from 'zlib';
import getHtml from '~/server/lib/getHtml';
import parseDateString from '~/server/lib/parseDateString';
import formateHttpDate from '~/server/lib/formateHttpDate';
import formateHttpKey from '~/server/lib/formateHttpKey';

function getLists(list) {
  return list.join('|');
}

export default class CommonHttp {
  constructor(options) {
    this.time = new Date().getTime();
    const { fonts, } = options;
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
      res.writeHead(200, { 'Content-Encoding': 'gzip' });
      this.dealCompress(zlib.gzipSync(buffer), path, res);
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
      const { url, } = req;
      if (url === '/update/time') {
        const { time, } = this;
        res.end(time);
      } else if (this.regexp.test(url)) {
        const restPath = url.substring(1, url.length);
        this.cacheOutput(req, res, restPath,
          fs.readFileSync(path.resolve('static', restPath)),
          parseInt(fs.statSync(path.resolve('static', restPath)).mtimeMs),
        );
      } else if (url.substring(0, 4) === '/api') {
        const body = await new Promise((resolve, reject) => {
          req.on('data', (data) => {
            resolve(data.toString());
          });
        });
        const {
          location,
        } = this.options;
        if (location !== undefined) {
          const response = await fetch(location + url, {
            method: 'POST',
            body,
          });
          for (const k of response.headers.keys()) {
            res.setHeader(formateHttpKey(k), response.headers.get(k));
          }
          const data = await response.text();
          res.end(JSON.stringify(data));
        }
      } else {
        if (this.html === undefined) {
          const { title, content, } = this.options;
          this.html = getHtml(title, content);
        }
        this.cacheOutput(req, res, '*html', this.html, this.time);
      }
    } catch (e) {
      const {
        develope,
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
