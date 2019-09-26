exports.up = function(knex) {
  return knex.schema.createTable("characters", t => {
    t.increments("id")
      .unsigned()
      .primary();
    t.string("name").notNull();
    t.tinyint("str").notNull();
    t.tinyint("int").notNull();
    t.tinyint("dex").notNull();
    t.tinyint("con").notNull();
    t.tinyint("cha").notNull();
    t.tinyint("wis").notNull();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("characters");
};
