const gulp = require('gulp');
const copy = require('./plugins/task-copy');
const dirs = require('../package.json').directories;

gulp.task('svgs', copy({
  src: dirs.svgs,
  dest: dirs.destSvgs
}));