import { Response } from 'light-my-request'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import createApp from '../src/server'

const app = createApp()

// Fetch from the API
const mockFetch = (url: string): Promise<Response> => app.inject({ method: 'GET', url })

// Fetch an array of URLs
const fetchArray = (urls: string[], size: number | undefined = undefined) => Promise.all(urls.map(url =>
  mockFetch(`/${encodeURIComponent(url)}${size ? `/${size}` : ''}`)
))

describe('getFavicon', async () => {
  const has_favicon = [
    'google.com',
    'discord.com',
    'facebook.com',
    'github.com',
    'stevent.club',
    'npmjs.com',
    'mail.google.com',
    'youtube.com',
    'twitter.com',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://twitter.com/BenKoder/status/1525838706229518338?s=20&t=ArjAe6jsK9uv769_C3JiHQ',
    'outlook.com',
    'https://medium.com',
    'netflix.com',
    'disneyplus.com',
    'ewanb.me',
    'esbuild.github.io',
    'notion.so',
    'www.atlassian.com',
    'web.dev',
    'caniuse.com',
    'w3.org',
    'developer.mozilla.org',
    'twitch.tv',
    'stackoverflow.com',
    'amazon.com',
    'lucide.dev',
    'djsabrinatheteenagedj.com',
  ]
  const missing_favicon = [
    'example.com',
    'https://example.net/test',
    'fake',
    'https://formidable.com/open-source/urql/docs/graphcache/',
    'https://clubs.msa.monash.edu/joinnow/clubs-and-societies/',
  ]

  // Successful favicons
  await fetchArray(has_favicon).then(results => results.forEach(res => it(
    `returns a successful favicon (not a fallback) for ${res.raw.req.url}`,
    () => expect(res.headers['x-fallback']).toBe('false'),
  )))

  // Fallback favicons
  await fetchArray(missing_favicon).then(results => results.forEach(res => it(
    `returns a successful favicon (not a fallback) for ${res.raw.req.url}`,
    () => expect(res.headers['x-fallback']).toBe('true'),
  )))

  // Sizes
  await fetchArray([...has_favicon, ...missing_favicon], 12).then(results => results.forEach(res => it(
    `returns a correctly sized favicon for ${res.raw.req.url}`,
    async () => {
      const metadata = await sharp(res.rawPayload).metadata()
      expect(metadata.height).toBe(12)
      expect(metadata.width).toBe(12)
    },
  )))
})
