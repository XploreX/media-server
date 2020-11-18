const {networkInterfaces} = require('os');
const path = require('path');

const parseArgs = require('minimist');
require('dotenv').config();

const userSettings = require(__dirname + '/src/user-settings');
const argv = parseArgs(process.argv.slice(2));

const nets = networkInterfaces();

if ('l' in argv) {
  userSettings.location = argv.l;
}

if ('location' in argv) {
  userSettings.location = argv.location;
}

const app = require(path.join(__dirname, 'src', 'index.js'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
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
