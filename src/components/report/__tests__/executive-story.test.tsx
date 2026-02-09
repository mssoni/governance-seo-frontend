import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ExecutiveStory from '../ExecutiveStory'
import type { SummaryItem } from '../../../types/api'
import goldenReport from '../../../mocks/golden/governance-report.json'

const narrative = goldenReport.summary.executive_narrative
const whatsWorking = goldenReport.summary.whats_working as SummaryItem[]
const needsAttention = goldenReport.summary.needs_attention as SummaryItem[]

describe('ExecutiveStory (CHG-005 + CHG-020)', () => {
  it('renders the executive narrative text', () => {
    render(
      <ExecutiveStory
        narrative={narrative}
        whatsWorking={whatsWorking}
        needsAttention={needsAttention}
      />,
    )

    expect(screen.getByText(/growing your online presence and building credibility/)).toBeInTheDocument()
    expect(
      screen.getByText(/common and fixable/),
    ).toBeInTheDocument()
  })

  // CHG-020: Bulleted list tests (replace pill tests)

  it('renders whats_working as list items, not pills', () => {
    render(
      <ExecutiveStory
        narrative={narrative}
        whatsWorking={whatsWorking}
        needsAttention={needsAttention}
      />,
    )

    // Titles should be present as bold text in list items
    expect(screen.getByText('SSL/HTTPS enabled')).toBeInTheDocument()
    expect(screen.getByText('Mobile viewport configured')).toBeInTheDocument()
    expect(screen.getByText('Google Analytics active')).toBeInTheDocument()

    // Should be rendered as <li> elements, not pills
    const listItems = screen.getByText('SSL/HTTPS enabled').closest('li')
    expect(listItems).toBeTruthy()
  })

  it('renders needs_attention as list items, not pills', () => {
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

    // Should be rendered as <li> elements
    const listItem = screen.getByText('No sitemap found').closest('li')
    expect(listItem).toBeTruthy()
  })

  it('renders description text for whats_working items', () => {
    render(
      <ExecutiveStory
        narrative={narrative}
        whatsWorking={whatsWorking}
        needsAttention={needsAttention}
      />,
    )

    // Descriptions from golden fixture should be visible
    expect(screen.getByText(/Site serves all pages over HTTPS/)).toBeInTheDocument()
  })

  it('renders description text for needs_attention items', () => {
    render(
      <ExecutiveStory
        narrative={narrative}
        whatsWorking={whatsWorking}
        needsAttention={needsAttention}
      />,
    )

    expect(screen.getByText(/could not find a sitemap/i)).toBeInTheDocument()
  })

  it('renders titles in bold', () => {
    render(
      <ExecutiveStory
        narrative={narrative}
        whatsWorking={whatsWorking}
        needsAttention={needsAttention}
      />,
    )

    const titleEl = screen.getByText('SSL/HTTPS enabled')
    expect(titleEl.tagName).toBe('SPAN')
    expect(titleEl.className).toContain('font-semibold')
  })

  it('does not render pill elements (no rounded-full)', () => {
    const { container } = render(
      <ExecutiveStory
        narrative={narrative}
        whatsWorking={whatsWorking}
        needsAttention={needsAttention}
      />,
    )

    // No rounded-full pill elements should exist
    const pills = container.querySelectorAll('.rounded-full')
    expect(pills.length).toBe(0)
  })

  it('does not show technical badges (DetectedAs, Confidence)', () => {
    render(
      <ExecutiveStory
        narrative={narrative}
        whatsWorking={whatsWorking}
        needsAttention={needsAttention}
      />,
    )

    expect(screen.queryByText('Observed')).not.toBeInTheDocument()
    expect(screen.queryByText('Inferred')).not.toBeInTheDocument()
    expect(screen.queryByText(/^High$/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Medium$/)).not.toBeInTheDocument()
    expect(screen.queryByText(/^Low$/)).not.toBeInTheDocument()
  })
})
