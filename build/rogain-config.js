const Config = require('rogain-config');

var config = new Config();

config.components.register(require('rogain-core-bundle').components)
config.components.register(require('../components/helpers/_imports'));

module.exports = config;