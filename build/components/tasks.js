const gulp = require('gulp');
const precompile = require('./precompile');

module.exports = function(dirs) {
  gulp.task('precompile-components', function() {
    return precompile({
      src: dirs.srcComponents,
      dest: dirs.destComponents
    })
    .pipe(gulp.dest(dirs.srcPages + '/components'))
    .pipe(gulp.dest(dirs.destComponents));
  }); 
};