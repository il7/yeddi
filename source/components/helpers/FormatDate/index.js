var dateFormat = require('dateformat');

module.exports = function FormatDate(tree, props) {
  return {
    type: 'text',
    data: dateFormat(tree.attrs.date, tree.attrs.format)
  };
}