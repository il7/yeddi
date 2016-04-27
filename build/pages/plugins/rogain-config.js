const Registry = require('rogain-registry');

const components = new Registry();
components.register(require('rogain-core-components'))
  
module.exports = { components: components };