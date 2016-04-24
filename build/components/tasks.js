const gulp = require('gulp');

const compileScript = require('../scripts/compile'); // fe-task-compile-script
const watchScript = require('../scripts/watch'); // fe-task-watch-script

module.exports = function(dirs) {
  const scriptOpts = { 
    src: dirs.srcComponents + '/components.js',
    dest: dirs.destAssets,
    name: 'components.js'
  };

  gulp.task('precompile-components', () => compileScript(scriptOpts));
  gulp.task('watch-components', () => watchScript(scriptOpts));
}