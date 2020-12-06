const config = global.__config;

const express = require('express');
const fs = require('fs');

const startServer = require(config.root + '/src/utility/startServer');
const settings = require(config.root + '/src/all-settings');

// eslint-disable-next-line new-cap
const router = express.Router();
let server;
settings.serverRunning = false;

router.get('/start', (req, res) => {
  delete require.cache[require.resolve(config.root + '/src/user/index.js')];
  const clientApp = require(config.root + '/src/user/index.js');
  server = startServer(clientApp, settings.port, config.logFile);
  settings.serverRunning = true;
  res.send('OK');
});

router.get('/stop', (req, res) => {
  server.close();
  stream = fs.createWriteStream(config.logFile, {flags: 'a'});
  const message = 'Server Stopped';
  console.log(message);
  stream.write(message + '\n');
  stream.end();
  settings.serverRunning = false;
  res.send('OK');
});

router.get('/status', (req, res) => {
  if (settings.serverRunning == true) res.send('OK');
  else res.send('FAIL');
});

module.exports = router;
