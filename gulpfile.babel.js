import { parallel, series, src, dest, } from 'gulp';
import babel from 'gulp-babel';

function buildServer() {
  return src('packages/mode-server/dist')
    .pipe(babel())
    .pipe(dest('server'));
}

function buildClient() {
  return src('packages/mode-client/dist')
    .pipe(babel())
    .pipe(dest('client'));
}

exports.build = parallel(buildServer, buildClient);
