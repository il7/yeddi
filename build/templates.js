const path = require('path');
const fs = require('fs');

const rename = require('gulp-rename');
const changed = require('gulp-changed');
const flatten = require('gulp-flatten');
const sequence = require('run-sequence');

// template plugins
const Metalsmith = require('metalsmith');
const Rogulp = require('rogulp');
const through = require('through2');
const prettify = require('gulp-prettify');

var config = require('./rogain-config.js');
var metalfile = require('./metalfile.js');

module.exports = function(gulp, dirs) {
  gulp.task('precompile-components', function() {
    return gulp.src(path.resolve(dirs.components, '**/*.rogain'))
      .pipe(flatten())
      .pipe(changed(path.resolve(dirs.assets, dirs.components), { extension: '.json' }))
      .pipe(Rogulp.parse(config))
      .pipe(Rogulp.register(config.components))
      .pipe(gulp.dest(path.resolve(dirs.assets, dirs.components)));
  });

  gulp.task('precompile-pages', function() {
    return gulp.src(path.resolve(dirs.src, dirs.pages, '**/*.rogain'))
      .pipe(changed(path.resolve(dirs.assets, dirs.pages), { extension: '.json' }))
      .pipe(Rogulp.parse(config)) 
      .pipe(gulp.dest(path.resolve(dirs.assets, dirs.pages)));
  });

  // Task `templates`
  // compile html templates
  gulp.task('render-pages', function() {
    var stream = gulp.src(path.resolve(dirs.assets, dirs.pages, '**/*.json'))
      .pipe(changed(dirs.dest, { extension: '.html' }));

    return renderPages(stream).pipe(gulp.dest(dirs.dest));
  });

  gulp.task('force-render-pages', function() {
    var stream = gulp.src(path.resolve(dirs.assets, dirs.pages, '**/*.json'));
    return renderPages(stream).pipe(gulp.dest(dirs.dest));
  });

  gulp.task('metalsmith', function() {
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
    sequence(['precompile-components', 'precompile-pages'], 'force-render-pages', done);
  });

  gulp.task('pages', function(done) {
    sequence('precompile-pages', 'render-pages', done);
  });
};


function renderPages(stream) {
  return stream
    .pipe(Rogulp.renderToString(function(file, done) {
      fs.readFile(path.resolve(__dirname, '../source/data.json'), function(err, data) {
        done(err, JSON.parse(data));
      });
    }, config))
    .pipe(rename(function (path) { path.extname = ".html"; }));
}
