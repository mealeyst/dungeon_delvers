import { Router } from 'express'
import auth from './routes/auth'

export default () => {
  const router = Router()
  auth(router)
  return router
}
