import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BusinessImpactCategories from '../BusinessImpactCategories'
import type { Issue } from '../../../types/api'
import goldenReport from '../../../mocks/golden/governance-report.json'

const issues = goldenReport.issues as Issue[]

describe('BusinessImpactCategories (CHG-005)', () => {
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
})
