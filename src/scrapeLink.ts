import { parse } from 'node-html-parser'
import fetch from 'node-fetch'

// Try and find the link to an icon from a page's <link> tags
const scrapeLink = async (url: URL): Promise<URL> => {
  // Set up 5 second timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  //@ts-ignore signal types invalid
  const res = await fetch(url.href, { signal: controller.signal })
  if (!res?.ok) throw new Error('Cannot fetch webpage')
  clearTimeout(timeoutId)

  const page = parse(await res.text())
  const links = page.querySelectorAll('link[rel*="icon"]')
    .filter(link => link.attributes?.href && !/prefers-color-scheme: *dark/.test(link.attributes?.media))
    .sort((a, b) => parseInt(a.attributes.sizes?.split('x')?.[0]) - parseInt(b.attributes.sizes?.split('x')?.[0]))
    .map(link => new URL(link.attributes.href, new URL(res.url).origin))
  if (links.length > 0) return links.reverse()[0]

  throw new Error('No links found')
}

export default scrapeLink
