const path = require('path');

const gulp = require('gulp');
const rename = require('gulp-rename');
const changed = require('gulp-changed');
const flatten = require('gulp-flatten');
const gulpif = require('gulp-if');

const through = require('through2');
const parser = require('rogain-parser');

module.exports = function(options) {
  const opts = Object.assign({ }, options);

  return gulp.src(path.resolve(opts.src, '**/*.rogain'))
    .pipe(flatten())
    .pipe(gulpif(opts.dest !== undefined, changed(opts.dest, { extension: '.json' })))
    .pipe(through.obj(function(file, enc, done) {
      parser(file.contents.toString())
        .then(tree => {
          file.contents = new Buffer(JSON.stringify(tree)); 
          done(null, file);
        })
        .catch(err => done(err));
    }))
    .pipe(rename({ extname: '.json' }));
};