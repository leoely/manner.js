import compressOutput from '~/lib/compressOutput';
import formateHttpDate from '~/lib/formateHttpDate';
import parseDateString from '~/lib/parseHttpDate';

const output = {
  modify: {},
  file: {},
};

export default function cacheOutput(req, res, path, file, ms) {
  let ifModifiedSince = req.headers['If-Modified-Since'];
  if (ifModifiedSince === undefined) {
    if (output.modify[path] === undefined) {
      output.modify[path] = new Date(ms).toString();
    }
    if (output.file[path] === undefined) {
      output.file[path] = file;
    }
    res.setHeader('Last-Modified', formateHttpDate(output.modify[path]));
    compressOutput(req, res, output.file[path], path);
  } else {
    if (output.modify[path] === undefined) {
      output.modify[path] = new Date(ms).toString();
    }
    if (parseDateString(new Date().toString()) < parseDateString(output.modify[path])) {
      if (output.file[path] === undefined) {
        output.file[path] = file;
      }
      res.setHeader('Last-Modified', formateHttpDate(output.modify[path]));
      compressOutput(req, res, output.file[path], path);
    } else {
      res.writeHead(304);
      res.end();
    }
  }
}
