import { describe, expect, it } from 'vitest'
import createApp from '../src/server'

const app = createApp()

describe('baseUrl', async () => {
  const res = await app.inject({ method: 'GET', url: '/' })
  const json = await res.json()

  it('returns the name', () => expect(json).toHaveProperty('name'))
  it('returns the version', () => expect(json).toHaveProperty('version'))
})
