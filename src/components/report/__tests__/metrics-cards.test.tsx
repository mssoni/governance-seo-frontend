import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import MetricsCards from '../MetricsCards'
import type { MetricCard } from '../../../types/api'
import goldenReport from '../../../mocks/golden/governance-report.json'

const metrics = goldenReport.metrics as MetricCard[]

describe('MetricsCards (US-5.3)', () => {
  it('renders all metric cards from data', () => {
    render(<MetricsCards metrics={metrics} />)

    // Golden fixture has 6 metrics
    expect(screen.getByText('Performance')).toBeInTheDocument()
    expect(screen.getByText('Accessibility Risk')).toBeInTheDocument()
    expect(screen.getByText('Maintainability')).toBeInTheDocument()
    expect(screen.getByText('Security Posture')).toBeInTheDocument()
    expect(screen.getByText('Integration Posture')).toBeInTheDocument()
    expect(screen.getByText('Reliability Posture')).toBeInTheDocument()
  })

  it('each card shows value and meaning', () => {
    render(<MetricsCards metrics={metrics} />)

    // Check value and meaning for each metric
    expect(screen.getByText('42/100')).toBeInTheDocument()
    expect(screen.getByText('Below average — page loads slowly on mobile devices.')).toBeInTheDocument()

    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Some accessibility issues detected that may affect users with disabilities.')).toBeInTheDocument()

    expect(screen.getByText('Good')).toBeInTheDocument()
    expect(screen.getByText('Site structure appears consistent across sampled pages.')).toBeInTheDocument()
  })

  it('evidence section expands on click', async () => {
    const user = userEvent.setup()
    render(<MetricsCards metrics={metrics} />)

    // All evidence sections should be collapsed initially
    const showButtons = screen.getAllByText('Show evidence')
    expect(showButtons.length).toBe(6)

    // Evidence content should not be visible initially (hidden in DOM for print support)
    expect(screen.queryByText('PageSpeed Insights mobile score: 42')).not.toBeVisible()

    // Click "Show evidence" on the first card (Performance)
    await user.click(showButtons[0])

    // Now evidence should be visible
    expect(screen.getByText('PageSpeed Insights mobile score: 42')).toBeInTheDocument()
    expect(screen.getByText('Largest Contentful Paint: 4.2s')).toBeInTheDocument()

    // Button text should change to "Hide evidence"
    expect(screen.getByText('Hide evidence')).toBeInTheDocument()
  })

  it('shows "Why it matters" text', () => {
    render(<MetricsCards metrics={metrics} />)

    expect(screen.getByText('Slow sites lose visitors and may rank lower in search results.')).toBeInTheDocument()
    expect(screen.getByText('Accessibility issues can exclude users and create legal risk.')).toBeInTheDocument()
    expect(screen.getByText('Consistent structure reduces maintenance cost and user confusion.')).toBeInTheDocument()
    expect(screen.getByText('Missing security headers increase risk of attacks and data exposure.')).toBeInTheDocument()
  })
})
