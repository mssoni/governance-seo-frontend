import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGovernanceSubmit } from '../useGovernanceSubmit'
import { apiClient } from '../../services/api-client'
import type { GovernanceReportRequest } from '../../types/api'

vi.mock('../../services/api-client', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    getBaseUrl: vi.fn(() => 'http://localhost:8000'),
  },
  ApiError: class ApiError extends Error {
    status: number
    body: string
    constructor(status: number, body: string) {
      super(`API Error ${status}: ${body}`)
      this.name = 'ApiError'
      this.status = status
      this.body = body
    }
  },
}))

const mockedPost = vi.mocked(apiClient.post)

const samplePayload: GovernanceReportRequest = {
  website_url: 'https://example.com',
  location: { city: 'Miami', region: 'FL', country: 'US' },
  business_type: 'dental',
  intent: 'both',
}

describe('useGovernanceSubmit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns initial idle state', () => {
    const { result } = renderHook(() => useGovernanceSubmit())
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('calls apiClient.post on submit and returns job_id', async () => {
    mockedPost.mockResolvedValueOnce({ job_id: 'job-123' })
    const { result } = renderHook(() => useGovernanceSubmit())

    let jobId: string | null = null
    await act(async () => {
      jobId = await result.current.submit(samplePayload)
    })

    expect(mockedPost).toHaveBeenCalledWith('/api/report/governance', samplePayload)
    expect(jobId).toBe('job-123')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets error on API failure', async () => {
    const { ApiError } = await import('../../services/api-client')
    mockedPost.mockRejectedValueOnce(new ApiError(500, 'Server Error'))
    const { result } = renderHook(() => useGovernanceSubmit())

    let jobId: string | null = null
    await act(async () => {
      jobId = await result.current.submit(samplePayload)
    })

    expect(jobId).toBeNull()
    expect(result.current.error).toEqual({
      message: 'Server Error',
      isNetworkError: false,
    })
  })

  it('sets network error for non-API errors', async () => {
    mockedPost.mockRejectedValueOnce(new Error('fetch failed'))
    const { result } = renderHook(() => useGovernanceSubmit())

    await act(async () => {
      await result.current.submit(samplePayload)
    })

    expect(result.current.error).toEqual({
      message: 'Network error. Please check your connection and try again.',
      isNetworkError: true,
    })
  })

  it('retry re-submits last payload', async () => {
    mockedPost
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ job_id: 'job-456' })

    const { result } = renderHook(() => useGovernanceSubmit())

    await act(async () => {
      await result.current.submit(samplePayload)
    })

    expect(result.current.error).not.toBeNull()

    let jobId: string | null = null
    await act(async () => {
      jobId = await result.current.retry()
    })

    expect(jobId).toBe('job-456')
    expect(result.current.error).toBeNull()
  })
})
