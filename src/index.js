const path = require('path');
const fs = require('fs');

const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const { StatusCodes } = require('http-status-codes');
const serveIndex = require('serve-index');
require('dotenv').config()

const config = require(__dirname + '/config');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

app.use(session({
    secret : [config.sessionSecret],
    resave : false,
    saveUninitialized : true,
    cookie : {
        maxAge : 360000 //milliseconds in 1 hour
    }
}));

const CONTENT = process.env.LOCATION;
const supportedFormatsReg = new RegExp('\\.'+config.supportedFormats.join('|'),'i');

app.use('/', serveIndex(CONTENT, {
    icons: true,
    filter: function (file, pos, list, dir) {
        // console.log(arguments);
        return ((fs.existsSync(path.join(dir, file)) && fs.lstatSync(path.join(dir, file)).isDirectory()) || supportedFormatsReg.test(file));
    }
}));

app.use('/public', express.static(CONTENT));

app.use((req, res, next) => {
    req.url = decodeURI(req.url);
    let absoluteFilePath = path.join(CONTENT, unescape(req.url))
    console.log(absoluteFilePath)
    // added a 404 when the url is invalid
    if (!fs.existsSync(absoluteFilePath)) {
        res.sendStatus(StatusCodes.NOT_FOUND)
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
