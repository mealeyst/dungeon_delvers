"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _socket = require("socket.io-client");

var _process$env = process.env,
    APP_BASE_URL = _process$env.APP_BASE_URL,
    APP_SERVER_PORT = _process$env.APP_SERVER_PORT;
var URL = "http://".concat(APP_BASE_URL, ":").concat(APP_SERVER_PORT);
var socket = (0, _socket.io)(URL, {
  autoConnect: false
});
socket.onAny(function (event) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  console.log(event, args);
});
var _default = socket;
exports["default"] = _default;