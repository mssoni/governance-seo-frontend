import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import TopImprovements from '../TopImprovements'
import type { TopImprovement } from '../../../types/api'
import goldenReport from '../../../mocks/golden/governance-report.json'

const improvements = goldenReport.top_improvements as TopImprovement[]

describe('TopImprovements (CHG-005)', () => {
  it('renders improvement cards with titles and descriptions', () => {
    render(<TopImprovements improvements={improvements} />)

    expect(screen.getByText('Improve page loading speed')).toBeInTheDocument()
    expect(screen.getByText('Help search engines find your pages')).toBeInTheDocument()
    expect(screen.getByText('Make your site accessible to all visitors')).toBeInTheDocument()

    expect(
      screen.getByText(/Your main content takes too long to appear/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Without a sitemap, search engines may miss/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Some images lack descriptions/),
    ).toBeInTheDocument()
  })

  it('shows effort badges', () => {
    render(<TopImprovements improvements={improvements} />)

    // improvements[0] has effort "M" → "Medium"
    expect(screen.getByText('Medium')).toBeInTheDocument()
    // improvements[1] and [2] have effort "S" → "Small" (2 of them)
    const smallBadges = screen.getAllByText('Small')
    expect(smallBadges.length).toBe(2)
  })

  it('shows CTA link text', () => {
    render(<TopImprovements improvements={improvements} />)

    const ctaLinks = screen.getAllByText(/We can help with this/)
    expect(ctaLinks.length).toBe(3)
  })

  it('shows link to full checklist', () => {
    render(<TopImprovements improvements={improvements} />)

    expect(
      screen.getByText(/View full 30-day checklist in Technical Details/),
    ).toBeInTheDocument()
  })

  it('calls onSwitchToTechnical when checklist link clicked', async () => {
    const user = userEvent.setup()
    const onSwitch = vi.fn()

    render(
      <TopImprovements improvements={improvements} onSwitchToTechnical={onSwitch} />,
    )

    const link = screen.getByText(/View full 30-day checklist in Technical Details/)
    await user.click(link)

    expect(onSwitch).toHaveBeenCalledOnce()
  })
})
