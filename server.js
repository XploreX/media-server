const {networkInterfaces} = require('os');
const path = require('path');

const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
require('dotenv').config();

const userSettings = require(__dirname + '/src/user-settings');
// const argv = parseArgs(process.argv.slice(2));

const nets = networkInterfaces();
let gui = true;

const argv = yargs(hideBin(process.argv))
    .scriptName('media-server')
    .usage('$0 [args]', 'A localhost Media Server', (yargs) => {
      yargs.option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging',
        count: true,
      });
      yargs.option('location', {
        alias: 'l',
        type: 'string',
        description: 'the path to media content directory',
      });
      yargs.option('port', {
        alias: 'p',
        type: 'number',
        description: 'the port to run server on',
      });
    })
    .alias('h', 'help')
    .version(false).argv;

if (argv.l) {
  userSettings.location = argv.l;
  gui = false;
}

userSettings.argv = argv;

const app = require(path.join(__dirname, 'src', 'index.js'));
const admin = require(path.join(__dirname, 'src', 'admin.js'));

const PORT = argv.port || process.env.PORT || 3000;

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
