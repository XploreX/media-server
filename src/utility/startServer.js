module.exports = function(app, port) {
  const {networkInterfaces} = require('os');
  const nets = networkInterfaces();
  app.listen(port, () => {
    console.log('server is up');
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
          console.log('listening at http://' + net.address + ':' + port);
        }
      }
    }
  });
};
