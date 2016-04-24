const gulp = require('gulp');

const styles = require('./buildStyles'); // fe-task-styles
const styleGuide = require('./styleGuide'); // fe-task-style-guide

module.exports = function(dirs) {
  gulp.task('styles', function() {
    return styles({ src: dirs.srcComponents })
      .pipe(gulp.dest(dirs.destAssets));
  });

  gulp.task('style-guide', function() {
    return styleGuide({ src: dirs.srcComponents })
      .pipe(gulp.dest(dirs.destStyleGuide));
  });
};
