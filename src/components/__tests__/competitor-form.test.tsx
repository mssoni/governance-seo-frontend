import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import CompetitorForm from '../CompetitorForm'
import type { SEOReportRequest } from '../../types/api'

const defaultProps = {
  websiteUrl: 'https://example.com',
  location: { city: 'New York', region: 'NY', country: 'US' },
  businessType: 'clinic' as const,
  intent: 'seo' as const,
  onSubmit: vi.fn(async () => {}),
  isLoading: false,
}

function renderForm(overrides: Partial<typeof defaultProps> = {}) {
  const props = { ...defaultProps, onSubmit: vi.fn(defaultProps.onSubmit), ...overrides }
  return {
    ...render(<CompetitorForm {...props} />),
    onSubmit: props.onSubmit,
  }
}

describe('CompetitorForm (US-6.2)', () => {
  it('renders 3 competitor URL fields', () => {
    renderForm()

    expect(screen.getByLabelText(/competitor 1 url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/competitor 2 url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/competitor 3 url/i)).toBeInTheDocument()
  })

  it('validates URLs and shows error for invalid URLs', async () => {
    renderForm()
    const user = userEvent.setup()

    const comp1 = screen.getByLabelText(/competitor 1 url/i)
    await user.type(comp1, 'not-a-url')
    await user.tab()

    expect(await screen.findByText(/please enter a valid url/i)).toBeInTheDocument()
  })

  it('requires at least 2 competitors — submit disabled with fewer than 2 valid URLs', async () => {
    renderForm()
    const user = userEvent.setup()

    const submitBtn = screen.getByRole('button', { name: /generate local competitive seo report/i })
    // Initially disabled — no competitors entered
    expect(submitBtn).toBeDisabled()

    // Enter only 1 valid competitor
    const comp1 = screen.getByLabelText(/competitor 1 url/i)
    await user.type(comp1, 'https://competitor-a.com')
    await user.tab()

    // Still disabled — need at least 2
    expect(submitBtn).toBeDisabled()

    // Enter 2nd valid competitor
    const comp2 = screen.getByLabelText(/competitor 2 url/i)
    await user.type(comp2, 'https://competitor-b.com')
    await user.tab()

    // Now enabled
    expect(submitBtn).toBeEnabled()
  })

  it('submits correct payload to API with 2 competitors', async () => {
    const { onSubmit } = renderForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/competitor 1 url/i), 'https://competitor-a.com')
    await user.type(screen.getByLabelText(/competitor 2 url/i), 'https://competitor-b.com')
    await user.tab()

    const submitBtn = screen.getByRole('button', { name: /generate local competitive seo report/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        website_url: 'https://example.com',
        location: { city: 'New York', region: 'NY', country: 'US' },
        business_type: 'clinic',
        intent: 'seo',
        competitors: ['https://competitor-a.com', 'https://competitor-b.com'],
      } satisfies SEOReportRequest)
    })
  })

  it('submits correct payload with 3 competitors', async () => {
    const { onSubmit } = renderForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/competitor 1 url/i), 'https://competitor-a.com')
    await user.type(screen.getByLabelText(/competitor 2 url/i), 'https://competitor-b.com')
    await user.type(screen.getByLabelText(/competitor 3 url/i), 'https://competitor-c.com')
    await user.tab()

    const submitBtn = screen.getByRole('button', { name: /generate local competitive seo report/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        website_url: 'https://example.com',
        location: { city: 'New York', region: 'NY', country: 'US' },
        business_type: 'clinic',
        intent: 'seo',
        competitors: ['https://competitor-a.com', 'https://competitor-b.com', 'https://competitor-c.com'],
      } satisfies SEOReportRequest)
    })
  })

  it('shows loading state during submission', () => {
    renderForm({ isLoading: true })

    const submitBtn = screen.getByRole('button', { name: /generating|loading/i })
    expect(submitBtn).toBeDisabled()
  })

  it('includes governance_job_id in payload when prop is provided (CHG-013)', async () => {
    const onSubmit = vi.fn(async () => {})
    render(
      <CompetitorForm
        {...defaultProps}
        onSubmit={onSubmit}
        governanceJobId="gov-job-abc123"
      />,
    )
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/competitor 1 url/i), 'https://competitor-a.com')
    await user.type(screen.getByLabelText(/competitor 2 url/i), 'https://competitor-b.com')
    await user.tab()

    const submitBtn = screen.getByRole('button', { name: /generate local competitive seo report/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          governance_job_id: 'gov-job-abc123',
          competitors: ['https://competitor-a.com', 'https://competitor-b.com'],
        }),
      )
    })
  })

  it('omits governance_job_id from payload when prop is not provided (CHG-013)', async () => {
    const { onSubmit } = renderForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/competitor 1 url/i), 'https://competitor-a.com')
    await user.type(screen.getByLabelText(/competitor 2 url/i), 'https://competitor-b.com')
    await user.tab()

    const submitBtn = screen.getByRole('button', { name: /generate local competitive seo report/i })
    await user.click(submitBtn)

    await waitFor(() => {
      const call = onSubmit.mock.calls[0][0]
      expect(call.governance_job_id).toBeUndefined()
    })
  })

  it('shows error state with retry capability', async () => {
    const { rerender } = render(
      <CompetitorForm
        {...defaultProps}
        error="Something went wrong"
      />,
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()

    // Error clears when re-rendered without error
    rerender(
      <CompetitorForm
        {...defaultProps}
        error={undefined}
      />,
    )

    expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
  })
})
