import cacheOutput from '~/lib/cacheOutput';
import formateHttpKey from '~/lib/formateHttpKey';
import filterNamespace from '~/lib/filterNamespace';

function getLists(list) {
  return list.join('|');
}

class CommonHttp {
  constructor(options) {
    this.time = new Date().getTime();
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
        } = options;
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

export default CommonHttp;
