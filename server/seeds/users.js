exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("users").insert([
        {
          id: 1,
          username: "alpha",
          email: "alpha@example.com",
          password: "password"
        },
        {
          id: 2,
          username: "beta",
          email: "beta@example.com",
          password: "password"
        },
        {
          id: 3,
          username: "charlie",
          email: "charlie@example.com",
          password: "password"
        }
      ]);
    });
};
