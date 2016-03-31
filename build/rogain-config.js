const Config = require('rogain-config');

var config = new Config();

config.components.register(require('rogain-core-bundle').components)

module.exports = config;