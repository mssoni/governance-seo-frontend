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

    // "Search Visibility" has 1 issue (sitemap-missing)
    expect(screen.getByText('1 finding')).toBeInTheDocument()

    // "User Experience" has 2 issues (slow-lcp-mobile + missing-alt-text)
    expect(screen.getByText('2 findings')).toBeInTheDocument()
  })

  it('shows "Looking good" for categories with no issues', () => {
    render(<BusinessImpactCategories issues={issues} />)

    // "Trust & Credibility" and "Operational Risk" have no issues in golden fixture
    const lookingGoodElements = screen.getAllByText('Looking good')
    expect(lookingGoodElements.length).toBe(2)
  })

  it('shows severity indicator for categories with issues', () => {
    render(<BusinessImpactCategories issues={issues} />)

    // "Search Visibility" has a high severity issue → "Needs attention"
    // "User Experience" has high + medium → "Needs attention"
    const needsAttention = screen.getAllByText('Needs attention')
    expect(needsAttention.length).toBeGreaterThanOrEqual(2)
  })

  it('displays issue count badge', () => {
    render(<BusinessImpactCategories issues={issues} />)

    // Categories with no issues should not show count
    // Categories with issues show "N finding(s)"
    expect(screen.getByText('1 finding')).toBeInTheDocument()
    expect(screen.getByText('2 findings')).toBeInTheDocument()
  })
})
