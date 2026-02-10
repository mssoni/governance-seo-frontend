import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSeoSubmit } from '../useSeoSubmit'
import { apiClient } from '../../services/api-client'
import type { SEOReportRequest } from '../../types/api'

vi.mock('../../services/api-client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    getBaseUrl: vi.fn(() => 'http://localhost:8000'),
  },
}))

const mockedPost = vi.mocked(apiClient.post)

const samplePayload: SEOReportRequest = {
  website_url: 'https://example.com',
  location: { city: 'Miami', region: 'FL', country: 'US' },
  business_type: 'dental',
  intent: 'both',
  competitors: ['https://rival1.com', 'https://rival2.com'],
}

describe('useSeoSubmit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns initial idle state', () => {
    const { result } = renderHook(() => useSeoSubmit())
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.seoJobId).toBeNull()
  })

  it('calls apiClient.post and sets seoJobId on success', async () => {
    mockedPost.mockResolvedValueOnce({ job_id: 'seo-123' })
    const { result } = renderHook(() => useSeoSubmit())

    await act(async () => {
      await result.current.submit(samplePayload)
    })

    expect(mockedPost).toHaveBeenCalledWith('/api/report/seo', samplePayload)
    expect(result.current.seoJobId).toBe('seo-123')
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.error).toBeUndefined()
  })

  it('sets error on failure', async () => {
    mockedPost.mockRejectedValueOnce(new Error('Network down'))
    const { result } = renderHook(() => useSeoSubmit())

    await act(async () => {
      await result.current.submit(samplePayload)
    })

    expect(result.current.seoJobId).toBeNull()
    expect(result.current.error).toBe('Network down')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('sets generic error for non-Error rejections', async () => {
    mockedPost.mockRejectedValueOnce('something weird')
    const { result } = renderHook(() => useSeoSubmit())

    await act(async () => {
      await result.current.submit(samplePayload)
    })

    expect(result.current.error).toBe('Failed to start SEO analysis')
  })
})
