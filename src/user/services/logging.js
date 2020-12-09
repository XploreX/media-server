const morganBody = require('morgan-body');
const fs = require('fs');
const path = require('path');

/**
 * @param {Express} app the express app to start morgan-body on
 * @param {string} logFile the relative file path to logfile
 * @param {Object} params the extra parameters to be passed
 * to morgan-body while logging
 */
function enableMorgan(app, logFile, params) {
  if (!fs.existsSync(path.dirname(logFile))) {
    fs.mkdirSync(path.dirname(logFile));
  }
  const log = fs.createWriteStream(logFile, {
    flags: 'a',
  });
  morganBody(app, {logAllReqHeader: true});
  morganBody(
      app,
      Object.assign(
          {noColors: true, stream: log, logResponseBody: false},
          params,
      ),
  );
}

module.exports = {
  enableMorgan: enableMorgan,
};
