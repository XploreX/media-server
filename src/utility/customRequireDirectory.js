const fs = require('fs');
const path = require('path');

/**
 * @param {string} dir - path of directory which is to be imported
 * @param {bool} pascalCase - should be true if pascalCase is to be
 * used for naming keys of the export object
 * @return {object} object which should go directly in module.exports
 *
 * @example
 *
 *  module.exports = customRequireDirectory(__dirname,false);
 */
function customRequireDirectory(dir, pascalCase = false) {
  const mp = {};
  const fileNames = fs.readdirSync(dir);
  const indexFile = path.join(dir, 'index.js');
  for (fileName of fileNames) {
    const file = path.join(dir, fileName);
    const isDir = fs.lstatSync(file).isDirectory();

    let tempName = '';
    for (let i = 0; i < fileName.length; i++) {
      if (fileName[i] === '-') {
        if (i !== fileName.length - 1) {
          ++i;
          tempName += fileName[i].toUpperCase();
        }
      } else {
        tempName += fileName[i];
      }
    }
    fileName = tempName;
    if (!isDir) {
      fileName = path.parse(fileName).name; // get fileName without extension
    }
    if (pascalCase) {
      fileName = fileName[0].toUpperCase() + fileName.slice(1);
    }
    if (file !== indexFile) {
      mp[fileName] = require(file);
    }
  }
  return mp;
}

module.exports = customRequireDirectory;
