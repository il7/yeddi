const gulp = require('gulp');
const copy = require('./plugins/task-copy');
const dirs = require('../package.json').directories;

gulp.task('fonts', copy({
  src: dirs.fonts,
  dest: dirs.destFonts
}))
