`use strict`;

import { Knex } from "knex";
import { Model } from "objection";
import connection from "../knexfile.js";

export const knexConnection = Knex(connection);

export default Model.knex(knexConnection);
