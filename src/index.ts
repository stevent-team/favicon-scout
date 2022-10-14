#!/usr/bin/env node
import { InvalidArgumentError, program } from 'commander'
import createApp from './server'
import { version } from '../package.json'

const startServer = ({ port, host, origins }) => {
  // If origins is an array, transform regexes
  const origin: (string | RegExp)[] | string = Array.isArray(origins) ? origins.map(o => (o.startsWith('/') && o.endsWith('/')) ? new RegExp(o.slice(1,-1)) : o) : origins

  const app = createApp(origin)

  app.listen({ port, host }).then(() => {
    console.log(`🧭 Favicon Scout v${version} running at http://${host}:${port}`)
    console.log(`Allowing requests from: ${origin}`)
  }).catch(e => {
    app.log.error(e)
    process.exit(1)
  })
}

program
  .name('favicon-scout')
  .description('Start a favicon scout web server')
  .version(version)
  .option('-p, --port <port>', 'port to use for http server', v => {
    const parsed = parseInt(v)
    if (isNaN(parsed)) throw new InvalidArgumentError('Not a valid number')
    return parsed
  }, 3000)
  .option('-h, --host <url>', 'host to use for http server', 'localhost')
  .option('-o, --origins <urls...>', 'urls or regexes allowed by CORS', '*')
  .action(startServer)

program.parse()
