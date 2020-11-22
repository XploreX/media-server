const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const config = require(__dirname + '/config');
const adminSettings = require(__dirname + '/admin-settings.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    session({
      secret: [config.sessionSecret],
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // milliseconds in 30 days
      },
      store: new FileStore(),
    }),
);

app.get('/start', (req, res) => {
  adminSettings.server.listen();
  res.send('Done');
});

module.exports = app;
