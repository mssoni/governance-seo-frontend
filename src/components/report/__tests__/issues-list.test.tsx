import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import IssuesList from '../IssuesList'
import type { Issue } from '../../../types/api'
import goldenReport from '../../../mocks/golden/governance-report.json'

const issues = goldenReport.issues as Issue[]

describe('IssuesList (US-5.4)', () => {
  it('renders issues sorted by severity (high first)', () => {
    render(<IssuesList issues={issues} />)

    const issueCards = screen.getAllByTestId('issue-card')
    expect(issueCards.length).toBe(3)

    // First two should be high severity, last should be medium
    // Golden fixture: 2 high, 1 medium
    // Note: severity + confidence share labels so we use getAllByText
    expect(within(issueCards[0]).getAllByText('High').length).toBeGreaterThanOrEqual(1)
    expect(within(issueCards[1]).getAllByText('High').length).toBeGreaterThanOrEqual(1)
    expect(within(issueCards[2]).getAllByText('Medium').length).toBeGreaterThanOrEqual(1)

    // Verify issue titles appear in correct order
    expect(within(issueCards[0]).getByText('No sitemap.xml found')).toBeInTheDocument()
    expect(within(issueCards[1]).getByText('Slow Largest Contentful Paint (mobile)')).toBeInTheDocument()
    expect(within(issueCards[2]).getByText('Images missing alt text')).toBeInTheDocument()
  })

  it('expands to show full issue details', async () => {
    const user = userEvent.setup()
    render(<IssuesList issues={issues} />)

    // Details should be collapsed by default
    expect(screen.queryByText('Search engines may discover pages inconsistently without a sitemap.')).not.toBeInTheDocument()

    // Click on the first issue to expand it
    const issueCards = screen.getAllByTestId('issue-card')
    const expandButton = within(issueCards[0]).getByRole('button', { name: /expand/i })
    await user.click(expandButton)

    // Now details should be visible
    expect(screen.getByText('Search engines may discover pages inconsistently without a sitemap.')).toBeInTheDocument()
    expect(screen.getByText('New or updated pages may take longer to appear in search results.')).toBeInTheDocument()
    expect(screen.getByText('Improved page discovery speed. Most sites see indexed pages increase within 2-4 weeks.')).toBeInTheDocument()

    // what_to_do items
    expect(screen.getByText('Generate a sitemap.xml using your CMS or a tool like xml-sitemaps.com')).toBeInTheDocument()
    expect(screen.getByText('Submit the sitemap to Google Search Console')).toBeInTheDocument()

    // Evidence should be available via EvidencePanel
    expect(screen.getByText('No sitemap.xml at /sitemap.xml')).toBeInTheDocument()
  })

  it('shows correct badges (severity, confidence, detected_as)', () => {
    render(<IssuesList issues={issues} />)

    const issueCards = screen.getAllByTestId('issue-card')

    // First issue: high severity, high confidence, observed
    // Both severity and confidence are "High", so there are 2 matching elements
    const highBadges = within(issueCards[0]).getAllByText('High')
    expect(highBadges.length).toBe(2) // SeverityBadge + ConfidenceChip
    expect(within(issueCards[0]).getByText('Observed')).toBeInTheDocument()

    // Third issue: medium severity, medium confidence, observed
    const mediumBadges = within(issueCards[2]).getAllByText('Medium')
    expect(mediumBadges.length).toBe(2) // SeverityBadge + ConfidenceChip
  })

  it('filter by severity works', async () => {
    const user = userEvent.setup()
    render(<IssuesList issues={issues} />)

    // Initially all 3 issues shown
    expect(screen.getAllByTestId('issue-card').length).toBe(3)

    // Click "High" filter
    await user.click(screen.getByRole('button', { name: /^High$/i }))
    expect(screen.getAllByTestId('issue-card').length).toBe(2)

    // Click "Medium" filter
    await user.click(screen.getByRole('button', { name: /^Medium$/i }))
    expect(screen.getAllByTestId('issue-card').length).toBe(1)
    expect(screen.getByText('Images missing alt text')).toBeInTheDocument()

    // Click "All" to reset
    await user.click(screen.getByRole('button', { name: /^All$/i }))
    expect(screen.getAllByTestId('issue-card').length).toBe(3)
  })
})
