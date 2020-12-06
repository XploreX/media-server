/**
 * @param {module} module module you want uncached
 * @return {module} the uncached module
 */
function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

module.exports = requireUncached;
