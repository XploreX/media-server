const {networkInterfaces} = require('os');
const nets = networkInterfaces();
const fs = require('fs');

/**
 * @param {express-app} app the express app to start on all interfaces
 * @param {string} port the port to start the app on
 * @param {string} logfile if you want to log the console stuff to file also
 * @return {Http.server} the server instance
 */
function startServer(app, port, logfile = undefined) {
  let stream;
  if (logfile) {
    stream = fs.createWriteStream(logfile, {flags: 'a'});
  }
  const server = app.listen(port, () => {
    const message = 'Server is up';
    console.log(message);
    if (logfile) stream.write(message + '\n');
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
          const message = 'Listening at http://' + net.address + ':' + port;
          console.log(message);
          if (logfile) stream.write(message + '\n');
        }
      }
    }
  });
  return server;
}
module.exports = startServer;
