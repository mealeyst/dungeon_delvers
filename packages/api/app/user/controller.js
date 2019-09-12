const { server } = require("@lib/server");

const routes = server.route({
  method: "GET",
  path: "/users",
  handler: (request, h) => {
    return "Users!";
  }
});

module.exports = {
  routes
};
