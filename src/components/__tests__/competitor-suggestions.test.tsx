import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CompetitorForm from '../CompetitorForm'
import type { CompetitorSuggestion } from '../../types/api'

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

const mockUserPlace: CompetitorSuggestion = {
  name: 'SkinSure Clinic',
  address: 'Baner Road, Pune, Maharashtra 411007, India',
  rating: 4.7,
  review_count: 250,
  website_url: 'https://skinsureclinic.com/',
}

function renderForm(overrides: Record<string, unknown> = {}) {
  const props = { ...defaultProps, onSubmit: vi.fn(defaultProps.onSubmit), ...overrides }
  return render(<CompetitorForm {...props} />)
}

describe('Competitor Suggestions (CHG-008)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders suggestion cards when suggestions are provided via props', () => {
    renderForm({ suggestions: mockSuggestions, suggestionsLoading: false })

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
  })

  it('shows loading state while fetching suggestions', () => {
    renderForm({ suggestions: [], suggestionsLoading: true })

    expect(screen.getByText(/finding nearby competitors/i)).toBeInTheDocument()
  })

  it('handles empty suggestions gracefully', () => {
    renderForm({ suggestions: [], suggestionsLoading: false })

    // Should not show the suggestions section header
    expect(screen.queryByText(/nearby competitors in your area/i)).not.toBeInTheDocument()
    // Should not show any error
    expect(screen.queryByText(/no suggestions/i)).not.toBeInTheDocument()
    // Form should still work
    expect(screen.getByLabelText(/competitor 1 url/i)).toBeInTheDocument()
  })

  it('handles missing suggestions prop gracefully (defaults to empty)', () => {
    renderForm()

    // Should not show the suggestions section header (defaults to empty array)
    expect(screen.queryByText(/nearby competitors in your area/i)).not.toBeInTheDocument()
    // Form should still work
    expect(screen.getByLabelText(/competitor 1 url/i)).toBeInTheDocument()
  })
})

describe('User Review Card (CHG-011)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders user review card when userPlace is provided', () => {
    renderForm({ userPlace: mockUserPlace })

    const card = screen.getByTestId('user-review-card')
    expect(card).toBeInTheDocument()

    expect(screen.getByText('SkinSure Clinic')).toBeInTheDocument()
    expect(screen.getByText('Baner Road, Pune, Maharashtra 411007, India')).toBeInTheDocument()
    expect(screen.getByText(/4\.7/)).toBeInTheDocument()
    expect(screen.getByText(/250 reviews/)).toBeInTheDocument()
    expect(screen.getByText(/your google business profile/i)).toBeInTheDocument()
  })

  it('does not render review card when userPlace is null', () => {
    renderForm({ userPlace: null })

    expect(screen.queryByTestId('user-review-card')).not.toBeInTheDocument()
  })

  it('does not render review card when userPlace is undefined', () => {
    renderForm()

    expect(screen.queryByTestId('user-review-card')).not.toBeInTheDocument()
  })

  it('renders review card alongside competitor suggestions', () => {
    renderForm({
      userPlace: mockUserPlace,
      suggestions: mockSuggestions,
      suggestionsLoading: false,
    })

    // User review card
    expect(screen.getByTestId('user-review-card')).toBeInTheDocument()
    expect(screen.getByText('SkinSure Clinic')).toBeInTheDocument()

    // Competitor suggestions
    expect(screen.getByText('Smile Dental Clinic')).toBeInTheDocument()
    expect(screen.getByText('Bright Teeth Dentistry')).toBeInTheDocument()
  })
})
