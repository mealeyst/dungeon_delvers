import { Client } from 'pg'

const {
  DB_USER,
  DB_HOST = 'localhost',
  DB_PASSWORD,
  DB_DEFAULT_DB,
  DB_PORT,
} = process.env

export const client = new Client({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DEFAULT_DB,
  password: DB_PASSWORD,
  port: Number(DB_PORT),
})
