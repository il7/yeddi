const match = require('minimatch');
const parallel = require('run-parallel')
const parser = require('rogain-parser');
const config = require('../rogain-config');

module.exports = function RenderRogainInPlace(files, meta, done) {
  parallel(Object.keys(files).map(fname => {
    return function(d) {
      let meta = files[fname];

      if (match(fname, '**/*.rogain')) {
        parser.parse(meta.contents.toString(), tree => {
          meta.contents = new Buffer(renderToString(tree, meta, config));
          d();
        });
      }
    }
  }), done)
}