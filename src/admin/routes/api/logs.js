const config = global.__config;

const express = require('express');
const fs = require('fs');

const root = config.root;
const settings = require(root + '/src/all-settings');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/clearlogs', (req, res) => {
  if (
    settings.serverRunning == false ||
    (settings.serverRunning == true && settings.verbose == 0)
  ) {
    // delete the log file
    console.log('deleting logs');
    fs.unlinkSync(config.logFile);
    console.log('removed' + config.logFile);

    // make blank log file for avoiding crash
    console.log('Made blank log file');
    fs.writeFileSync(config.logFile, '');

    // send OK if pass
    res.send('OK');
  } else {
    // If server running and verbosity is on, don't allow deleting logs
    res.send('FAIL');
  }
});

module.exports = router;
