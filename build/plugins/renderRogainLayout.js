'use strict';

const config = require('../rogain-config');
const renderToString = require('rogain-render-string');

module.exports = function RenderRogainLayout(files, metal, done) {
  Object.keys(files).map(fname => {
    let meta = files[fname];
    if (meta.layout) {
      meta.contents = meta.contents.toString();
      var Layout = config.components.get(meta.layout.split('.')[0]);
      var data = Object.assign({}, meta, metal.metadata());

      meta.contents = renderToString(Layout, data, config);
    }
  });

  done();
}