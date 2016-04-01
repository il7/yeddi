const path = require('path');
const fs = require('fs');

const rename = require('gulp-rename');
const changed = require('gulp-changed');
const flatten = require('gulp-flatten');
const sequence = require('run-sequence');
const frontMatter = require('gulp-front-matter');

// template plugins
const Metalsmith = require('metalsmith');
const Rogulp = require('rogulp');
const through = require('through2');
const prettify = require('gulp-prettify');

const config = require('./rogain-config.js');
const metalfile = require('./metalfile.js');

module.exports = function(gulp, dirs) {
  gulp.task('precompile-components', function() {
    return gulp.src(path.resolve(dirs.components, '**/*.rogain'))
      .pipe(flatten())
      // .pipe(changed(path.resolve(dirs.assets, dirs.components), { extension: '.json' }))
      .pipe(Rogulp.parse(config))
      .pipe(gulp.dest(path.resolve(dirs.assets, dirs.components)))
      .pipe(gulp.dest(path.resolve(dirs.src, dirs.pages, dirs.components)));
  });

  gulp.task('pages', function(done) {
    var ms = new Metalsmith(path.resolve(__dirname + '/..'))
      .clean(false)
      .source('source/pages')
      .destination('dist');

    metalfile(ms);

    ms.build(function(err) {
      if (err) throw err;
      done(err);
    });
  });

  gulp.task('templates', function(done) {
    sequence(['precompile-components'], 'pages', done);
  });
};