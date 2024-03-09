import { parallel, series, src, dest, } from 'gulp';
import babel from 'gulp-babel';

function buildScript() {
  return src('scripts/**/*')
    .pipe(babel())
    .pipe(dest('dist'));
}

exports.build = buildScript;
