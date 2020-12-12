const config = global.__config;
const requireUncached = require(config.root + '/src/utility/requireUncached');

const path = require('path');
const fs = require('fs');

const express = require('express');

const settings = requireUncached(config.root + '/src/client-settings');
const contentService = require(config.root + '/src/user/services/content');
// eslint-disable-next-line new-cap
const router = express.Router();

const contentLocation = settings.location;

// route to handle image files
router.get('/*', (req, res, next) => {
  req.url = decodeURI(req.url);
  const absoluteFilePath = path.join(contentLocation, unescape(req.url));
  // console.log(absoluteFilePath);
  if (
    !settings.image ||
    !contentService.image.isSupportedImage(absoluteFilePath)
  ) {
    return next();
  }

  let files = fs.readdirSync(path.dirname(absoluteFilePath)).filter((file) => {
    return contentService.image.supportedImageFormatsReg.test(file);
  });

  files = files.map((file) => {
    return path.join(path.dirname(req.url), file);
  });

  console.log(req.url);
  res.render('displayImage.mustache', {
    files: files,
    currentFileIndex: files.indexOf(req.url),
  });
});

module.exports = router;
