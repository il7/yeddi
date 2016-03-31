'use strict';

const match = require('minimatch');
const parallel = require('run-parallel')
const config = require('../rogain-config');
const renderToString = require('rogain-render-string');
const Parser = require('rogain-parser');
const parser = new Parser();

module.exports = function RenderRogainInPlace(files, meta, done) {
  var tasks = Object.keys(files).map(function(fname) {
    return function(d) {
      let meta = files[fname];

      if (match(fname, '**/*.rogain')) {
        parser.parse(meta.contents.toString(), tree => {
          meta.contents = renderToString(tree, meta, config);
          d(null);
        });
      } else {
        d(null);
      }
    }
  });

  parallel(tasks, function(err, arr) {
    done()
  })
}