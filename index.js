const express = require('express');
const mustacheExpress = require('mustache-express');
const { StatusCodes } = require('http-status-codes');
const serveIndex = require('serve-index');
const url = require('url');
const path = require('path');
const fs = require('fs')

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

const CONTENT = '/run/media/user/DATA/tv series';

app.use('/', serveIndex(CONTENT, {
    icons: true,
    filter: function (file, pos, list, dir) {
        // console.log(arguments);
        return ((fs.existsSync(path.join(dir, file)) && fs.lstatSync(path.join(dir, file)).isDirectory()) || file.indexOf('.mp4') >= 1);
    }
}));

app.use('/public', express.static(CONTENT));

app.use((req, res, next) => {
    req.url = decodeURI(req.url);
    let absoluteFilePath = path.join(CONTENT, unescape(req.url))
    console.log(absoluteFilePath)
    // added a 404 when the url is invalid
    if (!fs.existsSync(absoluteFilePath)) {
        res.status(404)
        res.end("Not found")
    }
    else {
        req.url = path.join('public', req.url);
        console.log(req.url);
        let fileName = '/' + req.url;
        let videoName = path.basename(fileName);
        let videoSource = fileName;
        let subtitleSource = ''
        let videoType = ''
        // we can add more mime types this way
        if (fileName.indexOf(".mp4")) {
            videoType = "video/mp4"
            subtitleSource = fileName.replace('.mp4', '.vtt');
        }
        res.render('displayVideo.mustache', {
            videoName: videoName,
            videoSource: fileName,
            videoType: videoType,
            subtitleSource: subtitleSource
        });
    }

})

module.exports = app;
