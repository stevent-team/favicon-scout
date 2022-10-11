import { FastifyReply, FastifyRequest } from 'fastify'
import fetch from 'node-fetch'
import sharp, { Sharp } from 'sharp'
import ico from 'sharp-ico'
import { parse } from 'node-html-parser'

import fallback from './fallback'

// Try and find the link to an icon from a page's <link> tags
const getUrlFromLink = async (url: URL): Promise<URL> => {
  const res = await fetch(url.href)
  if (!res?.ok) {
    throw new Error('Cannot fetch webpage')
  }

  const page = parse(await res.text())
  const links = page.querySelectorAll('link[rel*="icon"]')
    .filter(link => link.attributes?.href && !/prefers-color-scheme: *dark/.test(link.attributes?.media))
    .sort((a, b) => parseInt(a.attributes.sizes?.split('x')?.[0]) - parseInt(b.attributes.sizes?.split('x')?.[0]))
    .map(link => new URL(link.attributes.href, new URL(res.url).origin))
  if (links.length > 0) return links.reverse()[0]

  throw new Error('No links found')
}

// Try and fetch the favicon from the url
const fetchImage = async (url: URL): Promise<Sharp> => {
  const res = await fetch(url)
  if (!res?.ok) {
    throw new Error('Cannot fetch favicon')
  }

  const buffer = await res.buffer()
  // If file extension is ico, return largest
  if (url.pathname.split('/').reverse()[0].split('.').reverse()[0] === 'ico') {
    return (ico.sharpsFromIco(buffer, undefined, true)
      .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0] as { image: Sharp }).image
  }
  return sharp(buffer)
}

const getFavicon = async (req: FastifyRequest, res: FastifyReply) => {
  const { path, size } = req.params as {
    path: string,
    size: string | undefined,
  }

  // Create a new URL for the page
  const url = new URL(path.startsWith('http') ? path : `https://${path}`)

  // Get the URL of the favicon, default to favicon.ico
  const imageUrl = await getUrlFromLink(url).catch(() => new URL('favicon.ico', url.origin))

  // Fetch the image, or use a fallback if it fails
  let image: Sharp = await fetchImage(imageUrl).catch(() => sharp(fallback(url.host)))
  res.type('image/webp')

  if (size && !Number.isNaN(parseInt(size))) {
    image = image.resize(parseInt(size), undefined, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
  }
  return image.webp().toBuffer().catch(() => sharp(fallback(url.host)).webp().toBuffer())
}

export default getFavicon
