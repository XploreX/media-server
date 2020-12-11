const config = global.__config;
const customRequireDirectory = require(config.root +
  '/src/utility/customRequireDirectory');

module.exports = customRequireDirectory;
