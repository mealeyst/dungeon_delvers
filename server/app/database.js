`use strict`;

const Knex = require("knex");
const { Model } = require("objection");
const connection = require("../knexfile.js");
console.log(connection);

const knexConnection = Knex(connection);

const ObjectionModule = Model.knex(knexConnection);

module.exports = {
  Module: ObjectionModule,
  connection: knexConnection
};
