import { createWriteStream, WriteStream } from 'fs'
import { resolve } from 'path'

import getFavicon from '../getFavicon'
import fallback from '../fallback'

const getFaviconCommand = async (host: string, { size, out, type }) => {
  // Get image
  const url = new URL(host.startsWith('http') ? host : `https://${host}`)
  const { image } = await getFavicon(url, { size })

  // Resolve out and determine path if not specified
  const outPath = resolve(out ?? `./favicon.${type}`)

  // Get write stream
  const isTTY = process.stdout.isTTY
  const outStream = (!isTTY ? process.stdout : createWriteStream(outPath)) as WriteStream

  // Convert image to buffer
  const imageBuffer = await image
    .toFormat(type)
    .toBuffer()
    .catch(() => fallback(url.host, size)
      .toFormat(type)
      .toBuffer())

  // Write buffer to stream
  outStream.write(imageBuffer)
  if (isTTY) outStream.end()
}

export default getFaviconCommand
