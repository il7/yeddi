const requireDir = require('require-dir');
const coreComponents = require('rogain-core-components');
const Registry = require('rogain-registry');

const components = new Registry();
components.register(coreComponents)
  
module.exports = { components: components };