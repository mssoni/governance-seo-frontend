import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import SEOActionPlan from '../SEOActionPlan'
import type { WeekPlan } from '../../../types/api'

const mockPlan: WeekPlan[] = [
  {
    week: 1,
    theme: 'Technical Foundations & NAP Consistency',
    actions: [
      {
        action: 'Fix mobile performance issues',
        why: 'Your mobile PSI score is below competitor average',
        signal_strengthened: 'Core Web Vitals',
        estimated_impact: 'May improve mobile search visibility (no guarantee of ranking change)',
        verification_method: 'Re-run PSI mobile test and confirm score improvement',
      },
    ],
  },
  {
    week: 2,
    theme: 'High-Intent Service Pages',
    actions: [
      {
        action: 'Create missing service category pages',
        why: 'Competitors cover 15 categories vs your 5',
        signal_strengthened: 'Content relevance for service queries',
        estimated_impact: 'Potential to capture long-tail service searches (depends on content quality)',
        verification_method: 'Search for each service + city and check if new page appears in results',
      },
    ],
  },
  {
    week: 3,
    theme: 'Reviews & Schema',
    actions: [
      {
        action: 'Set up review request flow',
        why: 'Review gap of 75 reviews vs competitors',
        signal_strengthened: 'Google Business Profile signals',
        estimated_impact: 'May strengthen local pack visibility over 2-3 months',
        verification_method: 'Track review count weekly in Google Business Profile',
      },
    ],
  },
  {
    week: 4,
    theme: 'Measure & Adjust',
    actions: [
      {
        action: 'Audit content performance',
        why: 'Month-end review ensures resources target highest-impact areas',
        signal_strengthened: 'Overall content strategy',
        estimated_impact: 'Helps prioritize next month\'s actions based on data',
        verification_method: 'Compare search impressions and clicks vs baseline',
      },
    ],
  },
]

describe('SEOActionPlan (US-8.3)', () => {
  it('renders 4 week sections with correct themes', () => {
    render(<SEOActionPlan plan={mockPlan} />)

    for (const week of mockPlan) {
      expect(screen.getByText(`Week ${week.week}`)).toBeInTheDocument()
      expect(screen.getByText(week.theme)).toBeInTheDocument()
    }
  })

  it('Week 1 is expanded by default', () => {
    render(<SEOActionPlan plan={mockPlan} />)

    // Week 1 content should be visible
    expect(screen.getByText('Fix mobile performance issues')).toBeInTheDocument()

    // Week 2, 3, 4 content should NOT be visible (collapsed by default)
    expect(screen.queryByText('Create missing service category pages')).not.toBeInTheDocument()
    expect(screen.queryByText('Set up review request flow')).not.toBeInTheDocument()
    expect(screen.queryByText('Audit content performance')).not.toBeInTheDocument()
  })

  it('actions show all required fields (why, signal, impact, verification)', () => {
    render(<SEOActionPlan plan={mockPlan} />)

    // Week 1 is expanded, check its action fields
    const action = mockPlan[0].actions[0]
    expect(screen.getByText(action.action)).toBeInTheDocument()
    expect(screen.getByText(action.why)).toBeInTheDocument()
    expect(screen.getByText(action.signal_strengthened)).toBeInTheDocument()
    expect(screen.getByText(action.estimated_impact)).toBeInTheDocument()
    expect(screen.getByText(action.verification_method)).toBeInTheDocument()
  })

  it('disclaimer banner "We do not guarantee rankings" is visible', () => {
    render(<SEOActionPlan plan={mockPlan} />)

    const disclaimer = screen.getByText(/we do not guarantee rankings/i)
    expect(disclaimer).toBeInTheDocument()

    // Disclaimer should have appropriate role
    const banner = disclaimer.closest('[role="alert"], [role="banner"]')
    expect(banner).toBeInTheDocument()
  })

  it('clicking a week header expands/collapses it', async () => {
    render(<SEOActionPlan plan={mockPlan} />)
    const user = userEvent.setup()

    // Week 2 should be collapsed initially
    expect(screen.queryByText('Create missing service category pages')).not.toBeInTheDocument()

    // Click Week 2 header to expand
    const week2Button = screen.getByText('Week 2').closest('button')!
    await user.click(week2Button)

    // Now Week 2 content should be visible
    expect(screen.getByText('Create missing service category pages')).toBeInTheDocument()

    // Click again to collapse
    await user.click(week2Button)
    expect(screen.queryByText('Create missing service category pages')).not.toBeInTheDocument()

    // Week 1 should still be expanded (independent toggle)
    expect(screen.getByText('Fix mobile performance issues')).toBeInTheDocument()

    // Collapse Week 1
    const week1Button = screen.getByText('Week 1').closest('button')!
    await user.click(week1Button)
    expect(screen.queryByText('Fix mobile performance issues')).not.toBeInTheDocument()
  })
})
