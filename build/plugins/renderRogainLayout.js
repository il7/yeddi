'use strict';

const match = require('minimatch');
const parallel = require('run-parallel')
const parser = require('rogain-parser');
const config = require('../rogain-config');

module.exports = function RenderRogainLayout(files, meta, done) {
  Object.keys(files).map(fname => {
    let meta = files[fname];
    if (meta.layout) {
      var Layout = config.components.get(meta.layout);
      meta.contents = new Buffer(renderToString(Layout, meta, config));
    }
  });

  done();
}