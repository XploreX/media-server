const fs = require('fs');
const path = require('path');

const express = require('express');
const serveIndex = require('serve-index');

const config = global.__config;
const services = require(config.root + '/src/user/services');
const settings = require(config.root + '/src/settings');

// eslint-disable-next-line new-cap
const router = express.Router();

const content = settings.location;
const supportedVideoFormatsReg = services.video.supportedVideoFormatsReg;

router.get(
    '/*',
    serveIndex(content, {
      icons: true,
      filter: function(file, pos, list, dir) {
        return (
          (fs.existsSync(path.join(dir, file)) &&
          fs.lstatSync(path.join(dir, file)).isDirectory()) ||
        supportedVideoFormatsReg.test(file)
        );
      },
    }),
);

// route to handle video files
router.get('/*', (req, res, next) => {
  req.url = decodeURI(req.url);
  const absoluteFilePath = path.join(content, unescape(req.url));
  // console.log(absoluteFilePath);
  if (!services.video.isSupportedVideo(absoluteFilePath)) {
    next();
  } else {
    const originalFileName = path.basename(absoluteFilePath);
    req.url = path.join('public', req.url);
    console.log(req.url);
    const fileName = '/' + req.url;
    const videoName = path.basename(fileName);
    const videoSource = fileName;
    let subtitleSource = '';
    let videoType = '';
    // we can add more mime types this way
    videoType = 'video/mp4';
    subtitleSource = fileName.replace(supportedVideoFormatsReg, '.srt');
    if (
      !fs.existsSync(absoluteFilePath.replace(supportedVideoFormatsReg, '.srt'))
    ) {
      subtitleSource = fileName.replace(supportedVideoFormatsReg, '.vtt');
    }
    const dir = path.dirname(absoluteFilePath);
    const files = fs.readdirSync(dir).filter((file) => {
      return supportedVideoFormatsReg.test(file);
    });
    const pos = files.indexOf(originalFileName);
    let next = '#';
    let prev = '#';
    if (pos + 1 < files.length) {
      next = files[pos + 1];
    }
    if (pos - 1 >= 0) prev = files[pos - 1];
    res.render('displayVideo.mustache', {
      videoName: videoName,
      videoSource: videoSource,
      videoType: videoType,
      subtitleSource: subtitleSource,
      next: next,
      prev: prev,
    });
  }
});

module.exports = router;
