const config = global.__config;
const express = require('express');

const startServer = require(config.root + '/src/utility/startServer');
const settings = require(config.root + '/src/settings');

// eslint-disable-next-line new-cap
const router = express.Router();
let server;
let serverRunning = false;

router.get('/start', (req, res) => {
  delete require.cache[require.resolve(config.root + '/src/user/index.js')];
  const clientApp = require(config.root + '/src/user/index.js');
  server = startServer(clientApp, settings.port, config.logFile);
  serverRunning = true;
  res.send('OK');
});

router.get('/stop', (req, res) => {
  server.close();
  stream = fs.createWriteStream(config.logFile, {flags: 'a'});
  const message = 'Server Stopped';
  console.log(message);
  stream.write(message + '\n');
  stream.end();
  serverRunning = false;
  res.send('OK');
});

router.get('/status', (req, res) => {
  if (serverRunning == true) res.send('OK');
  else res.send('FAIL');
});

module.exports = router;
