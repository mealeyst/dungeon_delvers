import session from 'express-session'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import { pool } from './database/postgres'
import express from 'express'

// export const signUp = async (email: string, password: string, name: string) => {
//   const salt = crypto.randomBytes(16).toString('hex')
//   const hash = crypto
//     .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
//     .toString('hex')
//   const query = {
//     text: 'INSERT INTO users(email, password, salt, name) VALUES($1, $2, $3, $4)',
//     values: [email, hash, salt, name],
//   }
//   await pool.query(query)
// }

type User = {
  id: number
  email: string
  password: string
  salt: string
}

export default (app: express.Application) => {
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      name: 'sid',
      cookie: {
        httpOnly: true,
        maxAge: 20 * 60 * 1000,
      },
    }),
  )

  passport.serializeUser((user, done) => {
    console.log('SERIAL', user)
    done(null, (user as User).id)
  })

  passport.deserializeUser(async (userId, done) => {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      value: [userId],
    }
    const { rows } = await pool.query(query)
    if (rows.length === 0) {
      return done(new Error('User not found'))
    }
    const user = rows[0]
    done(null, user)
  })
  passport.use(
    new LocalStrategy(async (email: string, password: string, done) => {
      console.log('LOCAL_STRATEGY', email, password)
      // console.log('Are we hitting the Auth Service?')
      const query = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      }
      const { rows } = await pool.query(query)
      if (rows.length === 0) {
        return done(null, false, { message: 'Incorrect username or password.' })
      }
      const user = rows[0]
      const hash = await bcrypt.hashSync(password, user.salt)
    }),
  )
  app.use(passport.initialize())
  app.use(passport.session())
}
