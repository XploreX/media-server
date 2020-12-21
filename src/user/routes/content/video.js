const config = global.__config;
const requireUncached = require(config.root + '/src/utility/requireUncached');

const path = require('path');
const fs = require('fs');

const express = require('express');

const settings = requireUncached(config.root + '/src/client-settings');
const contentService = require(config.root + '/src/user/services/content');
const getAdjacentFiles = require(config.root +
  '/src/utility/files-util/getAdjacentFiles');
// eslint-disable-next-line new-cap
const router = express.Router();

const contentLocation = settings.location;
const supportedVideoFormatsReg = contentService.video.supportedVideoFormatsReg;
// route to handle video files
router.get('/*', (req, res, next) => {
  req.url = decodeURI(req.url);
  const absoluteFilePath = path.join(contentLocation, unescape(req.url));
  // console.log(absoluteFilePath);
  if (!contentService.video.isSupportedVideo(absoluteFilePath)) {
    return next();
  } else {
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
    const adjacentFiles = getAdjacentFiles(absoluteFilePath, (file) => {
      return supportedVideoFormatsReg.test(file);
    });

    res.render('displayVideo.mustache', {
      videoName: videoName,
      videoSource: videoSource,
      videoType: videoType,
      subtitleSource: subtitleSource,
      next: adjacentFiles['next'],
      prev: adjacentFiles['previous'],
    });
  }
});

module.exports = router;
