// general plugins
const gulp = require('gulp');
const sequence = require('run-sequence');
const path = require('path');

const paths = {
  src: 'source',
  dest: 'dist',
  pages: 'pages',
  assets: 'dist/assets',
  components: 'components' 
};

require('./build/core')(gulp, paths);
require('./build/styles')(gulp, paths);
require('./build/scripts')(gulp, paths);
require('./build/templates')(gulp, paths);

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
  sequence('clean', ['templates', 'copy-assets', 'styles'], done);
});
 
// Task `develop`
// Runs `compile` task then watches for file changes
gulp.task('develop', function(done) {
  sequence(['compile', 'scripts-develop'], 'watch', done);
});
 
gulp.task('default', ['compile', 'scripts-compile']);