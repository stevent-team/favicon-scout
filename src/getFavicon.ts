import { Sharp } from 'sharp'

import fallback from './fallback'
import fetchImage from './fetchImage'
import scrapeLink from './scrapeLink'

type GetFaviconOptions = {
  size?: number,
}

type GetFaviconResult = {
  image: Sharp,
  didFallback: boolean,
}

const getFavicon = async (url: URL, options: GetFaviconOptions = {}): Promise<GetFaviconResult> => {
  // Get options
  const { size } = options

  // Get the URL of the favicon, default to favicon.ico
  const imageUrl = await scrapeLink(url).catch(() => new URL('favicon.ico', url.origin))

  // Fetch the image, or use a fallback if it fails
  const imageResult: Sharp | null = await fetchImage(imageUrl)
    .then(image => size
      ? image.resize(size, undefined, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      : image
    )
    .catch(() => null)

  // Resolve fallback
  return {
    image: imageResult ?? fallback(url.host, size),
    didFallback: imageResult === null
  }
}

export default getFavicon
