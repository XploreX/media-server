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

const PUBLIC = '/run/media/user/DATA/tv series';

app.use('/', serveIndex(PUBLIC, {icons: true}));

app.use('/content', express.static(PUBLIC));

app.use((req, res, next) => {
    req.url = decodeURI(req.url);
    req.url = path.join('content', req.url);
    console.log(req.url);
    let fileName = '/' + req.url;
    let videoName = path.basename(fileName);
    let videoSource = fileName;
    let subtitleSource = fileName.replace('.mp4', '.vtt');
    res.render('displayVideo.mustache', {
        videoName: videoName,
        videoSource: fileName,
        subtitleSource: subtitleSource
    });
})

module.exports = app;
