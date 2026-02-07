import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from '../LandingPage'
import { apiClient, ApiError } from '../../services/api-client'
import type { JobCreateResponse } from '../../types/api'

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

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockedPost = vi.mocked(apiClient.post)

/** Fill in all form fields with valid data and click submit */
async function fillAndSubmitForm() {
  const user = userEvent.setup()

  await user.type(screen.getByLabelText(/website url/i), 'https://example.com')
  await user.type(screen.getByLabelText(/^city/i), 'New York')
  await user.type(screen.getByLabelText(/state\/region/i), 'NY')
  await user.type(screen.getByLabelText(/country/i), 'US')
  await user.selectOptions(screen.getByLabelText(/business type/i), 'clinic')
  await user.selectOptions(screen.getByLabelText(/intent/i), 'governance')

  const submitBtn = screen.getByRole('button', { name: /generate governance report/i })
  await user.click(submitBtn)
}

describe('Form Submission (US-1.3)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends correct POST payload to API', async () => {
    const mockResponse: JobCreateResponse = { job_id: 'abc-123', status: 'queued' }
    mockedPost.mockResolvedValueOnce(mockResponse)

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    )

    await fillAndSubmitForm()

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith('/api/report/governance', {
        website_url: 'https://example.com',
        location: {
          city: 'New York',
          region: 'NY',
          country: 'US',
        },
        business_type: 'clinic',
        intent: 'governance',
      })
    })
  })

  it('navigates to /report?job=xxx on success', async () => {
    const mockResponse: JobCreateResponse = { job_id: 'job-456', status: 'queued' }
    mockedPost.mockResolvedValueOnce(mockResponse)

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    )

    await fillAndSubmitForm()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('job=job-456'),
      )
      const navUrl = mockNavigate.mock.calls[0][0] as string
      expect(navUrl).toContain('url=https')
      expect(navUrl).toContain('location=')
      expect(navUrl).toContain('business_type=clinic')
      expect(navUrl).toContain('intent=governance')
    })
  })

  it('displays error message on 4xx/5xx API error', async () => {
    mockedPost.mockRejectedValueOnce(new ApiError(422, 'Invalid website URL'))

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    )

    await fillAndSubmitForm()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/invalid website url/i)).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('displays network error with retry button', async () => {
    mockedPost.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    )

    await fillAndSubmitForm()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(screen.getByText(/network error/i)).toBeInTheDocument()

    const retryBtn = screen.getByRole('button', { name: /retry/i })
    expect(retryBtn).toBeInTheDocument()

    // Click retry — simulate success this time
    const mockResponse: JobCreateResponse = { job_id: 'retry-789', status: 'queued' }
    mockedPost.mockResolvedValueOnce(mockResponse)

    const user = userEvent.setup()
    await user.click(retryBtn)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('job=retry-789'),
      )
    })
  })
})
