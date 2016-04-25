const path = require('path');
const parser = require('rogain-parser');
const through = require('through2');

const gulp = require('gulp');
const changed = require('gulp-changed');
const flatten = require('gulp-flatten');
const ext = require('gulp-ext-replace');

module.exports = function(opts) {
  return gulp.src(path.resolve(opts.src, '**/*.rogain'))
    .pipe(flatten())
    .pipe(changed(opts.dest, { extension: '.json' }))
    .pipe(ext('.json'))
    .pipe(through.obj(function(file, enc, next) {
      parser(file.contents.toString())
        .then(tree => {
          file.contents = new Buffer(JSON.stringify(tree)); 
          next(null, file);
        })
        .catch(err => next(err));
    }));
};