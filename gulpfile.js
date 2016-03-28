// general plugins
const gulp = require('gulp');
const sequence = require('run-sequence');
const path = require('path');

const dirs = {
  src: 'source',
  dest: 'dist',
  pages: 'pages',
  assets: 'dist/assets',
  components: 'components' 
};

require('./build/core')(gulp, dirs);
require('./build/styles')(gulp, dirs);
require('./build/scripts')(gulp, dirs);
require('./build/templates')(gulp, dirs);

// Task `watch`
// run various tasks on file changes
gulp.task('watch', function () {
  gulp.watch('source/**/*.scss', ['styles']);
  gulp.watch('components/**/*.scss', ['styles']);
  
  gulp.watch('source/*.json', ['force-render-pages']);
  gulp.watch('source/**/*.rogain', ['pages']);
  gulp.watch('components/**/*.rogain', ['templates']);
});
 
// Task `compile`
// Deletes dist folder and builds site from scratch
gulp.task('compile', function(done) {
  sequence('clean', ['templates', 'copy-assets', 'styles', 'scripts-compile'], done);
});
 
// Task `develop`
// Runs `compile` task then watches for file changes
gulp.task('develop', function(done) {
  sequence(['compile', 'scripts-develop'], 'watch', done);
});
 
gulp.task('default', ['compile', 'scripts-compile']);