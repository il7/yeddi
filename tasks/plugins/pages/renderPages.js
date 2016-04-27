const Metalsmith = require('metalsmith');
const path = require('path');

const metalfile = require('./metalfile.js');

module.exports = function(opts, done) {
  var ms = new Metalsmith(path.resolve(__dirname + '/../..'))
    .clean(false)
    .source(opts.src)
    .destination(opts.dest);

  metalfile(ms);

  ms.build(function(err) {
    if (err) done(err);
    done();
  });
}