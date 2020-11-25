const config = global.__config;

const express = require('express');
const session = require('express-session');
const startServer = require(config.root + '/src/utility/startServer');
const FileStore = require('session-file-store')(session);

const adminSessionConfig = require(config.root +
  '/src/admin/admin-session-config');

const settings = require(config.root + '/src/settings');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    session({
      secret: [adminSessionConfig.sessionSecret],
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // milliseconds in 30 days
      },
      store: new FileStore(),
    }),
);

app.get('/start', (req, res) => {
  delete require.cache[require.resolve(config.root + '/src/user/index.js')];
  const clientApp = require(config.root + '/src/user/index.js');
  startServer(clientApp, settings.port);
  res.send('Done');
});
app.use('/logs', express.static(config.logFile));

module.exports = app;
