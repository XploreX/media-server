const config = require(__dirname+'/../config');

const supportedFormatsReg =
    new RegExp('\\.' + '('+config.supportedVideoFormats.join('|')+')'+'$', 'i');

module.exports = {
    supportedFormatsReg : supportedFormatsReg
}