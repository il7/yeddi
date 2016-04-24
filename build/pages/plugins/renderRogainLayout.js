'use strict';

const config = require('../rogain-config');
const resolveTree = require('rogain-resolve-tree');
const renderToString = require('rogain-render-string');

module.exports = function RenderRogainLayout(files, metal, done) {
  let metadata = metal.metadata();
  
  Object.keys(files).forEach(fname => {
    let file = files[fname];

    if (file.layout) {
      let Layout = config.components.get(file.layout);
      let data = Object.assign({}, metadata, file, { 
        contents: file.contents.toString()
      });
      // if (fname ) { console.log(file.layout, data) }


      file.contents = renderToString(resolveTree(Layout, data, config));
    }
  });

  done();
}