const express = require('express');
const session = require('express-session');
const morganBody = require('morgan-body');
const mustacheExpress = require('mustache-express');
const FileStore = require('session-file-store')(session);
const favicon = require('serve-favicon');

const config = require(__dirname + '/config');
const apiRouter = require(config.root + '/routes/api');
const contentRouter = require(config.root + '/routes/content');
const userSettings = require(config.root + '/user-settings');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

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

app.use(favicon(config.root + '/public/favicon.ico'));

app.get('/', (req, res) => {
  res.redirect('/content');
});

if (userSettings.argv.v == 1) morganBody(app, {logAllReqHeader: false});
if (userSettings.argv.v >= 2) morganBody(app, {logAllReqHeader: true});
app.use('/api', apiRouter);
app.use('/content', contentRouter);

const content = userSettings.location;
app.use('/public', express.static(content));
app.use('/static', express.static(config.root + '/assets'));

module.exports = app;
