const root = require(__dirname+'/../config');
const customRequireDirectory = require(root+'/customRequireDirectory');

module.exports = customRequireDirectory(__dirname);
