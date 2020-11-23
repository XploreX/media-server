const {networkInterfaces} = require('os');
const path = require('path');

const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
require('dotenv').config();

global.__config = require(__dirname+'/config');
const config = global.__config;

const userSettings = require(config.root + '/src/settings');
// const argv = parseArgs(process.argv.slice(2));

const nets = networkInterfaces();

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
      yargs.option('gui', {
        alias: 'g',
        type: 'boolean',
        description: 'open gui mode for configuring settings',
      });
    })
    .alias('h', 'help')
    .version(false).argv;

Object.assign(userSettings, argv);

console.log(process.argv.slice(2).length);
if (process.argv.slice(2).length === 0) {
  argv.g = true;
}

const PORT = argv.port || process.env.PORT || 3000;

if (argv.g) {
  const admin = require(path.join(__dirname, 'src', 'admin', 'index.js'));
  const adminServer = admin.listen(parseInt(PORT) + 1, 'localhost', () => {
    console.log('admin server is up');
    console.log(
        'listening at http://' +
        adminServer.address().address +
        ':' +
        adminServer.address().port,
    );
  });
  admin.on('close', () => {});
} else {
  const app = require(path.join(__dirname, 'src', 'user', 'index.js'));
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
}
