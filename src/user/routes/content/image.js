const config = global.__config;

const path = require('path');

const express = require('express');

const settings = require(config.root + '/src/client-settings');
const contentService = require(config.root + '/src/user/services/content');
const getAdjacentFiles = require(config.root +
  '/src/utility/files-util/getAdjacentFiles');
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
  const adjacentFiles = getAdjacentFiles(
      absoluteFilePath,
      (file) => {
        return contentService.image.supportedImageFormatsReg.test(file);
      },
      path.join('/content', path.dirname(req.url)),
  );

  req.url = path.join('public', req.url);
  console.log(req.url);
  const fileName = '/' + req.url;
  const imageName = path.basename(fileName);
  const imageSource = fileName;
  //   let imageType = '';
  res.render('displayImage.mustache', {
    imageName: imageName,
    imageSource: imageSource,
    next: adjacentFiles['next'],
    nextImageSource: adjacentFiles['next'].replace('content', 'public'),
    previous: adjacentFiles['previous'],
    previousImageSource: adjacentFiles['previous'].replace('content', 'public'),
  });
});

module.exports = router;
