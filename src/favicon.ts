import { FastifyReply, FastifyRequest } from 'fastify'
import fetch from 'node-fetch'
import sharp, { Sharp } from 'sharp'
import ico from 'sharp-ico'
import { parse } from 'node-html-parser'

import fallback from './fallback'

// Try and find the link to an icon from a page's <link> tags
const getUrlFromLink = async (url: URL): Promise<URL | undefined> => {
  const pageRes = await fetch(url.href)
  if (!pageRes?.ok) return

  const pageXml = await pageRes.text()
  const pageRoot = parse(pageXml)
  const links = pageRoot.querySelectorAll('link[rel*="icon"]')
    .filter(link => link.attributes?.href && !/prefers-color-scheme: *dark/.test(link.attributes?.media))
    .sort((a, b) => parseInt(a.attributes.sizes?.split('x')?.[0]) - parseInt(b.attributes.sizes?.split('x')?.[0]))
    .map(link => new URL(link.attributes.href, url))
  if (links.length > 0) {
    return links.reverse()[0]
  }
}

const getFavicon = async (req: FastifyRequest, res: FastifyReply) => {
  const { path, size } = req.params as {
    path: string,
    size: string | undefined,
  }

  // Create a new URL for the page
  const url = new URL(path.startsWith('http') ? path : `https://${path}`)

  // Get the URL of the favicon
  const faviconURL = await getUrlFromLink(url) ?? new URL('favicon.ico', url.origin)

  res.type('image/webp')
  let sharpFile: Sharp | undefined

  // Get icon
  const fileRes = await fetch(faviconURL).catch(req.log.debug)
  if (fileRes?.ok) {
    try {
      const fileBuffer = await fileRes.buffer()
      if (faviconURL.pathname.split('/').reverse()[0].split('.').reverse()[0] === 'ico') {
        sharpFile = (ico.sharpsFromIco(fileBuffer, undefined, true)
          .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0] as { image: Sharp }).image
      } else {
        sharpFile = sharp(fileBuffer)
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (!sharpFile) {
    sharpFile = sharp(fallback(url.host))
  }

  if (size) {
    sharpFile = sharpFile.resize(parseInt(size), undefined, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
  }
  return sharpFile.webp().toBuffer()
}

export default getFavicon
