'use strict';

const match = require('minimatch');
const parallel = require('run-parallel')
const config = require('../rogain-config');
const resolveTree = require('rogain-resolve-tree');
const renderToString = require('rogain-render-string');
const parser = require('rogain-parser');

module.exports = function RenderRogainInPlace(files, metal, done) {
  let metadata = metal.metadata();
  let tasks = Object.keys(files).map(fname => (function(d) {
    if (match(fname, '**/*.rogain')) {
      let file = files[fname];
      let data = Object.assign({}, metadata, file);

      data.contents = data.contents.toString();

      parser(file.contents.toString())
        .then(tree => {
          file.contents = renderToString(resolveTree(tree, data, config));
          d(null);
        })
        .catch(err => d(err));
    } else {
      d(null);
    }
  }));

  parallel(tasks, err => done(err));
}