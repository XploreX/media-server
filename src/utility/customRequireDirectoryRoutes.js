const path = require('path');
const fs = require('fs');
const express = require('express');

/**
 *
 * @param {string} dir -path of directory which is to be imported
 * @param {bool} pascalCase -should be true if pascalCase
 * is to be used for naming keys of export object
 * @param {object} router -instance of express.Router , if not
 * present new router will be created and returned
 * @return {object} return express router with imported files as
 * it's routes
 */
function customRequireDirectoryRoutes(dir, pascalCase = false, router = null) {
  if (router === null) {
    // eslint-disable-next-line new-cap
    router = express.Router();
  }
  const fileNames = fs.readdirSync(dir);
  const indexFile = path.join(dir, 'index.js');

  for (fileName of fileNames) {
    // eslint-disable-next-line prefer-const
    let file = path.join(dir, fileName);
    // eslint-disable-next-line prefer-const
    let isDir = fs.lstatSync(file).isDirectory();
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
    if (pascalCase) fileName = fileName[0] + fileName.slice(1);
    if (file !== indexFile) {
      router.use('/', require(file));
    }
  }
  return router;
}

module.exports = customRequireDirectoryRoutes;
