const config = global.__config;
const requireUncached = require(config.root + '/src/utility/requireUncached');

const customRequireDirectory = require(config.root +
  '/src/utility/customRequireDirectory');

const settings = requireUncached(config.root + '/src/client-settings');
const {supportedVideoFormatsReg} = require(config.root +
  '/src/user/services/content/video');
const {supportedImageFormatsReg} = require(config.root +
  '/src/user/services/content/image');

/**
 * function to determine if given media file should be displayed or not
 * @param {string} fileName Name of the media file
 * @return {boolean} returns true if given media file should be displayed,
 * false otherwise
 */
function contentAllowed(fileName) {
  if (settings.video && supportedVideoFormatsReg.test(fileName)) {
    return true;
  }
  if (settings.image && supportedImageFormatsReg.test(fileName)) {
    return true;
  }
  return false;
}

module.exports = {
  ...customRequireDirectory(__dirname),
  contentAllowed: contentAllowed,
};
