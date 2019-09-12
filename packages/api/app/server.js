"use strict";
const Hapi = require("@hapi/hapi");

const server = Hapi.server({
  port: 8080,
  host: "localhost"
});

const api = async () => {
  await server.start();
  console.log("Server running on port 8080");
};

server.route({
  method: "GET",
  path: "/",
  handler: (request, h) => {
    return "Hello World!";
  }
});

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

api();

module.exports = {
  server
};
