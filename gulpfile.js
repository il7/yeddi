const requireDir = require('require-dir')
const gulp = require('gulp');
const sequence = require('run-sequence').use(gulp);

// import all tasks from task folders
requireDir('./tasks');

// watchers
gulp.task('watch', function() {
  gulp.watch('source/**/*.scss', ['styles']);
  gulp.watch('source/assets/**/*', ['copy-assets']);
});

// main tasks
gulp.task('build-core', function(done) {
  sequence(['styles', 'scripts', 'images', 'svgs', 'fonts'], done);
});

gulp.task('default', function(done) {
  sequence('clean', 'build-core', done);
});

gulp.task('develop', function(done) {
  sequence('default', 'watch', done);
});