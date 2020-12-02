const config = global.__config;

const fs = require('fs');

const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const FileStore = require('session-file-store')(session);

const adminSessionConfig = require(config.root +
  '/src/admin/admin-session-config');
const settings = require(config.root + '/src/settings');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

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

app.use('/api', require(config.root + '/src/admin/routes/api'));

app.post('/api/update', (req, res) => {
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

app.get('/api/clearlogs', (req, res) => {
  console.log('deleting logs');
  fs.unlinkSync(config.logFile);
  console.log('removed' + config.logFile);
  fs.writeFile(config.logFile, '', (err) => {
    if (err) throw err;
    console.log('Made blank log file');
  });
  res.send('OK');
});

app.get('/', (req, res) => {
  res.render('index.mustache', {
    port: settings.port || req.session.port,
    location: settings.location || req.session.location,
    logging: settings.logging || req.session.logging,
    logHeaders: settings.logHeaders || req.session.logHeaders,
  });
});

app.use('/logs', express.static(config.logFile));
app.use('/static', express.static(config.root + '/src/admin/assets'));

module.exports = app;
