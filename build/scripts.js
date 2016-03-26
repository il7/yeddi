const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');
const path = require('path');

// script plugins
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

module.exports = function(gulp, dirs) {
  // Task `scripts`
  // compiles app script and optimises files 
  gulp.task('scripts-compile', function() {
    var opts = Object.assign({}, watchify.args, {
      entries: path.resolve(dirs.src, 'main.js'),
      debug: true
    });

    var b = browserify(opts);
    return createBundler(b, 'bundle.js', dirs);
  });

  gulp.task('scripts-develop', function() {
    var opts = Object.assign({}, watchify.args, {
      entries: path.resolve(dirs.src, 'main.js'),
      debug: true
    });

    var b = watchify(browserify(opts)); 
    return createBundler(b, 'bundle.js', dirs);
  });

  function createBundler(b, name, dirs) {
    b.transform(babelify, { 
      presets: ['es2015']
    });

    b.on('update', bundle); // on any dep update, runs the bundler
    b.on('log', gutil.log); // output build logs to terminal

    function bundle() {
      return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source(name))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
           // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest(dirs.assets));
    }

    return bundle();
  }
}