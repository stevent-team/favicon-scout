import fastify from 'fastify'
import { name, version } from '../package.json'
import getFavicon from './favicon'

const server = fastify()

server.get('/', () => ({ name, version }))

server.get('/:url', getFavicon)
server.get('/:url/:size', getFavicon)

server.listen({ port: 3002 }).catch(e => {
  server.log.error(e)
  process.exit(1)
})
