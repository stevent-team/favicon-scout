import { version } from '../../package.json'
import createApp from '../server'

const startServerCommand = ({ port, host, origins }) => {
  // If origins is an array, transform regexes
  const origin: (string | RegExp)[] | string = Array.isArray(origins)
    ? origins.map(o => (o.startsWith('/') && o.endsWith('/')) ? new RegExp(o.slice(1,-1)) : o)
    : origins

  // Create server and listen on provided host/port
  createApp().listen({ port, host }).then(() => {
    console.log(`🧭 Favicon Scout v${version} running at http://${host}:${port}`)
    console.log(`Allowing requests from: ${origin}`)
  }).catch(e => {
    console.error(e)
    process.exit(1)
  })
}

export default startServerCommand
