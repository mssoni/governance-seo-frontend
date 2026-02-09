import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BusinessImpactCategories from '../BusinessImpactCategories'
import type { CategoryInsight, Issue } from '../../../types/api'
import goldenReport from '../../../mocks/golden/governance-report.json'

const issues = goldenReport.issues as Issue[]

describe('BusinessImpactCategories — Legacy path (CHG-005)', () => {
  it('renders all 4 business category cards', () => {
    render(<BusinessImpactCategories issues={issues} />)

    expect(screen.getByText('Trust & Credibility')).toBeInTheDocument()
    expect(screen.getByText('Search Visibility')).toBeInTheDocument()
    expect(screen.getByText('User Experience')).toBeInTheDocument()
    expect(screen.getByText('Operational Risk')).toBeInTheDocument()
  })

  it('groups issues into correct categories', () => {
    render(<BusinessImpactCategories issues={issues} />)

    // CHG-016: Updated count text to include "high-confidence" with "Based on" prefix
    // "Search Visibility" has 1 issue (sitemap-missing)
    expect(screen.getByText(/Based on 1 high-confidence finding/)).toBeInTheDocument()

    // "User Experience" has 2 issues (slow-lcp-mobile + missing-alt-text)
    expect(screen.getByText(/Based on 2 high-confidence findings/)).toBeInTheDocument()
  })

  it('shows business impact text for categories', () => {
    render(<BusinessImpactCategories issues={issues} />)

    // CHG-016: Categories now show business impact text, not "Looking good"
    // "Trust & Credibility" and "Operational Risk" have no issues in golden fixture
    expect(screen.getByText("Your site signals trust and security to visitors")).toBeInTheDocument()
    expect(screen.getByText("Your site's technical foundation is solid")).toBeInTheDocument()
  })

  it('shows business impact warning for categories with issues', () => {
    render(<BusinessImpactCategories issues={issues} />)

    // CHG-016: Categories with issues show business impact warnings
    // "Search Visibility" has issues → business impact warning
    expect(screen.getByText("Fewer people can find you in search results")).toBeInTheDocument()

    // "User Experience" has issues → business impact warning
    expect(screen.getByText("Some visitors may struggle or leave quickly")).toBeInTheDocument()
  })

  it('displays issue count with confidence indicator', () => {
    render(<BusinessImpactCategories issues={issues} />)

    // CHG-016: Categories with no issues should not show count
    // Categories with issues show "Based on N high-confidence finding(s)"
    expect(screen.getByText(/Based on 1 high-confidence finding/)).toBeInTheDocument()
    expect(screen.getByText(/Based on 2 high-confidence findings/)).toBeInTheDocument()
  })

  it('falls back to legacy when categoryInsights is empty', () => {
    render(<BusinessImpactCategories issues={issues} categoryInsights={[]} />)

    // Should render canonical category names (legacy path)
    expect(screen.getByText('Trust & Credibility')).toBeInTheDocument()
    expect(screen.getByText('Search Visibility')).toBeInTheDocument()
  })
})

// --- CHG-018: Personalized path tests ---

const sampleInsights: CategoryInsight[] = [
  {
    category_id: 'Trust & Credibility',
    display_name: 'Patient Trust',
    headline: 'Patients checking reviews at 9pm trust you',
    detail: 'Your copyright is current and site feels active.',
    icon: 'shield',
    status: 'good',
    issue_count: 0,
    max_severity: null,
  },
  {
    category_id: 'Search Visibility',
    display_name: 'Patient Discovery',
    headline: "You're invisible to patients searching nearby",
    detail: 'Search engines struggle with missing sitemap.',
    icon: 'search',
    status: 'at_risk',
    issue_count: 1,
    max_severity: 'high',
  },
  {
    category_id: 'User Experience',
    display_name: 'Patient Experience',
    headline: 'Your site loads in 3.8 seconds',
    detail: 'Mobile users expect under 2.5 seconds.',
    icon: 'user',
    status: 'on_track',
    issue_count: 2,
    max_severity: 'medium',
  },
  {
    category_id: 'Operational Risk',
    display_name: 'Practice Operations',
    headline: 'Technical foundation is solid',
    detail: 'No major operational risks detected.',
    icon: 'alert',
    status: 'good',
    issue_count: 0,
    max_severity: null,
  },
]

describe('BusinessImpactCategories — Personalized path (CHG-018)', () => {
  it('renders segment-specific display names when insights provided', () => {
    render(<BusinessImpactCategories issues={[]} categoryInsights={sampleInsights} />)

    expect(screen.getByText('Patient Trust')).toBeInTheDocument()
    expect(screen.getByText('Patient Discovery')).toBeInTheDocument()
    expect(screen.getByText('Patient Experience')).toBeInTheDocument()
    expect(screen.getByText('Practice Operations')).toBeInTheDocument()
  })

  it('shows LLM-generated headline and detail', () => {
    render(<BusinessImpactCategories issues={[]} categoryInsights={sampleInsights} />)

    expect(screen.getByText('Patients checking reviews at 9pm trust you')).toBeInTheDocument()
    expect(screen.getByText('Search engines struggle with missing sitemap.')).toBeInTheDocument()
  })

  it('shows issue count for categories with issues', () => {
    render(<BusinessImpactCategories issues={[]} categoryInsights={sampleInsights} />)

    expect(screen.getByText(/Based on 1 high-confidence finding/)).toBeInTheDocument()
    expect(screen.getByText(/Based on 2 high-confidence findings/)).toBeInTheDocument()
  })

  it('applies correct border color from status', () => {
    const { container } = render(
      <BusinessImpactCategories issues={[]} categoryInsights={sampleInsights} />
    )

    const cards = container.querySelectorAll('.rounded-lg')
    // at_risk (Search Visibility) should have red border
    const searchCard = Array.from(cards).find((el) =>
      el.textContent?.includes('Patient Discovery')
    )
    expect(searchCard?.className).toContain('border-l-red-400')

    // good (Patient Trust) should have green border
    const trustCard = Array.from(cards).find((el) =>
      el.textContent?.includes('Patient Trust')
    )
    expect(trustCard?.className).toContain('border-l-green-400')

    // on_track (Patient Experience) should have amber border
    const uxCard = Array.from(cards).find((el) =>
      el.textContent?.includes('Patient Experience')
    )
    expect(uxCard?.className).toContain('border-l-amber-400')
  })
})
