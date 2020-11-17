module.exports = Object.freeze({
  root: __dirname,
  sessionSecret: process.env.SESSION_SECRET || 'secret',
  supportedVideoFormats: [
    'mp4',
    'mkv',
    'avi',
  ],
});
