import { Router } from 'express'
import logger from '../../loaders/logger'
import passport from 'passport'
import Logger from '../../loaders/logger'
import {
  createUser,
  generatePasswordHash,
  userFromEmail,
} from '../../models/user'
import { validateUser } from '../../models/validation'

export default (router: Router) => {
  router.post('/login', async (req, res, next) => {
    const result = await userFromEmail(req.body.email)
    console.log('result', result)
    req.login(
      { email: req.body.email, password: req.body.password },
      async err => {
        if (err) {
          Logger.error(err)
          next(err)
        } else {
          try {
            console.log('Trying to authenticate')
            passport.authenticate('LocalStrategy')(req, res, function () {
              console.log('Authenticated')
              res.status(201).json('authenticated')
            })
          } catch (error) {
            res.status(400).json({
              message: err.message,
            })
          }
        }
      },
    )
  })
  router.post('/signup', async (req, res) => {
    const { error } = validateUser(req.body)

    if (error) {
      return res.status(400).json({ message: error.message })
    } else {
      const { email, username, password } = req.body

      const passwordHash = await generatePasswordHash(password)
      const result = await createUser(email, passwordHash, username)
      if (result) {
        res.status(201).json({ message: 'User created' })
      } else {
        res.status(400).json({ message: 'User not created' })
      }
    }
  })
}
