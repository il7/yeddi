'use strict';

const resolveTree = require('rogain-resolve-tree');
const renderToString = require('rogain-render-string');


module.exports = function(config) { 
  return function RenderRogainLayout(files, metal, done) {
    const metadata = metal.metadata();
    
    Object.keys(files).forEach(fname => {
      let file = files[fname];

      if (file.layout) {
        let Layout = config.components.get(file.layout);
        let data = Object.assign({}, metadata, file, { 
          contents: file.contents.toString()
        });

        file.contents = renderToString(resolveTree(Layout, data, config));
      }
    });

    done();
  }
};