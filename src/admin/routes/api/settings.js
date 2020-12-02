const config = global.__config;

const express = require('express');

const settings = require(config.root + '/src/settings');
// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/update-settings', (req, res) => {
  console.log(req.body);
  settings.location = req.body.location;
  req.session.location = settings.location;
  settings.port = req.body.port;
  req.session.port = settings.port;
  settings.port = req.body.port;
  if (req.body.logging) {
    req.session.logging = true;
    settings.verbose = 1;
  } else {
    req.session.logging = false;
  }
  if (req.body.logHeaders) {
    req.session.logHeaders = true;
    settings.verbose = 2;
  } else req.session.logHeaders = false;

  res.send('OK');
});

module.exports = router;
