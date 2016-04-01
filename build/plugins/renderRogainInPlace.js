'use strict';

const match = require('minimatch');
const parallel = require('run-parallel')
const config = require('../rogain-config');
const renderToString = require('rogain-render-string');
const Parser = require('rogain-parser');
const parser = new Parser();

module.exports = function RenderRogainInPlace(files, metal, done) {
  let metadata = metal.metadata();
  let tasks = Object.keys(files).map(fname => (function(d) {
    if (match(fname, '**/*.rogain')) {
      let file = files[fname];
      let data = Object.assign({}, metadata, file);

      parser.parse(file.contents.toString(), tree => {
        file.contents = renderToString(tree, data, config);
        d(null);
      });
    } else {
      d(null);
    }
  }));

  parallel(tasks, err => done(err));
}