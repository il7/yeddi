const gulp = require('gulp');
const bundle = require('./plugins/task-scripts').bundle;
const watch = require('./plugins/task-scripts').watch;

const dirs = require('../package.json').directories;

const scriptOpts = { 
  entry: dirs.scripts + '/main.js',
  dest: dirs.assets,
  name: 'bundle.js'
};

gulp.task('scripts', bundle(scriptOpts));
gulp.task('scripts-watch', watch(scriptOpts));