const config = global.__config;

const root = config.root;

const customRequireDirectory = require(root +
  '/src/utility/customRequireDirectory');

module.exports = customRequireDirectory(__dirname);
