import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import ChecklistSection from '../ChecklistSection'
import type { ChecklistItem } from '../../../types/api'
import goldenReport from '../../../mocks/golden/governance-report.json'

const items = goldenReport.checklist_30d as ChecklistItem[]

describe('ChecklistSection (US-5.5)', () => {
  it('renders items grouped by category', () => {
    render(<ChecklistSection items={items} />)

    // Golden fixture has categories: Technical Hygiene, Performance, Accessibility, Security, Reliability
    expect(screen.getByText('Technical Hygiene')).toBeInTheDocument()
    expect(screen.getByText('Performance')).toBeInTheDocument()
    expect(screen.getByText('Accessibility')).toBeInTheDocument()
    expect(screen.getByText('Security')).toBeInTheDocument()
    expect(screen.getByText('Reliability')).toBeInTheDocument()
  })

  it('each item shows all fields (action, frequency, owner, effort, why_it_matters)', () => {
    render(<ChecklistSection items={items} />)

    // Check first item from golden fixture
    expect(screen.getByText('Generate and submit XML sitemap')).toBeInTheDocument()
    // Multiple items have "One-time" frequency
    expect(screen.getAllByText('One-time').length).toBeGreaterThanOrEqual(1)
    // Multiple items have "developer" owner
    expect(screen.getAllByText('developer').length).toBeGreaterThanOrEqual(1)
    // Effort badge "S" should be shown
    expect(screen.getAllByText('S').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Ensures search engines discover all your pages.')).toBeInTheDocument()

    // Check an item with effort "M"
    expect(screen.getByText('Optimize LCP element (hero image/banner)')).toBeInTheDocument()
    expect(screen.getAllByText('M').length).toBeGreaterThanOrEqual(1)
  })

  it('checkboxes toggle on click (local state only)', async () => {
    const user = userEvent.setup()
    render(<ChecklistSection items={items} />)

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBe(items.length)

    // All unchecked initially
    checkboxes.forEach((cb) => {
      expect(cb).not.toBeChecked()
    })

    // Toggle first checkbox
    await user.click(checkboxes[0])
    expect(checkboxes[0]).toBeChecked()

    // Toggle it back
    await user.click(checkboxes[0])
    expect(checkboxes[0]).not.toBeChecked()
  })

  it('renders effort badges with correct color coding', () => {
    render(<ChecklistSection items={items} />)

    // S effort badges should have green styling
    const sBadges = screen.getAllByTestId('effort-badge-S')
    sBadges.forEach((badge) => {
      expect(badge.className).toContain('green')
    })

    // M effort badges should have yellow styling
    const mBadges = screen.getAllByTestId('effort-badge-M')
    mBadges.forEach((badge) => {
      expect(badge.className).toContain('yellow')
    })
  })

  it('category sections are collapsible', async () => {
    const user = userEvent.setup()
    render(<ChecklistSection items={items} />)

    // Find the first category button and the item within it
    const categoryButton = screen.getByRole('button', { name: /Technical Hygiene/i })

    // Items visible by default (expanded)
    expect(screen.getByText('Generate and submit XML sitemap')).toBeInTheDocument()

    // Collapse the category — item removed from DOM
    await user.click(categoryButton)
    expect(screen.queryByText('Generate and submit XML sitemap')).not.toBeInTheDocument()

    // Expand it again — item reappears
    await user.click(categoryButton)
    expect(screen.getByText('Generate and submit XML sitemap')).toBeInTheDocument()
  })
})
