import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ExecutiveSummary from '../ExecutiveSummary'
import type { ExecutiveSummary as ExecutiveSummaryType } from '../../../types/api'
import goldenReport from '../../../mocks/golden/governance-report.json'

const summary = goldenReport.summary as ExecutiveSummaryType

describe('ExecutiveSummary (US-5.2)', () => {
  it('renders at least 3 positive findings', () => {
    render(<ExecutiveSummary summary={summary} />)

    const workingSection = screen.getByTestId('whats-working')
    const items = within(workingSection).getAllByRole('listitem')
    expect(items.length).toBeGreaterThanOrEqual(3)

    // Verify actual content from golden fixture
    expect(within(workingSection).getByText('SSL/HTTPS enabled')).toBeInTheDocument()
    expect(within(workingSection).getByText('Mobile viewport configured')).toBeInTheDocument()
    expect(within(workingSection).getByText('Google Analytics active')).toBeInTheDocument()
  })

  it('renders 3-5 risk items', () => {
    render(<ExecutiveSummary summary={summary} />)

    const attentionSection = screen.getByTestId('needs-attention')
    const items = within(attentionSection).getAllByRole('listitem')
    expect(items.length).toBeGreaterThanOrEqual(3)
    expect(items.length).toBeLessThanOrEqual(5)

    // Verify actual content from golden fixture
    expect(within(attentionSection).getByText('No sitemap found')).toBeInTheDocument()
    expect(within(attentionSection).getByText('Slow page load (mobile)')).toBeInTheDocument()
    expect(within(attentionSection).getByText('Missing alt text on images')).toBeInTheDocument()
  })

  it('shows Observed/Inferred badges', () => {
    render(<ExecutiveSummary summary={summary} />)

    // All items in golden fixture are "observed"
    const observedBadges = screen.getAllByText('Observed')
    expect(observedBadges.length).toBeGreaterThan(0)

    // Verify badge is present for each item
    observedBadges.forEach((badge) => {
      expect(badge).toBeInTheDocument()
    })
  })

  it('shows Observed/Inferred badges for inferred items', () => {
    const summaryWithInferred: ExecutiveSummaryType = {
      whats_working: [
        {
          title: 'Test inferred item',
          description: 'Description',
          detected_as: 'inferred',
          confidence: 'medium',
        },
        ...summary.whats_working.slice(0, 2),
      ],
      needs_attention: summary.needs_attention,
    }

    render(<ExecutiveSummary summary={summaryWithInferred} />)

    expect(screen.getByText('Inferred')).toBeInTheDocument()
  })

  it('shows confidence chips (High/Medium/Low)', () => {
    render(<ExecutiveSummary summary={summary} />)

    // Golden fixture has high and medium confidence items
    const highChips = screen.getAllByText('High')
    expect(highChips.length).toBeGreaterThan(0)

    const mediumChips = screen.getAllByText('Medium')
    expect(mediumChips.length).toBeGreaterThan(0)
  })

  it('shows confidence chips for all levels', () => {
    const summaryWithAllLevels: ExecutiveSummaryType = {
      whats_working: [
        { title: 'High item', description: 'Desc', detected_as: 'observed', confidence: 'high' },
        { title: 'Medium item', description: 'Desc', detected_as: 'observed', confidence: 'medium' },
        { title: 'Low item', description: 'Desc', detected_as: 'inferred', confidence: 'low' },
      ],
      needs_attention: [],
    }

    render(<ExecutiveSummary summary={summaryWithAllLevels} />)

    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('displays descriptions for each item', () => {
    render(<ExecutiveSummary summary={summary} />)

    expect(
      screen.getByText('Site serves all pages over HTTPS with a valid certificate.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('We could not find a sitemap.xml at standard locations.'),
    ).toBeInTheDocument()
  })
})
