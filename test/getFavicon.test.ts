import { Response } from 'light-my-request'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import createApp from '../src/server'
import testURLs from './urls.json'

const app = createApp()

// Fetch from the API
const mockFetch = (url: string): Promise<Response> => app.inject({ method: 'GET', url })

// Fetch an array of URLs
const fetchURLs = (urls: string[], size: number | undefined = undefined) => Promise.all(urls.map(url =>
  mockFetch(`/${encodeURIComponent(url)}${size ? `/${size}` : ''}`)
))

describe('getFavicon', async () => {
  // Successful favicons
  await fetchURLs(testURLs.successful).then(results => results.forEach(res => it(
    `returns a successful favicon (not a fallback) for ${res.raw.req.url}`,
    () => expect(res.headers['x-fallback']).toBe(false),
  )))

  // Fallback favicons
  await fetchURLs(testURLs.fallback).then(results => results.forEach(res => it(
    `returns a fallback favicon for ${res.raw.req.url}`,
    () => expect(res.headers['x-fallback']).toBe(true),
  )))

  // Sizes
  await fetchURLs([...testURLs.successful, ...testURLs.fallback], 12).then(results => results.forEach(res => it(
    `returns a correctly sized favicon for ${res.raw.req.url}`,
    async () => {
      const metadata = await sharp(res.rawPayload).metadata()
      expect(metadata.height).toBe(12)
      expect(metadata.width).toBe(12)
    },
  )))
})
