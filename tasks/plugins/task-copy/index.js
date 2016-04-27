const gulp = require('gulp');
const del = require('del');

module.exports = function(opts) {
	return function() {
    return gulp.src(opts.src + '/**/*').pipe(gulp.dest(opts.dest));
	}
};
