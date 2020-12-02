const fs = require('fs');

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/clearlogs', (req, res) => {
  console.log('deleting logs');
  fs.unlinkSync(config.logFile);
  console.log('removed' + config.logFile);
  fs.writeFile(config.logFile, '', (err) => {
    if (err) throw err;
    console.log('Made blank log file');
  });
  res.send('OK');
});

module.exports = router;
