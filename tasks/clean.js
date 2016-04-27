const gulp = require('gulp');
const clean = require('./plugins/task-clean');
const dirs = require('../package.json').directories;

gulp.task('clean', clean({ target: dirs.dest }))
