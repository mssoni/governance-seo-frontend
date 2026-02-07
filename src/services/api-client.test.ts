import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiClient, ApiError } from './api-client'

describe('ApiClient', () => {
  it('uses configured base URL (falls back to default http://localhost:8000)', () => {
    // VITE_API_BASE_URL is not set in test env, so it falls back
    expect(apiClient.getBaseUrl()).toBe('http://localhost:8000')
  })

  it('falls back to default base URL when env var is not set', () => {
    // Verify the default is applied (no env var in test)
    expect(apiClient.getBaseUrl()).toMatch(/^https?:\/\//)
    expect(apiClient.getBaseUrl()).toBe('http://localhost:8000')
  })

  it('sends Content-Type: application/json header on POST', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ job_id: 'test-123' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await apiClient.post('/api/report/governance', { website_url: 'https://example.com' })

    expect(mockFetch).toHaveBeenCalledOnce()
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toBe('http://localhost:8000/api/report/governance')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(options.method).toBe('POST')
    expect(options.body).toBe(JSON.stringify({ website_url: 'https://example.com' }))

    vi.unstubAllGlobals()
  })

  it('sends Content-Type: application/json header on GET', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: 'processing' }),
    })
    vi.stubGlobal('fetch', mockFetch)

    await apiClient.get('/api/report/status/abc')

    expect(mockFetch).toHaveBeenCalledOnce()
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toBe('http://localhost:8000/api/report/status/abc')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(options.method).toBe('GET')

    vi.unstubAllGlobals()
  })

  it('throws ApiError on non-ok response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      text: () => Promise.resolve('Validation failed'),
    })
    vi.stubGlobal('fetch', mockFetch)

    await expect(apiClient.post('/api/report/governance', {})).rejects.toThrow(ApiError)
    await expect(
      apiClient.post('/api/report/governance', {}),
    ).rejects.toMatchObject({
      status: 422,
      body: 'Validation failed',
    })

    vi.unstubAllGlobals()
  })

  it('constructs full URL from base URL + path', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    })
    vi.stubGlobal('fetch', mockFetch)

    await apiClient.get('/api/report/status/job-123')

    const [url] = mockFetch.mock.calls[0]
    expect(url).toBe('http://localhost:8000/api/report/status/job-123')

    vi.unstubAllGlobals()
  })
})

describe('ApiError', () => {
  let savedFetch: typeof globalThis.fetch

  beforeEach(() => {
    savedFetch = globalThis.fetch
  })

  afterEach(() => {
    globalThis.fetch = savedFetch
  })

  it('has status and body properties', () => {
    const error = new ApiError(500, 'Internal Server Error')
    expect(error.status).toBe(500)
    expect(error.body).toBe('Internal Server Error')
    expect(error.name).toBe('ApiError')
    expect(error.message).toContain('500')
  })
})
