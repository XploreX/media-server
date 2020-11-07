const express = require('express');
const mustacheExpress = require('mustache-express');
const {StatusCodes} = require('http-status-codes');
const serveIndex = require('serve-index');
const url = require('url');
const path = require('path');
const fs = require('fs')

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'mustache');
app.engine('mustache', mustacheExpress());

const CONTENT = '/run/media/user/DATA/tv series';

app.use('/', serveIndex(CONTENT, {icons: true,
    filter:function(file,pos,list,dir) {
			console.log(arguments);
			return ((fs.existsSync(path.join(dir,file)) && fs.lstatSync(path.join(dir,file)).isDirectory()) || file.indexOf('.mp4') >= 1);
		}
}));

app.use('/public', express.static(CONTENT));

app.use((req, res, next) => {
    req.url = decodeURI(req.url);
    req.url = path.join('public', req.url);
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
