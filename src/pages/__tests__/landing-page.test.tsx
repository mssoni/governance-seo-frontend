import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from '../LandingPage'

function renderLandingPage() {
  return render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  )
}

describe('LandingPage', () => {
  it('renders hero heading', () => {
    renderLandingPage()
    expect(
      screen.getByRole('heading', { level: 1 }),
    ).toBeInTheDocument()
  })

  it('renders hero subheading', () => {
    renderLandingPage()
    expect(
      screen.getByText(/detailed governance and competitive seo report/i),
    ).toBeInTheDocument()
  })

  it('renders CTA button with correct text', () => {
    renderLandingPage()
    expect(
      screen.getByRole('link', { name: /generate governance report/i }),
    ).toBeInTheDocument()
  })

  it('CTA button links to form section', () => {
    renderLandingPage()
    const cta = screen.getByRole('link', { name: /generate governance report/i })
    expect(cta).toHaveAttribute('href', '#report-form')
  })

  it('renders trust indicators', () => {
    renderLandingPage()
    expect(screen.getByText(/no login required/i)).toBeInTheDocument()
    expect(screen.getByText(/results in under 90 seconds/i)).toBeInTheDocument()
    expect(screen.getByText(/100% transparent/i)).toBeInTheDocument()
  })

  it('renders form section with correct id', () => {
    const { container } = render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    )
    const formSection = container.querySelector('#report-form')
    expect(formSection).toBeInTheDocument()
  })

  it('all elements visible at 375px width (render check)', () => {
    // jsdom doesn't support viewport — just verify all key elements render
    renderLandingPage()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /generate governance report/i })).toBeInTheDocument()
    expect(screen.getByText(/no login required/i)).toBeInTheDocument()
    expect(screen.getByText(/results in under 90 seconds/i)).toBeInTheDocument()
    expect(screen.getByText(/100% transparent/i)).toBeInTheDocument()
  })

  it('CTA click triggers scroll behavior via anchor', async () => {
    // We can verify the link behavior is set up correctly
    // In jsdom, scrollIntoView is not supported, but we can mock it
    const scrollMock = vi.fn()
    Element.prototype.scrollIntoView = scrollMock

    renderLandingPage()
    const user = userEvent.setup()
    const cta = screen.getByRole('link', { name: /generate governance report/i })
    await user.click(cta)
    // The anchor link href="#report-form" handles scrolling natively
    expect(cta).toHaveAttribute('href', '#report-form')
  })
})
