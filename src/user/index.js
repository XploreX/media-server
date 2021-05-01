const config = global.__config;
const requireUncached = require(config.root + '/src/utility/requireUncached');

const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const mustacheExpress = require('mustache-express');
const favicon = require('serve-favicon');

const {enableMorgan} = require(config.root + '/src/user/services/logging.js');
const apiRouter = require(config.root + '/src/user/routes/api');
const contentRouter = requireUncached(config.root + '/src/user/routes/content');

// All the client-settings and routers which
// import client settings should be imported using requiredUncached
const settings = requireUncached(config.root + '/src/client-settings');
const userSessionConfig = require(config.root +
  '/src/user/user-session-config');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
    session({
      secret: [userSessionConfig.sessionSecret],
      resave: false,
      saveUninitialized: true,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // milliseconds in 30 days
      },
      store: new FileStore(),
    }),
);

app.use(favicon(config.root + '/src/user/public/favicon.ico'));

app.get('/', (req, res) => {
  res.redirect('/content');
});

if (settings.verbose == 1) {
  enableMorgan(app, config.logFile, {logAllReqHeader: false});
}
if (settings.verbose >= 2) {
  enableMorgan(app, config.logFile, {logAllReqHeader: true});
}
app.use('/api', apiRouter);
app.use('/content', contentRouter);

const content = settings.location;
app.use('/public', express.static(content));
app.use('/assets', express.static(config.root + '/src/user/assets'));
app.use((req, res, next) => {
  res.status(404).render('404.mustache');
});

module.exports = app;
