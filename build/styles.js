const path = require('path');
const sourcemaps = require('gulp-sourcemaps');

// style plugins
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer-core');

module.exports = function(gulp, dirs) {
  // Task `styles`
  // compiles stylesheet and optimises file 
  gulp.task('styles', function() {
    return gulp.src(path.resolve(dirs.src, 'style.scss'))
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(postcss([
        autoprefixer({ browsers: ['last 2 version'] })
      ]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(dirs.assets));
  });
}