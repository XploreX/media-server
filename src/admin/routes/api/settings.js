const config = global.__config;

const express = require('express');

const settings = require(config.root + '/src/all-settings');
// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/update-settings', (req, res) => {
  console.log(req.body);

  if (req.body.location) {
    req.session.location = settings.location = req.body.location;
  }

  if (req.body.port) {
    req.session.port = settings.port = req.body.port;
  }

  if (req.body.verbose) {
    req.session.verbose = settings.verbose = parseInt(req.body.verbose);
  }

  res.send('OK');
});

module.exports = router;
