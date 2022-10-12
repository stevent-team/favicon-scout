import fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'

import { name, version } from '../package.json'
import getFavicon from './favicon'

// Pull list of allowed origins from .env, default to * if not set
dotenv.config()
const origin: (string | RegExp)[] | string = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()).map(o => (o.startsWith('/') && o.endsWith('/')) ? new RegExp(o.slice(1,-1)) : o) ?? '*'

const server = fastify()

server.register(cors, { origin })

server.get('/', () => ({ name, version }))

server.get('/:path', getFavicon)
server.get('/:path/:size', getFavicon)

server.listen({ port: 3002 }).then(() => {
  console.log(`🧭 Favicon Scout v${version}`)
  console.log(`Allowing requests from: ${origin}`)
}).catch(e => {
  server.log.error(e)
  process.exit(1)
})
