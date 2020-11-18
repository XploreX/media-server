/**
 * Checks for malperformed requests and throws error to handle them
 * @param {string} query The request query to be checked
 * @param {Array<string>} keys The list of keys to be checked in query
 */
function ensureCertainFields(query, keys) {
  for (key of keys) {
    if (!(key in query)) {
      const err = new Error(
          'Required \'' + key + '\' attribute not present in query',
      );
      throw err;
    }
  }
}

module.exports = ensureCertainFields;
