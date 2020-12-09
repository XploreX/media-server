const open = require('open');

const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
require('dotenv').config();

global.__config = require(__dirname + '/config');
const config = global.__config;

const settings = require(config.root + '/src/all-settings');
const startServer = require(config.root + '/src/utility/startServer.js');
// const argv = parseArgs(process.argv.slice(2));

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

Object.assign(settings, argv);

console.log(process.argv.slice(2).length && settings.location == undefined);
if (process.argv.slice(2).length === 0 && settings.location == undefined) {
  argv.g = true;
}

const PORT = argv.port || process.env.PORT || 3000;
settings.port = PORT;

if (argv.g) {
  const admin = require(config.root + '/src/admin/index.js');
  const adminServer = admin.listen(parseInt(PORT) + 1, 'localhost', () => {
    console.log('admin server is up');
    const url =
      'http://' +
      adminServer.address().address +
      ':' +
      adminServer.address().port;
    console.log('listening at ' + url);
    open(url);
  });
  admin.on('close', () => {});
} else {
  const app = require(config.root + '/src/user/index.js');
  startServer(app, PORT);
}
