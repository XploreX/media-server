const path = require('path');
const fs = require('fs');
/**
 *
 * @param {string} absoluteFilePath path of the file
 * @param {Function} filterFunc it is used to filter files to consider
 * @return {Object}
 */
function getAdjacentFiles(absoluteFilePath, filterFunc) {
  const dirPath = path.dirname(absoluteFilePath);
  const files = fs.readdirSync(dirPath).filter((file)=>{
    if (filterFunc) {
      return filterFunc(file);
    }
    return true;
  });
  const indexOfGivenFile = files.indexOf(path.basename(absoluteFilePath));
  const adjacentFiles = {
    previous: '#',
    next: '#',
  };
  if (indexOfGivenFile - 1 > 0) {
    adjacentFiles.previous = files[indexOfGivenFile-1];
  }
  if (indexOfGivenFile + 1 < files.length) {
    adjacentFiles.next = files[indexOfGivenFile+1];
  }
  return adjacentFiles;
}

module.exports = getAdjacentFiles;
