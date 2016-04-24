const gulp = require('gulp');

const clean = require('./clean'); // fe-task-clean
const copy = require('./copy'); // fe-task-copy

module.exports = function(dirs) {
  gulp.task('clean', function(done) {
    clean(dirs.dest, done);
  });

  gulp.task('copy-assets', function() {
    return copy({ src: dirs.srcAssets })
      .pipe(gulp.dest(dirs.destAssets));
  });
}
