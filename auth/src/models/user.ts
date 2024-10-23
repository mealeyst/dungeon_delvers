import { pool } from '../services/database/postgres'
import bcrypt from 'bcrypt'

export const createUser = async (
  email: string,
  passwordHash: string,
  username: string,
) => {
  const query = {
    text: 'INSERT INTO app_user (email, password_hash, username) VALUES ($1, $2, $3)',
    values: [email, passwordHash, username],
  }
  return await pool.query(query)
}

export const userFromEmail = async (email: string) => {
  const query = {
    text: 'SELECT * FROM app_user WHERE email = $1',
    values: [email],
  }
  const { rows } = await pool.query(query)
  return rows[0]
}

export const generatePasswordHash = async (plaintextPassword: string) => {
  const saltRounds = 10
  return bcrypt.hash(plaintextPassword, saltRounds)
}

export const verifyPassword = (
  plaintextPassword: string,
  passwordHash: string,
) => {
  return bcrypt.compare(plaintextPassword, passwordHash)
}
