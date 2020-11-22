const root = require(__dirname + '/../../config').root;
const customRequireDirectory = require(root +
  '/utility/customRequireDirectory');

module.exports = customRequireDirectory(__dirname);
