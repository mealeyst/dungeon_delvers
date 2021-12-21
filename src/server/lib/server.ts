"use strict";
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('../../../webpack.config')
const { Server } = require("socket.io");
const io = new Server(server);

const express = require('express');
// const proxy = require('proxy-middleware');
const url = require('url');

/**
 * Our Proxy
 */
var app = express();
// proxy the request for static assets

app.get('/v1/*', function(req:any, res: any) {
  res.send('<h1>Hello world</h1>');
});

// app.use('/', proxy(url.parse('http://localhost:8081/')));


/**
 * Our Webpack Dev Server
 */
var server = new WebpackDevServer(webpack(config));

/**
 * Run both the servers!
 */
server.listen(8080, "localhost", function() {});

io.on('connection', (socket:any) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});