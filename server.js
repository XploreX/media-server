const {networkInterfaces} = require('os');

const nets = networkInterfaces();

const app = require(__dirname + '/index');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('server is up');
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4') {
                console.log('listening at http://' + net.address + ':' + PORT);
            }
        }
    }
})
