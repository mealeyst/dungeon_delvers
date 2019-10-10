exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex("characters")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("characters").insert([
        {
          id: 1,
          name: "Merrik",
          str: 10,
          int: 10,
          dex: 10,
          con: 10,
          cha: 10,
          wis: 10
        },
        {
          id: 2,
          name: "Ellie",
          str: 10,
          int: 10,
          dex: 10,
          con: 10,
          cha: 10,
          wis: 10
        },
        {
          id: 3,
          name: "Dolce",
          str: 10,
          int: 10,
          dex: 10,
          con: 10,
          cha: 10,
          wis: 10
        },
        {
          id: 4,
          name: "Loxy",
          str: 10,
          int: 10,
          dex: 10,
          con: 10,
          cha: 10,
          wis: 10
        }
      ]);
    });
};
