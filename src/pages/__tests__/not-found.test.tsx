import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFoundPage from '../NotFoundPage'

function renderWithRouter() {
  return render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>,
  )
}

describe('NotFoundPage', () => {
  it('renders 404 heading', () => {
    renderWithRouter()

    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument()
  })

  it('has accessible heading hierarchy', () => {
    renderWithRouter()

    const headings = screen.getAllByRole('heading')
    expect(headings.length).toBeGreaterThanOrEqual(1)
  })

  it('contains navigation link to home', () => {
    renderWithRouter()

    const homeLink = screen.getByRole('link', { name: /go.*home|back.*home|return.*home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('renders descriptive content', () => {
    renderWithRouter()

    expect(
      screen.getByText(/sorry.*couldn.*find/i),
    ).toBeInTheDocument()
  })
})
