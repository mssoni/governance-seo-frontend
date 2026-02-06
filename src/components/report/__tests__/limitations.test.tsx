import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LimitationsSection from '../LimitationsSection'
import type { LimitationItem } from '../../../types/api'
import goldenReport from '../../../mocks/golden/governance-report.json'

const limitations = goldenReport.limitations as LimitationItem[]

describe('LimitationsSection (US-5.6)', () => {
  it('renders all limitation items with title and description', () => {
    render(<LimitationsSection limitations={limitations} />)

    // Section heading
    expect(screen.getByText("What We Can't Control")).toBeInTheDocument()

    // All 6 limitation items from golden fixture
    expect(screen.getByText('Algorithm changes')).toBeInTheDocument()
    expect(screen.getByText('Search engine algorithms change frequently. Rankings can shift without any action on your part.')).toBeInTheDocument()

    expect(screen.getByText('Competitor actions')).toBeInTheDocument()
    expect(screen.getByText('Competitors may improve their sites at any time, affecting relative positioning.')).toBeInTheDocument()

    expect(screen.getByText('Operational capacity')).toBeInTheDocument()
    expect(screen.getByText('Seasonality')).toBeInTheDocument()
    expect(screen.getByText('Service quality')).toBeInTheDocument()
    expect(screen.getByText('Brand and word of mouth')).toBeInTheDocument()
  })

  it('is always visible (not hidden by default, no collapse toggle)', () => {
    render(<LimitationsSection limitations={limitations} />)

    // The section heading should be visible
    expect(screen.getByText("What We Can't Control")).toBeVisible()

    // Subtitle should be visible
    expect(
      screen.getByText('These factors affect outcomes but are outside the scope of this report.')
    ).toBeVisible()

    // All items should be visible (not collapsed)
    limitations.forEach((item) => {
      expect(screen.getByText(item.title)).toBeVisible()
      expect(screen.getByText(item.description)).toBeVisible()
    })

    // There should be no collapse/expand buttons for the section
    expect(screen.queryByRole('button', { name: /collapse|expand|toggle/i })).not.toBeInTheDocument()
  })

  it('renders "What we can detect quickly" sub-section', () => {
    render(<LimitationsSection limitations={limitations} />)

    expect(screen.getByText('What we can detect quickly')).toBeInTheDocument()
  })
})
