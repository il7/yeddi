const Metalsmith = require('metalsmith');

const config = require('../rogain-config.js');
const metalfile = require('./metalfile.js');

module.exports = function(opts, done) {
  var ms = new Metalsmith(path.resolve(__dirname + '/..'))
    .clean(false)
    .source(opts.src)
    .destination(opts.dest);

  metalfile(ms, opts);

  ms.build(function(err) {
    if (err) throw err;
    done(err);
  });
}