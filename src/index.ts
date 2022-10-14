import dotenv from 'dotenv'
import createApp from './server'
import { version } from '../package.json'

dotenv.config()

// Pull list of allowed origins from .env, default to * if not set
const origin: (string | RegExp)[] | string = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()).map(o => (o.startsWith('/') && o.endsWith('/')) ? new RegExp(o.slice(1,-1)) : o) ?? '*'
const port: number = parseInt(process.env.PORT ?? '3000')

const app = createApp(origin)

app.listen({ port }).then(() => {
  console.log(`🧭 Favicon Scout v${version} running at http://localhost:${port}`)
  console.log(`Allowing requests from: ${origin}`)
}).catch(e => {
  app.log.error(e)
  process.exit(1)
})
