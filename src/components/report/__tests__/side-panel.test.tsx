import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import SidePanel from '../SidePanel'
import type { Issue } from '../../../types/api'
import goldenReport from '../../../mocks/golden/governance-report.json'

const issues = goldenReport.issues as Issue[]

describe('SidePanel (US-5.7)', () => {
  it('renders top 5 actions from issues', () => {
    render(<SidePanel issues={issues} />)

    // Golden fixture has 3 issues — all should be shown as "Top Actions"
    expect(screen.getByText('Top Actions')).toBeInTheDocument()
    expect(screen.getByText('No sitemap.xml found')).toBeInTheDocument()
    expect(screen.getByText('Slow Largest Contentful Paint (mobile)')).toBeInTheDocument()
    expect(screen.getByText('Images missing alt text')).toBeInTheDocument()
  })

  it('limits to first 5 issues when more than 5 exist', () => {
    // Create 7 mock issues
    const manyIssues: Issue[] = Array.from({ length: 7 }, (_, i) => ({
      issue_id: `issue-${i}`,
      title: `Issue number ${i + 1}`,
      severity: 'high' as const,
      confidence: 'high' as const,
      detected_as: 'observed' as const,
      evidence: [],
      why_it_matters: 'Test',
      what_happens_if_ignored: 'Test',
      what_to_do: ['Test'],
      expected_impact: 'Test',
    }))

    render(<SidePanel issues={manyIssues} />)

    // Should show first 5 only
    expect(screen.getByText('Issue number 1')).toBeInTheDocument()
    expect(screen.getByText('Issue number 5')).toBeInTheDocument()
    expect(screen.queryByText('Issue number 6')).not.toBeInTheDocument()
    expect(screen.queryByText('Issue number 7')).not.toBeInTheDocument()
  })

  it('print button triggers window.print', async () => {
    const user = userEvent.setup()
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})

    render(<SidePanel issues={issues} />)

    const printButton = screen.getByRole('button', { name: /print/i })
    await user.click(printButton)

    expect(printSpy).toHaveBeenCalledOnce()
    printSpy.mockRestore()
  })

  it('renders all CTA buttons', () => {
    render(<SidePanel issues={issues} />)

    // "Need help?" CTA
    expect(screen.getByRole('button', { name: /need help/i })).toBeInTheDocument()

    // "Connect GA/GSC" disabled button
    const connectButton = screen.getByRole('button', { name: /connect ga\/gsc/i })
    expect(connectButton).toBeInTheDocument()
    expect(connectButton).toBeDisabled()

    // "Compare against competitors" link
    expect(screen.getByRole('link', { name: /compare against competitors/i })).toBeInTheDocument()
  })

  it('competitor CTA has correct link', () => {
    render(<SidePanel issues={issues} />)

    const competitorLink = screen.getByRole('link', { name: /compare against competitors/i })
    expect(competitorLink).toHaveAttribute('href', '#competitors')
  })

  it('has no-print class for print CSS hiding', () => {
    const { container } = render(<SidePanel issues={issues} />)

    // The root aside element should have the no-print class
    const aside = container.querySelector('aside')
    expect(aside).toHaveClass('no-print')
  })
})
