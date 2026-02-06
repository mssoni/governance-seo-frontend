import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ReportTabs from '../ReportTabs'

function renderTabs(
  overrides: Partial<{
    activeTab: 'governance' | 'seo'
    onTabChange: ReturnType<typeof vi.fn>
    seoEnabled: boolean
  }> = {},
  children?: React.ReactNode,
) {
  const onTabChange = overrides.onTabChange ?? vi.fn()
  const props = {
    activeTab: overrides.activeTab ?? 'governance' as const,
    onTabChange,
    seoEnabled: overrides.seoEnabled ?? false,
  }
  return {
    ...render(
      <ReportTabs {...props}>
        {children ?? <div>Tab content</div>}
      </ReportTabs>,
    ),
    onTabChange,
  }
}

describe('ReportTabs (US-8.4)', () => {
  it('renders both tab buttons (Governance and SEO)', () => {
    renderTabs()

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /governance report/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /competitive seo report/i })).toBeInTheDocument()
  })

  it('SEO tab is disabled when seoEnabled=false', () => {
    renderTabs({ seoEnabled: false })

    const seoTab = screen.getByRole('tab', { name: /competitive seo report/i })
    expect(seoTab).toBeDisabled()
  })

  it('SEO tab is enabled when seoEnabled=true', () => {
    renderTabs({ seoEnabled: true })

    const seoTab = screen.getByRole('tab', { name: /competitive seo report/i })
    expect(seoTab).toBeEnabled()
  })

  it('clicking governance tab calls onTabChange with "governance"', async () => {
    const user = userEvent.setup()
    const { onTabChange } = renderTabs({ activeTab: 'seo', seoEnabled: true })

    const govTab = screen.getByRole('tab', { name: /governance report/i })
    await user.click(govTab)

    expect(onTabChange).toHaveBeenCalledWith('governance')
  })

  it('clicking SEO tab calls onTabChange with "seo" when enabled', async () => {
    const user = userEvent.setup()
    const { onTabChange } = renderTabs({ activeTab: 'governance', seoEnabled: true })

    const seoTab = screen.getByRole('tab', { name: /competitive seo report/i })
    await user.click(seoTab)

    expect(onTabChange).toHaveBeenCalledWith('seo')
  })

  it('clicking disabled SEO tab does not call onTabChange', async () => {
    const user = userEvent.setup()
    const { onTabChange } = renderTabs({ activeTab: 'governance', seoEnabled: false })

    const seoTab = screen.getByRole('tab', { name: /competitive seo report/i })
    await user.click(seoTab)

    expect(onTabChange).not.toHaveBeenCalled()
  })

  it('active tab has aria-selected=true', () => {
    renderTabs({ activeTab: 'governance' })

    const govTab = screen.getByRole('tab', { name: /governance report/i })
    const seoTab = screen.getByRole('tab', { name: /competitive seo report/i })

    expect(govTab).toHaveAttribute('aria-selected', 'true')
    expect(seoTab).toHaveAttribute('aria-selected', 'false')
  })

  it('SEO tab shows aria-selected=true when active', () => {
    renderTabs({ activeTab: 'seo', seoEnabled: true })

    const govTab = screen.getByRole('tab', { name: /governance report/i })
    const seoTab = screen.getByRole('tab', { name: /competitive seo report/i })

    expect(govTab).toHaveAttribute('aria-selected', 'false')
    expect(seoTab).toHaveAttribute('aria-selected', 'true')
  })

  it('disabled tab shows tooltip text "Add competitors to unlock"', () => {
    renderTabs({ seoEnabled: false })

    expect(screen.getByText(/add competitors to unlock/i)).toBeInTheDocument()
  })

  it('renders children inside tabpanel', () => {
    renderTabs({}, <div>My governance content</div>)

    const panel = screen.getByRole('tabpanel')
    expect(panel).toBeInTheDocument()
    expect(screen.getByText('My governance content')).toBeInTheDocument()
  })

  it('tabs have aria-controls linking to panel', () => {
    renderTabs()

    const govTab = screen.getByRole('tab', { name: /governance report/i })
    const panel = screen.getByRole('tabpanel')

    // Active tab controls the panel
    expect(govTab).toHaveAttribute('aria-controls', panel.id)
  })

  it('supports keyboard navigation with arrow keys', async () => {
    const user = userEvent.setup()
    const { onTabChange } = renderTabs({ activeTab: 'governance', seoEnabled: true })

    const govTab = screen.getByRole('tab', { name: /governance report/i })
    govTab.focus()

    await user.keyboard('{ArrowRight}')
    expect(onTabChange).toHaveBeenCalledWith('seo')
  })
})
