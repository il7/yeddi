const Registry = require('rogain-registry');
const components = new Registry();

components.register(require('rogain-core-components'));
components.register(require('../dist/assets/components'));

module.exports = {
  components: components
};