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

export function parseOption(...params) {
  const ans = {};
  for (let i = 0; i < params.length; i += 1) {
    const param = params[i];
    if (param.charAt(0) === '-') {
      const regexp = /^\-([a-z])$/;
      if (regexp.test(param)) {
        const [_, k] = param.match(regexp);
        if (isOption(params[i+1])) {
          ans[k] = params[i+1];
          i += 1;
        } else {
          ans[k] = true;
        }
      }
      if (param.charAt(1) === '-') {
        const regexp = /^\-\-([a-z\-]+)$/;
        if (regexp.test(param)) {
          const [_, k] = param.match(regexp);
          if (isOption(params[i+1])) {
            ans[transformOption(k)] = params[i+1];
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

export function readCookie(cookie) {
  const cookies = {};
  if (typeof cookie === 'string') {
    cookie.split(';').forEach((i) => {
      const [key, value] = i.split('=');
      cookies[key.trim()] = value;
    });
  }
  const namespaces = {};
  Object.keys(cookies).forEach((k) => {
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
  return key.split('-').map((v) => {
    return v.substring(0, 1).toUpperCase() + v.substring(1, v.length);
  }).join('-');
}

function getLists(list) {
  return list.join('|');
}

export class CommonHttp {
  constructor(options) {
    this.time = new Date().getTime();
    const { fonts, } = options;
    if (options.fonts === undefined) {
      options.fonts = [];
    }
    this.options = options;
    this.regexp = new RegExp(`\.(${getLists(options.fonts.concat(['html, ico', 'js']))})$`);
  }

  async process(req, res) {
    try {
      const { url, } = req;
      if (url === '/update/time') {
        const { time, } = this;
        res.end(time);
      } else if (this.regexp.test(url)) {
        cacheOutput(req, res, restPath,
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
