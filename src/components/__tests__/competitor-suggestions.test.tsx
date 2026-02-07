import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CompetitorForm from '../CompetitorForm'
import type { CompetitorSuggestion } from '../../types/api'

// Mock the hook module (hooks are the bridge between components and services)
vi.mock('../../hooks/useCompetitorSuggestions', () => ({
  useCompetitorSuggestions: vi.fn(),
}))

import { useCompetitorSuggestions } from '../../hooks/useCompetitorSuggestions'

const mockUseCompetitorSuggestions = vi.mocked(useCompetitorSuggestions)

const defaultProps = {
  websiteUrl: 'https://example.com',
  location: { city: 'Miami', region: 'FL', country: 'US' },
  businessType: 'dental' as const,
  intent: 'seo' as const,
  onSubmit: vi.fn(async () => {}),
  isLoading: false,
}

const mockSuggestions: CompetitorSuggestion[] = [
  {
    name: 'Smile Dental Clinic',
    address: '123 Main St, Miami, FL',
    rating: 4.5,
    review_count: 120,
    website_url: null,
  },
  {
    name: 'Bright Teeth Dentistry',
    address: '456 Oak Ave, Miami, FL',
    rating: 4.2,
    review_count: 89,
    website_url: null,
  },
  {
    name: 'City Dental Care',
    address: '789 Pine Rd, Miami, FL',
    rating: null,
    review_count: null,
    website_url: null,
  },
]

function renderForm(overrides: Partial<typeof defaultProps> = {}) {
  const props = { ...defaultProps, onSubmit: vi.fn(defaultProps.onSubmit), ...overrides }
  return render(<CompetitorForm {...props} />)
}

describe('Competitor Suggestions (CHG-008)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders suggestion cards when API returns results', () => {
    mockUseCompetitorSuggestions.mockReturnValue({
      suggestions: mockSuggestions,
      loading: false,
    })

    renderForm()

    // Verify suggestion cards
    expect(screen.getByText('Smile Dental Clinic')).toBeInTheDocument()
    expect(screen.getByText('Bright Teeth Dentistry')).toBeInTheDocument()
    expect(screen.getByText('City Dental Care')).toBeInTheDocument()

    // Check addresses
    expect(screen.getByText('123 Main St, Miami, FL')).toBeInTheDocument()
    expect(screen.getByText('456 Oak Ave, Miami, FL')).toBeInTheDocument()

    // Check rating/review display
    expect(screen.getByText(/4\.5/)).toBeInTheDocument()
    expect(screen.getByText(/120 reviews/)).toBeInTheDocument()
    expect(screen.getByText(/4\.2/)).toBeInTheDocument()
    expect(screen.getByText(/89 reviews/)).toBeInTheDocument()

    // Verify hook was called with correct params
    expect(mockUseCompetitorSuggestions).toHaveBeenCalledWith({
      businessType: 'dental',
      city: 'Miami',
      region: 'FL',
      country: 'US',
    })
  })

  it('shows loading state while fetching suggestions', () => {
    mockUseCompetitorSuggestions.mockReturnValue({
      suggestions: [],
      loading: true,
    })

    renderForm()

    expect(screen.getByText(/finding nearby competitors/i)).toBeInTheDocument()
  })

  it('handles empty suggestions gracefully', () => {
    mockUseCompetitorSuggestions.mockReturnValue({
      suggestions: [],
      loading: false,
    })

    renderForm()

    // Should not show the suggestions section header
    expect(screen.queryByText(/nearby competitors in your area/i)).not.toBeInTheDocument()
    // Should not show any error
    expect(screen.queryByText(/no suggestions/i)).not.toBeInTheDocument()
    // Form should still work
    expect(screen.getByLabelText(/competitor 1 url/i)).toBeInTheDocument()
  })

  it('handles API error gracefully', async () => {
    // When the hook catches an error, it returns empty suggestions and loading=false
    mockUseCompetitorSuggestions.mockReturnValue({
      suggestions: [],
      loading: false,
    })

    renderForm()

    await waitFor(() => {
      expect(mockUseCompetitorSuggestions).toHaveBeenCalled()
    })

    // Should not show the suggestions section header
    expect(screen.queryByText(/nearby competitors in your area/i)).not.toBeInTheDocument()
    // Should not show any error message about suggestions
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    // Form should still work
    expect(screen.getByLabelText(/competitor 1 url/i)).toBeInTheDocument()
  })
})
