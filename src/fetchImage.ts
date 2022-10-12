import fetch from 'node-fetch'
import sharp, { Sharp } from 'sharp'
import ico from 'sharp-ico'

// Try and fetch the favicon from the url
const fetchImage = async (url: URL): Promise<Sharp> => {
  // Set up 5 second timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  //@ts-ignore signal types invalid
  const res = await fetch(url, { signal: controller.signal })
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
