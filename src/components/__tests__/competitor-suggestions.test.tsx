import { render, screen, fireEvent } from '@testing-library/react'
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
    website_url: 'https://smiledental.com',
  },
  {
    name: 'Bright Teeth Dentistry',
    address: '456 Oak Ave, Miami, FL',
    rating: 4.2,
    review_count: 89,
    website_url: 'https://brightteeth.com',
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

describe('Click Suggestion to Fill URL (CHG-012)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fills the first empty competitor URL input when clicking a suggestion with website_url', () => {
    renderForm({ suggestions: mockSuggestions, suggestionsLoading: false })

    // Click on "Smile Dental Clinic" which has a website_url
    const smileCard = screen.getByText('Smile Dental Clinic').closest('[data-testid^="suggestion-card-"]')!
    fireEvent.click(smileCard)

    // First competitor field should now have the website URL
    const input1 = screen.getByLabelText(/competitor 1 url/i) as HTMLInputElement
    expect(input1.value).toBe('https://smiledental.com')
  })

  it('fills the next empty field when first is already filled', () => {
    renderForm({ suggestions: mockSuggestions, suggestionsLoading: false })

    // Click first suggestion
    const smileCard = screen.getByText('Smile Dental Clinic').closest('[data-testid^="suggestion-card-"]')!
    fireEvent.click(smileCard)

    // Click second suggestion
    const brightCard = screen.getByText('Bright Teeth Dentistry').closest('[data-testid^="suggestion-card-"]')!
    fireEvent.click(brightCard)

    // Second competitor field should now have the website URL
    const input2 = screen.getByLabelText(/competitor 2 url/i) as HTMLInputElement
    expect(input2.value).toBe('https://brightteeth.com')
  })

  it('shows "no website" message when clicking a suggestion without website_url', () => {
    renderForm({ suggestions: mockSuggestions, suggestionsLoading: false })

    // Click on "City Dental Care" which has no website_url
    const cityCard = screen.getByText('City Dental Care').closest('[data-testid^="suggestion-card-"]')!
    fireEvent.click(cityCard)

    // Should show a no-website message
    expect(screen.getByText(/has no website listed/i)).toBeInTheDocument()

    // No competitor field should be filled
    const input1 = screen.getByLabelText(/competitor 1 url/i) as HTMLInputElement
    expect(input1.value).toBe('')
  })

  it('does not fill when all 3 competitor fields are already filled', () => {
    renderForm({ suggestions: mockSuggestions, suggestionsLoading: false })

    // Fill all three fields by clicking suggestions and manually
    const smileCard = screen.getByText('Smile Dental Clinic').closest('[data-testid^="suggestion-card-"]')!
    fireEvent.click(smileCard)

    const brightCard = screen.getByText('Bright Teeth Dentistry').closest('[data-testid^="suggestion-card-"]')!
    fireEvent.click(brightCard)

    // Manually fill the third
    const input3 = screen.getByLabelText(/competitor 3 url/i) as HTMLInputElement
    fireEvent.change(input3, { target: { value: 'https://third.com' } })

    // Now all 3 are filled — create a new suggestion with a website
    // Re-click Smile — should NOT overwrite anything
    fireEvent.click(smileCard)

    // Values should remain unchanged
    const input1 = screen.getByLabelText(/competitor 1 url/i) as HTMLInputElement
    const input2 = screen.getByLabelText(/competitor 2 url/i) as HTMLInputElement
    expect(input1.value).toBe('https://smiledental.com')
    expect(input2.value).toBe('https://brightteeth.com')
    expect(input3.value).toBe('https://third.com')
  })

  it('shows visual selection indicator on clicked suggestion card', () => {
    renderForm({ suggestions: mockSuggestions, suggestionsLoading: false })

    const smileCard = screen.getByText('Smile Dental Clinic').closest('[data-testid^="suggestion-card-"]')!
    fireEvent.click(smileCard)

    // Card should have a selected visual indicator (e.g., checkmark or border)
    expect(smileCard).toHaveAttribute('data-selected', 'true')
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
