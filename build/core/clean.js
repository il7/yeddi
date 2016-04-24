const del = require('del');

module.exports = function(dir, done) {
  return del(dir).then(() => done());
};