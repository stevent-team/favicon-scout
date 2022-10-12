import { FastifyReply, FastifyRequest } from 'fastify'
import { Sharp } from 'sharp'

import fallback from './fallback'
import fetchImage from './fetchImage'
import scrapeLink from './scrapeLink'

const getFavicon = async (req: FastifyRequest, res: FastifyReply) => {
  const { path, size } = req.params as {
    path: string,
    size: string | undefined,
  }

  // Create a new URL for the page
  const url = new URL(path.startsWith('http') ? path : `https://${path}`)

  // Get the URL of the favicon, default to favicon.ico
  const imageUrl = await scrapeLink(url).catch(() => new URL('favicon.ico', url.origin))

  // Fetch the image, or use a fallback if it fails
  const image: Sharp = await fetchImage(imageUrl).then(image => {
    if (size && !Number.isNaN(parseInt(size))) {
      return image.resize(parseInt(size), undefined, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
    }
    return image
  }).catch(() => fallback(url.host, size))

  res.type('image/webp')
  return image.webp().toBuffer().catch(() => fallback(url.host, size).webp().toBuffer())
}

export default getFavicon
