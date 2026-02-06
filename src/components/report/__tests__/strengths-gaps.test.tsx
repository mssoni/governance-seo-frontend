import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StrengthsGaps from '../StrengthsGaps'
import type { StrengthItem, GapItem } from '../../../types/api'

const competitorAdvantages: StrengthItem[] = [
  {
    title: 'More Reviews',
    description: 'Competitors average 120 reviews vs your 45',
    evidence: ['Competitor A: 150 reviews', 'Competitor B: 90 reviews'],
  },
  {
    title: 'Broader Content',
    description: 'Competitors cover more service categories',
    evidence: ['Competitor A: 15 service pages', 'Your site: 5 service pages'],
  },
  {
    title: 'Better Local Presence',
    description: 'Competitors have dedicated location pages',
    evidence: ['Competitor A: location page with map', 'Competitor B: city-specific pages'],
  },
]

const userStrengths: StrengthItem[] = [
  {
    title: 'Faster Site Speed',
    description: 'Your site loads faster than competitors',
    evidence: ['Your PSI: Fast (92)', 'Competitor avg: Average (65)'],
  },
  {
    title: 'Better Security',
    description: 'Your site has stronger security posture',
    evidence: ['HTTPS, CSP, HSTS all present', 'Competitors missing CSP headers'],
  },
]

const gaps: GapItem[] = [
  { category: 'Reviews', your_value: '45 reviews (4.5★)', competitor_value: '120 reviews avg (4.7★)', significance: 'High' },
  { category: 'Content', your_value: '5 service pages', competitor_value: '15 service pages avg', significance: 'High' },
  { category: 'Local Presence', your_value: 'No location page', competitor_value: 'Dedicated location pages', significance: 'Medium' },
  { category: 'Technical', your_value: 'Fast (92)', competitor_value: 'Average (65)', significance: 'Low (you\'re ahead)' },
  { category: 'Trust', your_value: 'No testimonials', competitor_value: 'Case studies present', significance: 'Medium' },
]

describe('StrengthsGaps (US-8.2)', () => {
  it('renders min 3 competitor advantages with title, description, evidence', () => {
    render(
      <StrengthsGaps
        competitorAdvantages={competitorAdvantages}
        userStrengths={userStrengths}
        gaps={gaps}
      />,
    )

    // Should have a "What they're doing better" section
    const competitorSection = screen.getByTestId('competitor-advantages')
    expect(competitorSection).toBeInTheDocument()

    // Check all 3 competitor advantages
    for (const adv of competitorAdvantages) {
      expect(within(competitorSection).getByText(adv.title)).toBeInTheDocument()
      expect(within(competitorSection).getByText(adv.description)).toBeInTheDocument()
      for (const ev of adv.evidence) {
        expect(within(competitorSection).getByText(ev)).toBeInTheDocument()
      }
    }
  })

  it('renders min 2 user strengths with title, description, evidence', () => {
    render(
      <StrengthsGaps
        competitorAdvantages={competitorAdvantages}
        userStrengths={userStrengths}
        gaps={gaps}
      />,
    )

    // Should have a "What you're doing better" section
    const strengthsSection = screen.getByTestId('user-strengths')
    expect(strengthsSection).toBeInTheDocument()

    // Check all 2 user strengths
    for (const str of userStrengths) {
      expect(within(strengthsSection).getByText(str.title)).toBeInTheDocument()
      expect(within(strengthsSection).getByText(str.description)).toBeInTheDocument()
      for (const ev of str.evidence) {
        expect(within(strengthsSection).getByText(ev)).toBeInTheDocument()
      }
    }
  })

  it('renders gap breakdown with all categories', () => {
    render(
      <StrengthsGaps
        competitorAdvantages={competitorAdvantages}
        userStrengths={userStrengths}
        gaps={gaps}
      />,
    )

    const gapSection = screen.getByTestId('gap-breakdown')
    expect(gapSection).toBeInTheDocument()

    // All 5 categories should be present
    for (const gap of gaps) {
      expect(within(gapSection).getByText(gap.category)).toBeInTheDocument()
    }
  })

  it('each gap shows your_value vs competitor_value', () => {
    render(
      <StrengthsGaps
        competitorAdvantages={competitorAdvantages}
        userStrengths={userStrengths}
        gaps={gaps}
      />,
    )

    const gapSection = screen.getByTestId('gap-breakdown')
    const table = within(gapSection).getByRole('table')
    const rows = within(table).getAllByRole('row')
    // 1 header row + 5 gap rows = 6
    expect(rows).toHaveLength(6)

    // Check that each gap's values are visible in the corresponding row
    for (let i = 0; i < gaps.length; i++) {
      const row = rows[i + 1] // skip header
      expect(within(row).getByText(gaps[i].your_value)).toBeInTheDocument()
      expect(within(row).getByText(gaps[i].competitor_value)).toBeInTheDocument()
      expect(within(row).getByText(gaps[i].significance)).toBeInTheDocument()
    }
  })
})
