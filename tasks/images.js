const gulp = require('gulp');
const copy = require('./plugins/task-copy');
const dirs = require('../package.json').directories;

gulp.task('images', copy({
  src: dirs.images,
  dest: dirs.destImages
}))
