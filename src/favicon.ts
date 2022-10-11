import { FastifyReply } from 'fastify'
import fetch from 'node-fetch'
import sharp, { Sharp } from 'sharp'
import ico from 'sharp-ico'
import { parse } from 'node-html-parser'

const getFavicon = async (req, res: FastifyReply) => {
  const { url, size } = req.params as { url: string, size: string | undefined }

  const pageUrl = new URL(url.startsWith('http') ? url : `https://${url}`)

  let faviconURL = new URL('favicon.ico', pageUrl.origin)

  // <link>
  const pageRes = await fetch(pageUrl.href).catch(console.debug)
  if (pageRes?.ok) {
    try {
      const pageXml = await pageRes.text()
      const pageRoot = parse(pageXml)
      const links = pageRoot.querySelectorAll('link[rel*="icon"]')
        .filter(link => link.attributes?.href && !/prefers-color-scheme: *dark/.test(link.attributes?.media))
        .sort((a, b) => parseInt(a.attributes.sizes?.split('x')?.[0]) - parseInt(b.attributes.sizes?.split('x')?.[0]))
        .map(link => new URL(link.attributes.href, pageUrl))
      if (links.length > 0) {
        faviconURL = links.reverse()[0]
      }
    } catch (e) {
      console.error(e)
    }
  }

  // favicon.ico
  const fileRes = await fetch(faviconURL).catch(console.debug)
  if (fileRes?.ok) {
    try {
      const fileBuffer = await fileRes.buffer()
      let sharpFile: Sharp
      if (faviconURL.pathname.split('/').reverse()[0].split('.').reverse()[0] === 'ico') {
        sharpFile = (ico.sharpsFromIco(fileBuffer, undefined, true)
          .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0] as { image: Sharp }).image
      } else {
        sharpFile = sharp(fileBuffer)
      }
      res.type('image/webp')
      if (size) {
        sharpFile = sharpFile.resize(parseInt(size), undefined, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
      }
      return sharpFile.webp().toBuffer()
    } catch (e) {
      console.error(e)
    }
  }

  return { url }
}

export default getFavicon
