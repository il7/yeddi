const path = require('path');
const gulp = require('gulp');

module.exports = function(opts) {
  return gulp.src(path.resolve(opts.src, '**/*'));
}
