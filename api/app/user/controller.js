const { User } = require("./model");
const controller = server => {
  server.route({
    method: "GET",
    path: "/users",
    handler: async (request, h) => {
      const users = await User.query();
      res.json(users);
    }
  });
};

module.exports = {
  controller
};
