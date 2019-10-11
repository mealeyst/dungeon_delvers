exports.up = function(knex) {
  return knex.schema.createTable("characters", t => {
    t.increments("id")
      .notNull()
      .unsigned()
      .primary();
    t.integer("user")
      .notNull()
      .unsigned()
      .index()
      .references("id")
      .inTable("users");
    t.string("name", 12).notNull();
    t.integer("level")
      .notNull()
      .defaultTo(1);
    t.integer("background")
      .notNull()
      .unsigned()
      .index()
      .references("id")
      .inTable("backgounds");
    t.integer("class")
      .notNull()
      .unsigned()
      .index()
      .references("id")
      .inTable("classes");
    t.integer("race")
      .notNull()
      .unsigned()
      .index()
      .references("id")
      .inTable("races");
    t.integer("alignment").notNull();
    t.integer("experience").notNull();
    t.integer("personality")
      .notNull()
      .unsigned();
    t.integer("ideals")
      .notNull()
      .unsigned();
    t.integer("bonds")
      .notNull()
      .unsigned();
    t.integer("flaws")
      .notNull()
      .unsigned();
    t.integer("str").notNull();
    t.integer("int").notNull();
    t.integer("dex").notNull();
    t.integer("con").notNull();
    t.integer("cha").notNull();
    t.integer("wis").notNull();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("characters");
};
