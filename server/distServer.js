import express from 'express';
import path from 'path';
import open from 'open';
import compression from 'compression';
const app = require("./app");
const WsHandler = require('./ws/ws_handler');
const server = require('http').Server(app);

/*eslint-disable no-console */

const port = 8080;
app.use(compression());
app.use(express.static('dist'));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

WsHandler.start(server);

server.listen(port, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Starting NodeJS server');
    open(`http://localhost:${port}`);
  }
});
