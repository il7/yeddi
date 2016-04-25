'use strict';

const match = require('minimatch');
const parallel = require('run-parallel')
const resolveTree = require('rogain-resolve-tree');
const renderToString = require('rogain-render-string');
const parser = require('rogain-parser');

module.exports = function(config) {
  return function RenderRogainInPlace(files, metal, done) {
    const metadata = metal.metadata();
    
    const tasks = Object.keys(files).map(fname => (function(d) {
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
};