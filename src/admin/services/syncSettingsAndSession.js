/**
 * @param {Object} settings the express app to start morgan-body on
 * @param {session} session relative file path to logfile
 */
function sync(settings, session) {
  settings.location = session.location = settings.location || session.location;
  settings.port = session.port = settings.port || session.port;
  settings.verbose = session.verbose = settings.verbose || session.verbose || 0;
  settings.image = session.images = settings.image || session.images || 0;
  settings.video = session.videos = settings.video || session.videos || 0;
}

module.exports = sync;
