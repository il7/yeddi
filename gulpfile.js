// general plugins
const gulp = require('gulp');
const sequence = require('run-sequence').use(gulp);

const dirs = {
  src: 'source',
  srcComponents: 'source/components',
  srcAssets: 'source/assets',
  dest: 'dist',
  destStyleGuide: 'dist/styleguide',
  destAssets: 'dist/assets'
};

require('./build/core/tasks')(dirs);
require('./build/styles/tasks')(dirs);
require('./build/scripts/tasks')(dirs);
require('./build/components/tasks')(dirs);
require('./build/pages/tasks')(dirs);

// watchers
gulp.task('watch', function (done) {
  gulp.watch('source/**/*.scss', ['styles']);
  gulp.watch('source/pages/**/*', []);
  gulp.watch('source/components/**/*.rogain', []);

  sequence([
    'watch-script',
    'watch-components'
  ], done)
});

// main tasks
gulp.task('default', function(done) {
  sequence('clean', 'copy-assets', [
    'styles',
    'script',
    'precompile-components'
  ], done);
});

gulp.task('develop', function(done) {
  sequence('default', 'watch', done);
});