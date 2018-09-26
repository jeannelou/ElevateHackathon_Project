const glob = require('./glob');
const http = require('http');
const app = require('./app');


const port = process.env.PORT || 4001;

const server = http.createServer(app);

server.listen(port, () => console.log('Listen to port', port));