const express = require('express');
const mustacheExpress = require('mustache-express');
const {StatusCodes} = require('http-status-codes');
const serveIndex = require('serve-index');
const url = require('url');
const path = require('path');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

// const CONTENT = '/run/media/user/DATA/tv series';
const CONTENT = '/media/parth/8050EED950EED4C6/Movies';

app.use('/', serveIndex(CONTENT, {icons: true}));

app.use('/public', express.static(CONTENT));

app.use((req, res, next) => {
    req.url = decodeURI(req.url);
    req.url = path.join('public', req.url);
    console.log(req.url);
    let fileName = '/' + req.url;
    let videoName = path.basename(fileName);
    let videoSource = fileName;
    let subtitleSource = fileName.replace(/\.(mp4|mkv)/, '.vtt');
    res.render('displayVideo.mustache', {
        videoName: videoName,
        videoSource: fileName,
        subtitleSource: subtitleSource
    });
})

module.exports = app;
