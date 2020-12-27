const config = global.__config;

const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const FileStore = require('session-file-store')(session);
const fs = require('fs');

const adminSessionConfig = require(config.root +
  '/src/admin/admin-session-config');
const settings = require(config.root + '/src/all-settings');
const sync = require(config.root +
  '/src/admin/services/syncSettingsAndSession');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    session({
      secret: [adminSessionConfig.sessionSecret],
      resave: true,
      saveUninitialized: true,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // milliseconds in 30 days
      },
      store: new FileStore(),
    }),
);

app.use('/api', require(config.root + '/src/admin/routes/api'));

app.get('/', (req, res) => {
  // console.log('here', req.session);
  sync(settings, req.session);
  res.render('index.mustache', {
    port: req.session.port,
    location: req.session.location,
    logging: req.session.logging,
    verbose: req.session.verbose,
    logHeaders: req.session.logHeaders,
    images: req.session.images,
    videos: req.session.videos,
  });
});

app.post('/exit', (req, res) => {
  res.send('OK');
  setInterval(() => {
    process.exit(0);
  }, 1000);
});

if (!fs.existsSync(config.logFile)) {
  fs.writeFileSync(config.logFile, '');
  console.log('Made blank log file');
}
app.use('/logs', express.static(config.logFile));
app.use('/assets', express.static(config.root + '/src/admin/assets'));

module.exports = app;
