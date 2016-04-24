// general plugins
const gulp = require('gulp');
const sequence = require('run-sequence');
const path = require('path');

const clean = require('./build/core/clean'); // fe-task-clean
const copy = require('./build/core/copy'); // fe-task-copy

const styles = require('./build/styles/buildStyles'); // fe-task-styles
const styleGuide = require('./build/styles/styleGuide'); // fe-task-style-guide
const precompileTemplates = require('./build/templates/precompile'); // fe-task-precompile-templates
const compileScript = require('./build/scripts/compile'); // fe-task-compile-script
const watchScript = require('./build/scripts/watch'); // fe-task-watch-script

const dirs = {
  src: 'source',
  srcComponents: 'source/components',
  srcAssets: 'source/assets',
  dest: 'dist',
  destStyleGuide: 'dist/styleguide',
  destAssets: 'dist/assets'
};

// core
gulp.task('clean', function(done) {
  clean(dirs.dest, done);
});

gulp.task('copy-assets', function() {
  return copy({ src: dirs.srcAssets }).pipe(gulp.dest(dirs.destAssets));
});

// styles
gulp.task('styles', function() {
  return styles({ src: dirs.srcComponents }).pipe(gulp.dest(dirs.destAssets));
});

gulp.task('style-guide', function() {
  return styleGuide({ src: dirs.srcComponents }).pipe(gulp.dest(dirs.destStyleGuide));
});

// scripts
gulp.task('script', function() {
  return compileScript({ 
    src: dirs.srcComponents + '/main.js',
    dest: dirs.destAssets,
    filename: 'bundle.js'
  });
});

gulp.task('watch-script', function() {
  watchScript({ 
    src: dirs.srcComponents + '/main.js',
    dest: dirs.destAssets,
    filename: 'bundle.js'
  })
});

// templates
gulp.task('precompile-templates', function() {
  return compileScript({ 
    src: dirs.srcComponents + '/components.js',
    dest: dirs.destAssets,
    filename: 'components.js'
  })
});

gulp.task('watch-templates', function() {
  watchScript({ 
    src: dirs.srcComponents + '/components.js',
    dest: dirs.destAssets,
    filename: 'components.js'
  })
});

// watchers
gulp.task('watch', function () {
  gulp.watch('source/**/*.scss', ['styles']);
  // gulp.watch('source/pages/**/*', ['pages']);
  // gulp.watch('source/components/**/*.rogain', ['templates']);

  sequence('watch-script', 'watch-templates')
});

// main tasks
gulp.task('default', function(done) {
  sequence('clean', 'copy-assets', ['styles', 'script', 'precompile-templates'], done);
});

gulp.task('develop', function(done) {
  sequence('default', 'watch', done);
});