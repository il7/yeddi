const gulp = require('gulp');

module.exports = function(opts) {
  return gulp.src(opts.src + '/*.scss')
};