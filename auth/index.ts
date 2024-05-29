import Hapi from '@hapi/hapi'
import bcrypt from 'bcrypt'

import config from './src/config'

const start = async () => {
  const server = Hapi.server({
    port: config.port,
  })

  server.route({
    method: 'POST',
    path: '/register',
    handler: async (request, h) => {
      const { email, password } = request.payload as {
        email: string
        password: string
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      return hashedPassword
    },
  })

  await server.start()
  console.log(`Server running on ${server.info.uri}`)
}
