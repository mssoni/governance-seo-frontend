import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ReportPage from '../ReportPage'
import { apiClient } from '../../services/api-client'
import type { JobStatusResponse, GovernanceReport } from '../../types/api'
import goldenReport from '../../mocks/golden/governance-report.json'

// Mock the api-client module
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

const mockedGet = vi.mocked(apiClient.get)

function renderReportPage(jobId = 'test-123') {
  return render(
    <MemoryRouter initialEntries={[`/report?job=${jobId}`]}>
      <Routes>
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

const processingResponse: JobStatusResponse = {
  job_id: 'test-123',
  status: 'processing',
  progress: 0.30,
  current_step: 'parse_sitemap',
  steps_completed: ['url_normalize', 'fetch_homepage'],
  error: null,
  governance_report: null,
  seo_report: null,
}

const completeResponse: JobStatusResponse = {
  job_id: 'test-123',
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
  ],
  error: null,
  governance_report: goldenReport as GovernanceReport,
  seo_report: null,
}

const failedResponse: JobStatusResponse = {
  job_id: 'test-123',
  status: 'failed',
  progress: 0.45,
  current_step: 'run_detectors',
  steps_completed: ['url_normalize', 'fetch_homepage', 'parse_sitemap', 'sample_pages'],
  error: 'Detector engine timed out after 30 seconds',
  governance_report: null,
  seo_report: null,
}

describe('ReportPage (US-5.1)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows progress bar while polling', async () => {
    mockedGet.mockResolvedValue(processingResponse)

    renderReportPage()

    // First poll fires on mount
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText(/30%/)).toBeInTheDocument()
  })

  it('displays step labels as they complete', async () => {
    mockedGet.mockResolvedValue(processingResponse)

    renderReportPage()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    // Completed steps should show with checkmarks
    expect(screen.getByText(/url_normalize/i)).toBeInTheDocument()
    expect(screen.getByText(/fetch_homepage/i)).toBeInTheDocument()

    // Current step should be displayed
    expect(screen.getByText(/parse_sitemap/i)).toBeInTheDocument()
  })

  it('renders report content on completion', async () => {
    // First poll: processing, second poll: complete
    mockedGet
      .mockResolvedValueOnce(processingResponse)
      .mockResolvedValueOnce(completeResponse)

    renderReportPage()

    // First poll
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    // Advance to second poll
    await act(async () => {
      await vi.advanceTimersByTimeAsync(2500)
    })

    // After completion, the report header should be visible
    await waitFor(() => {
      expect(screen.getByText(/executive summary/i)).toBeInTheDocument()
    })
  })

  it('shows error state with retry button', async () => {
    mockedGet.mockResolvedValue(failedResponse)

    renderReportPage()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    await waitFor(() => {
      expect(screen.getByText(/timed out/i)).toBeInTheDocument()
    })

    const retryButton = screen.getByRole('button', { name: /try again/i })
    expect(retryButton).toBeInTheDocument()

    // Click retry — should restart polling
    mockedGet.mockResolvedValue(processingResponse)
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    await user.click(retryButton)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('displays correct header info when report is complete', async () => {
    mockedGet.mockResolvedValue(completeResponse)

    render(
      <MemoryRouter
        initialEntries={['/report?job=test-123&url=https://example.com&location=New+York,+NY,+US&intent=governance']}
      >
        <Routes>
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    await waitFor(() => {
      expect(screen.getByText(/example\.com/)).toBeInTheDocument()
    })
    expect(screen.getByText(/New York/)).toBeInTheDocument()
    // Intent badge (exact lowercase text, not the heading)
    expect(screen.getByText('governance')).toBeInTheDocument()
  })

  it('stops polling when status is complete', async () => {
    mockedGet.mockResolvedValue(completeResponse)

    renderReportPage()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    // Should have called once on mount
    const callCount = mockedGet.mock.calls.length

    // Advance timer well beyond polling interval
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000)
    })

    // Should NOT have made additional calls
    expect(mockedGet.mock.calls.length).toBe(callCount)
  })

  it('shows pages analyzed text in the report header area', async () => {
    mockedGet.mockResolvedValue(completeResponse)

    renderReportPage()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    await waitFor(() => {
      // goldenReport has pages_analyzed: 8
      expect(screen.getByText(/based on analysis of 8 most important pages/i)).toBeInTheDocument()
    })
  })

  it('shows CTA banner for full-site audit', async () => {
    mockedGet.mockResolvedValue(completeResponse)

    renderReportPage()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })

    await waitFor(() => {
      const ctaBanner = screen.getByTestId('full-report-cta')
      expect(ctaBanner).toBeInTheDocument()
      // goldenReport has pages_analyzed: 8
      expect(ctaBanner).toHaveTextContent(/8 most important pages/i)
      expect(ctaBanner).toHaveTextContent(/comprehensive full-site audit/i)
      expect(ctaBanner).toHaveTextContent(/reach out to us/i)
    })
  })
})
