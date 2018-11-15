import open from 'open';

/*eslint-disable no-console*/

const app = require("./app");
const WsHandler = require('./ws/ws_handler');
const server = require('http').Server(app);

WsHandler.start(server);
const port = 8080;
server.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Starting NodeJS server');
    open(`http://localhost:${port}`);
  }
});


