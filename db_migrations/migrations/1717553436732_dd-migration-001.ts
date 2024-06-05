import { type MigrationBuilder } from 'node-pg-migrate';


exports.shorthands = undefined;

exports.up = (pgm: MigrationBuilder) => {
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(1000)', notNull: true },
    passhash: { type: 'varchar(1000)', notNull: true },
    status: { type: 'smallint', notNull: true, default: 0 },
    createdAt: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};
