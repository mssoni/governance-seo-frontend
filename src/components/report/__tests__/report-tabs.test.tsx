import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ReportTabs from '../ReportTabs'
import type { TabId } from '../ReportTabs'

function renderTabs(
  overrides: Partial<{
    activeTab: TabId
    onTabChange: ReturnType<typeof vi.fn>
    seoEnabled: boolean
  }> = {},
  children?: React.ReactNode,
) {
  const onTabChange = overrides.onTabChange ?? vi.fn()
  const props = {
    activeTab: overrides.activeTab ?? 'business' as TabId,
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
  it('renders all three tab buttons (Business, Technical, SEO)', () => {
    renderTabs()

    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /business overview/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /technical details/i })).toBeInTheDocument()
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

  it('clicking business tab calls onTabChange with "business"', async () => {
    const user = userEvent.setup()
    const { onTabChange } = renderTabs({ activeTab: 'technical' })

    const businessTab = screen.getByRole('tab', { name: /business overview/i })
    await user.click(businessTab)

    expect(onTabChange).toHaveBeenCalledWith('business')
  })

  it('clicking technical tab calls onTabChange with "technical"', async () => {
    const user = userEvent.setup()
    const { onTabChange } = renderTabs({ activeTab: 'business' })

    const techTab = screen.getByRole('tab', { name: /technical details/i })
    await user.click(techTab)

    expect(onTabChange).toHaveBeenCalledWith('technical')
  })

  it('clicking SEO tab calls onTabChange with "seo" when enabled', async () => {
    const user = userEvent.setup()
    const { onTabChange } = renderTabs({ activeTab: 'business', seoEnabled: true })

    const seoTab = screen.getByRole('tab', { name: /competitive seo report/i })
    await user.click(seoTab)

    expect(onTabChange).toHaveBeenCalledWith('seo')
  })

  it('clicking disabled SEO tab does not call onTabChange', async () => {
    const user = userEvent.setup()
    const { onTabChange } = renderTabs({ activeTab: 'business', seoEnabled: false })

    const seoTab = screen.getByRole('tab', { name: /competitive seo report/i })
    await user.click(seoTab)

    expect(onTabChange).not.toHaveBeenCalled()
  })

  it('active tab has aria-selected=true', () => {
    renderTabs({ activeTab: 'business' })

    const businessTab = screen.getByRole('tab', { name: /business overview/i })
    const techTab = screen.getByRole('tab', { name: /technical details/i })
    const seoTab = screen.getByRole('tab', { name: /competitive seo report/i })

    expect(businessTab).toHaveAttribute('aria-selected', 'true')
    expect(techTab).toHaveAttribute('aria-selected', 'false')
    expect(seoTab).toHaveAttribute('aria-selected', 'false')
  })

  it('SEO tab shows aria-selected=true when active', () => {
    renderTabs({ activeTab: 'seo', seoEnabled: true })

    const businessTab = screen.getByRole('tab', { name: /business overview/i })
    const seoTab = screen.getByRole('tab', { name: /competitive seo report/i })

    expect(businessTab).toHaveAttribute('aria-selected', 'false')
    expect(seoTab).toHaveAttribute('aria-selected', 'true')
  })

  it('disabled tab shows tooltip text "Add competitors to unlock"', () => {
    renderTabs({ seoEnabled: false })

    expect(screen.getByText(/add competitors to unlock/i)).toBeInTheDocument()
  })

  it('renders children inside tabpanel', () => {
    renderTabs({}, <div>My business content</div>)

    const panel = screen.getByRole('tabpanel')
    expect(panel).toBeInTheDocument()
    expect(screen.getByText('My business content')).toBeInTheDocument()
  })

  it('tabs have aria-controls linking to panel', () => {
    renderTabs()

    const businessTab = screen.getByRole('tab', { name: /business overview/i })
    const panel = screen.getByRole('tabpanel')

    // Active tab controls the panel
    expect(businessTab).toHaveAttribute('aria-controls', panel.id)
  })

  it('supports keyboard navigation with arrow keys', async () => {
    const user = userEvent.setup()
    const { onTabChange } = renderTabs({ activeTab: 'business', seoEnabled: true })

    const businessTab = screen.getByRole('tab', { name: /business overview/i })
    businessTab.focus()

    await user.keyboard('{ArrowRight}')
    expect(onTabChange).toHaveBeenCalledWith('technical')
  })
})
