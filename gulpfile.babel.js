import { parallel, series, src, dest, } from 'gulp';
import babel from 'gulp-babel';

function buildServer() {
  return src('src/package/server/dist')
    .pipe(babel())
    .pipe(dest('server'));
}

function buildClient() {
  return src('src/package/client/dist')
    .pipe(babel())
    .pipe(dest('client'));
}

exports.build = parallel(buildServer, buildClient);
