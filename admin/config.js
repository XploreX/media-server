module.exports = Object.freeze({
  root: __dirname,
  sessionSecret: process.env.SESSION_SECRET || 'secr3t',
});
