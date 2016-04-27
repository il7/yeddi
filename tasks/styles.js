const gulp = require('gulp');
const styles = require('./plugins/task-styles');
const dirs = require('../package.json').directories

gulp.task('styles', styles({
  src: dirs.css + '/*.scss',
  dest: dirs.assets
}))