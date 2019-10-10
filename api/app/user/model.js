"use strict";
const Model = require("../database");

class User extends Model {
  static get tableName() {
    return "users";
  }
}

module.exports = {
  User
};
