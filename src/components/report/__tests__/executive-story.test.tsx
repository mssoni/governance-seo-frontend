import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ExecutiveStory from '../ExecutiveStory'
import type { SummaryItem } from '../../../types/api'
import goldenReport from '../../../mocks/golden/governance-report.json'

const narrative = goldenReport.summary.executive_narrative
const whatsWorking = goldenReport.summary.whats_working as SummaryItem[]
const needsAttention = goldenReport.summary.needs_attention as SummaryItem[]

describe('ExecutiveStory (CHG-005)', () => {
  it('renders the executive narrative text', () => {
    render(
      <ExecutiveStory
        narrative={narrative}
        whatsWorking={whatsWorking}
        needsAttention={needsAttention}
      />,
    )

    expect(screen.getByText(/Your website is performing well/)).toBeInTheDocument()
    expect(
      screen.getByText(/most of these improvements are straightforward/),
    ).toBeInTheDocument()
  })

  it('renders whats_working pills with titles', () => {
    render(
      <ExecutiveStory
        narrative={narrative}
        whatsWorking={whatsWorking}
        needsAttention={needsAttention}
      />,
    )

    // Should render titles as pills
    expect(screen.getByText('SSL/HTTPS enabled')).toBeInTheDocument()
    expect(screen.getByText('Mobile viewport configured')).toBeInTheDocument()
    expect(screen.getByText('Google Analytics active')).toBeInTheDocument()
  })

  it('renders needs_attention pills with titles', () => {
    render(
      <ExecutiveStory
        narrative={narrative}
        whatsWorking={whatsWorking}
        needsAttention={needsAttention}
      />,
    )

    expect(screen.getByText('No sitemap found')).toBeInTheDocument()
    expect(screen.getByText('Slow page load (mobile)')).toBeInTheDocument()
    expect(screen.getByText('Missing alt text on images')).toBeInTheDocument()
  })

  it('does not show technical badges (DetectedAs, Confidence)', () => {
    render(
      <ExecutiveStory
        narrative={narrative}
        whatsWorking={whatsWorking}
        needsAttention={needsAttention}
      />,
    )

    // Should NOT have Observed/Inferred badges or High/Medium/Low confidence chips
    expect(screen.queryByText('Observed')).not.toBeInTheDocument()
    expect(screen.queryByText('Inferred')).not.toBeInTheDocument()
    // Check that confidence chips are not rendered
    // (the words High/Medium might appear in narrative, so check for badge-like elements)
    expect(screen.queryByText(/^High$/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Medium$/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Low$/)).not.toBeInTheDocument()
  })
})
