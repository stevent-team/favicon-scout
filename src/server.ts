import fastify from 'fastify'
import cors from '@fastify/cors'

import { name, version } from '../package.json'
import getFavicon from './getFavicon'

const createApp = (origin: (string | RegExp)[] | string = '*') => {
  const app = fastify()

  app.register(cors, { origin })

  app.get('/', () => ({ name, version }))

  app.get('/:path', getFavicon)
  app.get('/:path/:size', getFavicon)

  return app
}

export default createApp
