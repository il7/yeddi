const path = require('path');
const del = require('del');

module.exports = function(gulp, dirs) {
  gulp.task('clean', function(done) {
    del('dist').then(() => done());
  })

  gulp.task('copy-assets', function() {
    return gulp.src(path.resolve(dirs.src, 'assets/**/*'))
      .pipe(gulp.dest(dirs.assets))
  })
}