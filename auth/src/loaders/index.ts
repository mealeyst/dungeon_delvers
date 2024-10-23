import { Express } from 'express'
import Logger from './logger'
import expressLoader from './express'

type LoaderArgs = {
  expressApp: Express
}

export default async ({ expressApp }: LoaderArgs) => {
  await expressLoader({ app: expressApp })
  Logger.info('✌️ Express loaded')
}
