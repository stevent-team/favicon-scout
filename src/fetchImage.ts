import fetch from 'node-fetch'
import sharp, { Sharp } from 'sharp'
import ico from 'sharp-ico'
import { REQUEST_HEADERS } from './constants'

// Try and fetch the favicon from the url
const fetchImage = async (url: URL): Promise<Sharp> => {
  // Set up 5 second timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  const res = await fetch(url, {
    //@ts-ignore signal types invalid
    signal: controller.signal,
    headers: REQUEST_HEADERS,
  })
  if (!res?.ok) throw new Error('Cannot fetch favicon')
  clearTimeout(timeoutId)

  const buffer = await res.buffer()
  // If file extension is ico, return largest bitmap in the set
  if (url.pathname.split('/').reverse()[0].split('.').reverse()[0] === 'ico') {
    return (ico.sharpsFromIco(buffer, undefined, true)
      .sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0] as { image: Sharp }).image
  }
  return sharp(buffer)
}

export default fetchImage
