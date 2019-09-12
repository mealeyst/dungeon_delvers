"use strict";
const Model = require("@lib/database");

export default class User extends Model {
  static get tableName() {
    return "users";
  }
}
