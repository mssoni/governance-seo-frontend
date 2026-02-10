import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import GovernanceContent from '../GovernanceContent'
import BusinessContent from '../BusinessContent'
import SEOContent from '../SEOContent'
import SEOPollingProgress from '../SEOPollingProgress'
import goldenReport from '../../../mocks/golden/governance-report.json'
import goldenSeoReport from '../../../mocks/golden/seo-report.json'
import type { GovernanceReport, SEOReport } from '../../../types/api'

const report = goldenReport as GovernanceReport
const seoReport = goldenSeoReport as SEOReport

describe('Tab content extraction (CHG-031)', () => {
  describe('GovernanceContent', () => {
    it('renders executive summary section', () => {
      render(<GovernanceContent report={report} />)
      expect(screen.getByText(/executive summary/i)).toBeInTheDocument()
    })

    it('renders issues list', () => {
      render(<GovernanceContent report={report} />)
      // Golden fixture contains "No sitemap.xml found" issue
      expect(screen.getByText('No sitemap.xml found')).toBeInTheDocument()
    })
  })

  describe('BusinessContent', () => {
    it('renders executive story narrative', () => {
      const switchFn = () => {}
      render(<BusinessContent report={report} onSwitchToTechnical={switchFn} />)
      // Golden fixture narrative contains "growing your online presence"
      expect(
        screen.getByText(/growing your online presence and building credibility/)
      ).toBeInTheDocument()
    })

    it('renders top improvements section', () => {
      const switchFn = () => {}
      render(<BusinessContent report={report} onSwitchToTechnical={switchFn} />)
      expect(screen.getByText(/top improvements/i)).toBeInTheDocument()
    })
  })

  describe('SEOContent', () => {
    it('renders competitor table', () => {
      render(<SEOContent report={seoReport} />)
      // Golden SEO fixture should have competitor rows rendered in a table
      const rows = screen.getAllByRole('row')
      expect(rows.length).toBeGreaterThanOrEqual(2) // user row + at least 1 competitor
    })
  })

  describe('SEOPollingProgress', () => {
    it('renders progress bar with step info', () => {
      render(
        <SEOPollingProgress
          progress={45}
          currentStep="analyze_competitors"
          stepsCompleted={['url_normalize', 'fetch_homepage']}
        />
      )
      expect(screen.getByText(/generating seo report/i)).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('ReportPage line count', () => {
    it('should be under 320 lines after extraction', async () => {
      // This test verifies the extraction actually reduced ReportPage size
      const reportPageModule = await import('../../../pages/ReportPage?raw')
      const lines = (reportPageModule.default as string).split('\n').length
      expect(lines).toBeLessThanOrEqual(320)
    })
  })
})
