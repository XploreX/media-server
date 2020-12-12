const config = global.__config;

const fs = require('fs');

const supportedImageFormatsReg = new RegExp(
    '\\.' + '(' + config.supportedImageFormats.join('|') + ')' + '$',
    'i',
);

/**
 * @param {string} absoluteImagePath - absolute path of the file which needs
 * to be checked for existence as well as for checking if video format is
 * supported or not
 * @return {bool} - returns truth value for the given absolute path
 */
function isSupportedImage(absoluteImagePath) {
  return (
    fs.existsSync(absoluteImagePath) &&
    supportedImageFormatsReg.test(absoluteImagePath)
  );
}

module.exports = {
  supportedImageFormatsReg: supportedImageFormatsReg,
  isSupportedImage: isSupportedImage,
};
