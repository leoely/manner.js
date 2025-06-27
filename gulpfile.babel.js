import { parallel, series, src, dest, } from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';

function build() {
  return src('src/**/*.js')
    .pipe(babel())
    .pipe(uglify())
    .pipe(dest('dist'));
}

function copy() {
  return src('dist/**/*')
    .pipe(dest('./'));
}

exports.copy = copy;
exports.build = build;
