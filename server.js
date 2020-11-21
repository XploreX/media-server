const {networkInterfaces} = require('os');
const path = require('path');

const parseArgs = require('minimist');
require('dotenv').config();

const userSettings = require(__dirname + '/src/user-settings');
const argv = parseArgs(process.argv.slice(2));

const nets = networkInterfaces();
let gui = true;

if ('l' in argv) {
  userSettings.location = argv.l;
  gui = false;
}

if ('location' in argv) {
  userSettings.location = argv.location;
  gui = false;
}
if ('g' in argv || userSettings.location == undefined) {
  gui = true;
}

const app = require(path.join(__dirname, 'src', 'index.js'));
const admin = require(path.join(__dirname, 'src', 'admin.js'));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('server is up');
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
      if (net.family === 'IPv4' && !net.internal) {
        console.log('listening at http://' + net.address + ':' + PORT);
      }
    }
  }
});

if (gui) {
  server.close();
  const adminServer = admin.listen(PORT + 1, 'localhost', () => {
    console.log('admin server is up');
    console.log(
        'listening at http://' +
        adminServer.address().address +
        ':' +
        adminServer.address().port,
    );
  });
}
