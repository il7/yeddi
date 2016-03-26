const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');

// script plugins
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

module.exports = function(gulp, dirs) {
  // Task `scripts`
  // compiles app script and optimises files 
  gulp.task('scripts-compile', function(done) {
    var bundler = createBundler();
    var rebundle = createRebundler(bundler, gulp, done)();
  });

  gulp.task('scripts-develop', function(done) {
    var bundler = createBundler();
    var rebundle = createRebundler(bundler, gulp, done)();

    // bundler.plugin(watchify);
    // bundler.on('update', rebundle);
    // done();
  });
}


function createBundler() {
  var bundler = browserify({ 
    entries: './source/main.js',
    debug: true,
    extensions: ['.js'],
    cache: {},
    packageCache: {}
  });

  bundler.transform(babelify, { 
    presets: ['es2015']
  });

  return bundler;
}

function createRebundler(bundler, gulp, done) {
  return function rebundle() {
    gutil.log('-> Bundling');
    
    return bundler.bundle()
      .on('error', function(err) { 
        gutil.log(err)
        this.emit('end');
      })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(gulp.dest('dist/assets'))
      .on('end', function() { 
        gutil.log('-> Bundling complete');
        if (done !== undefined) done();
      });
  }
}