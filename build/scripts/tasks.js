const gulp = require('gulp');

const compileScript = require('./compile'); // fe-task-compile-script
const watchScript = require('./watch'); // fe-task-watch-script

module.exports = function(dirs) {
  const scriptOpts = { 
    src: dirs.srcComponents + '/main.js',
    dest: dirs.destAssets,
    name: 'bundle.js'
  };

  gulp.task('script', () => compileScript(scriptOpts));
  gulp.task('watch-script', () => watchScript(scriptOpts));
}