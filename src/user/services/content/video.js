const config = global.__config;

const fs = require('fs');

const supportedVideoFormatsReg = new RegExp(
    '\\.' + '(' + config.supportedVideoFormats.join('|') + ')' + '$',
    'i',
);

/**
 * @param {string} absoluteVideoPath - absolute path of the file which needs
 * to be checked for existence as well as for checking if video format is
 * supported or not
 * @return {bool} - returns truth value for the given absolute path
 */
function isSupportedVideo(absoluteVideoPath) {
  return (
    fs.existsSync(absoluteVideoPath) &&
    supportedVideoFormatsReg.test(absoluteVideoPath)
  );
}

module.exports = {
  supportedVideoFormatsReg: supportedVideoFormatsReg,
  isSupportedVideo: isSupportedVideo,
};
