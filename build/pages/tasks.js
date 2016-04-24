const gulp = require('gulp');

const renderPages = require('./renderPages'); // fe-task-compile-script

module.exports = function(dirs) {
  gulp.task('pages', done => renderPages({
    src: dirs.srcPages,
    dest: dirs.dest
  }, done));
}