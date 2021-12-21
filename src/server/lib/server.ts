"use strict";
const express = require('express');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

/**
 * Our Proxy
 */
var app = express();
// proxy the request for static assets

app.get('/', function(req:any, res: any) {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket:any) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});