const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const morganBody = require('morgan-body');
const FileStore = require('session-file-store')(session);
require('dotenv').config();

const config = require(__dirname + '/config');
const videoRouter = require(config.root + '/routes/video');
const contentRouter = require(config.root + '/routes/content');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: [config.sessionSecret],
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // milliseconds in 30 days
  },
  store: new FileStore(),
}));

morganBody(app, {logAllReqHeader: false});

app.use('/video', videoRouter);
app.use('/', contentRouter);

const CONTENT = process.env.LOCATION;
app.use('/public', express.static(CONTENT));


module.exports = app;
