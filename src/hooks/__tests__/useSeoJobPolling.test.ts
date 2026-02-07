import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useSeoJobPolling } from '../useSeoJobPolling'
import { apiClient } from '../../services/api-client'
import type { JobStatusResponse } from '../../types/api'
import goldenSeoReport from '../../mocks/golden/seo-report.json'
import type { SEOReport } from '../../types/api'

vi.mock('../../services/api-client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    getBaseUrl: vi.fn(() => 'http://localhost:8000'),
  },
}))

const mockedGet = vi.mocked(apiClient.get)

const processingResponse: JobStatusResponse = {
  job_id: 'seo-job-1',
  status: 'processing',
  progress: 0.45,
  current_step: 'analyze_competitors',
  steps_completed: [
    'url_normalize',
    'fetch_homepage',
    'parse_sitemap',
    'sample_pages',
    'run_detectors',
    'run_psi',
    'build_issues',
    'generate_checklist',
    'build_report',
  ],
  error: null,
  governance_report: null,
  seo_report: null,
}

const completeResponse: JobStatusResponse = {
  job_id: 'seo-job-1',
  status: 'complete',
  progress: 1.0,
  current_step: null,
  steps_completed: [
    'url_normalize',
    'fetch_homepage',
    'parse_sitemap',
    'sample_pages',
    'run_detectors',
    'run_psi',
    'build_issues',
    'generate_checklist',
    'build_report',
    'analyze_competitors',
    'gap_analysis',
    'generate_plan',
  ],
  error: null,
  governance_report: null,
  seo_report: goldenSeoReport as unknown as SEOReport,
}

const failedResponse: JobStatusResponse = {
  job_id: 'seo-job-1',
  status: 'failed',
  progress: 0.72,
  current_step: 'analyze_competitors',
  steps_completed: ['url_normalize', 'fetch_homepage'],
  error: 'SEO pipeline timed out after 120 seconds',
  governance_report: null,
  seo_report: null,
}

describe('useSeoJobPolling (US-8.4)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not poll when jobId is null', async () => {
    renderHook(() => useSeoJobPolling(null))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000)
    })

    expect(mockedGet).not.toHaveBeenCalled()
  })

  it('starts polling when jobId is provided', async () => {
    mockedGet.mockResolvedValue(processingResponse)

    const { result } = renderHook(() => useSeoJobPolling('seo-job-1'))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    expect(mockedGet).toHaveBeenCalledWith('/api/report/status/seo-job-1')
    expect(result.current.status).toBe('processing')
    expect(result.current.progress).toBe(0.45)
    expect(result.current.currentStep).toBe('analyze_competitors')
  })

  it('returns seoReport when job completes', async () => {
    mockedGet
      .mockResolvedValueOnce(processingResponse)
      .mockResolvedValueOnce(completeResponse)

    const { result } = renderHook(() => useSeoJobPolling('seo-job-1'))

    // First poll
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    expect(result.current.seoReport).toBeNull()

    // Second poll — complete
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500)
    })

    await waitFor(() => {
      expect(result.current.status).toBe('complete')
    })
    expect(result.current.seoReport).not.toBeNull()
    expect(result.current.error).toBeNull()
  })

  it('stops polling after completion', async () => {
    mockedGet.mockResolvedValue(completeResponse)

    renderHook(() => useSeoJobPolling('seo-job-1'))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    const callCount = mockedGet.mock.calls.length

    // Advance well beyond polling interval
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000)
    })

    // No additional calls after completion
    expect(mockedGet.mock.calls.length).toBe(callCount)
  })

  it('sets error on failed job and stops polling', async () => {
    mockedGet.mockResolvedValue(failedResponse)

    const { result } = renderHook(() => useSeoJobPolling('seo-job-1'))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    await waitFor(() => {
      expect(result.current.error).toBe('SEO pipeline timed out after 120 seconds')
    })
    expect(result.current.seoReport).toBeNull()

    const callCount = mockedGet.mock.calls.length

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000)
    })

    expect(mockedGet.mock.calls.length).toBe(callCount)
  })

  it('sets error on network failure and stops polling', async () => {
    mockedGet.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useSeoJobPolling('seo-job-1'))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Network error')
    })

    const callCount = mockedGet.mock.calls.length

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000)
    })

    expect(mockedGet.mock.calls.length).toBe(callCount)
  })

  it('retry restarts polling', async () => {
    mockedGet.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useSeoJobPolling('seo-job-1'))

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Network error')
    })

    // Now mock success and retry
    mockedGet.mockResolvedValue(processingResponse)

    act(() => {
      result.current.retry()
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    await waitFor(() => {
      expect(result.current.status).toBe('processing')
    })
    expect(result.current.error).toBeNull()
  })
})
