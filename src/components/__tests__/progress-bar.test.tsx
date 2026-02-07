import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProgressBar from '../ProgressBar'

describe('ProgressBar', () => {
  it('displays progress as a percentage (0.0–1.0 → 0%–100%)', () => {
    render(
      <ProgressBar
        progress={0.80}
        currentStep="build_issues"
        stepsCompleted={['url_normalize', 'fetch_homepage', 'parse_sitemap', 'sample_pages', 'run_detectors', 'run_psi']}
      />
    )

    // Should show "80%" not "0.8%"
    expect(screen.getByText('80%')).toBeInTheDocument()
  })

  it('sets the progress bar width to the correct percentage', () => {
    render(
      <ProgressBar
        progress={0.55}
        currentStep="run_detectors"
        stepsCompleted={['url_normalize', 'fetch_homepage', 'parse_sitemap', 'sample_pages']}
      />
    )

    const progressbar = screen.getByRole('progressbar')
    expect(progressbar).toHaveAttribute('aria-valuenow', '55')
  })

  it('displays 0% when progress is 0', () => {
    render(
      <ProgressBar
        progress={0}
        currentStep={null}
        stepsCompleted={[]}
      />
    )

    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('displays 100% when progress is 1.0', () => {
    render(
      <ProgressBar
        progress={1.0}
        currentStep={null}
        stepsCompleted={['url_normalize', 'fetch_homepage', 'parse_sitemap', 'sample_pages', 'run_detectors', 'run_psi', 'build_issues', 'generate_checklist', 'build_report']}
      />
    )

    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('marks completed steps with a checkmark', () => {
    render(
      <ProgressBar
        progress={0.25}
        currentStep="sample_pages"
        stepsCompleted={['url_normalize', 'fetch_homepage', 'parse_sitemap']}
      />
    )

    // Completed steps should have checkmarks
    expect(screen.getByLabelText('url_normalize completed')).toBeInTheDocument()
    expect(screen.getByLabelText('fetch_homepage completed')).toBeInTheDocument()
    expect(screen.getByLabelText('parse_sitemap completed')).toBeInTheDocument()
  })
})
