var match = require('minimatch');
var config = require('../rogain-config');

module.exports = function registerRogainComponents(files, metal, done) {
  Object.keys(files).forEach(function(name) {
    var file = files[name];
    if (match(name, 'components/*.json')) {
      var Name = name.split('/')[1].split('.')[0];
      config.components.register(Name, JSON.parse(file.contents));
    }
  });

  
  done();
}