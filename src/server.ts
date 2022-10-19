import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import cors from '@fastify/cors'

import { name, version } from '../package.json'
import { FALLBACK_HEADER_KEY } from './constants'
import fallback from './fallback'
import getFavicon from './getFavicon'

const createApp = (origin: (string | RegExp)[] | string = '*') => {
  const app = fastify()

  app.register(cors, { origin })

  app.get('/', () => ({ name, version }))

  app.get('/:path', getFaviconHandler)
  app.get('/:path/:size', getFaviconHandler)

  return app
}

const getFaviconHandler = async (req: FastifyRequest, res: FastifyReply) => {
  // Pull out queries
  const { path, size: sizeParam } = req.params as {
    path: string,
    size: string | undefined,
  }

  // Format arguments
  const size = sizeParam ? parseInt(sizeParam) : undefined
  const url = new URL(path.startsWith('http') ? path : `https://${path}`)

  // Get Favicon
  const { image, didFallback } = await getFavicon(url, { size })

  // Write headers
  res.type('image/webp')
  res.header(FALLBACK_HEADER_KEY, didFallback)

  // Return image
  return image.webp().toBuffer().catch(() => {
    res.header(FALLBACK_HEADER_KEY, 'true')
    return fallback(url.host, size).webp().toBuffer()
  })
}

export default createApp
