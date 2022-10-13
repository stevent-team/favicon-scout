import fastify from 'fastify'
import cors from '@fastify/cors'
import dotenv from 'dotenv'

import { name, version } from '../package.json'
import getFavicon from './getFavicon'

// Pull list of allowed origins from .env, default to * if not set
dotenv.config()
const origin: (string | RegExp)[] | string = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()).map(o => (o.startsWith('/') && o.endsWith('/')) ? new RegExp(o.slice(1,-1)) : o) ?? '*'
const port: number = parseInt(process.env.PORT ?? '3000')

const app = fastify()

app.register(cors, { origin })

app.get('/', () => ({ name, version }))

app.get('/:path', getFavicon)
app.get('/:path/:size', getFavicon)

app.listen({ port }).then(() => {
  console.log(`🧭 Favicon Scout v${version} running at http://localhost:${port}`)
  console.log(`Allowing requests from: ${origin}`)
}).catch(e => {
  app.log.error(e)
  process.exit(1)
})

export default app
