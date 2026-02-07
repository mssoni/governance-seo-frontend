import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '../ErrorBoundary'

// Suppress React error boundary console.error noise in tests
const originalConsoleError = console.error
beforeEach(() => {
  // eslint-disable-next-line no-console
  console.error = vi.fn()
})
afterEach(() => {
  // eslint-disable-next-line no-console
  console.error = originalConsoleError
})

function ProblemChild(): JSX.Element {
  throw new Error('Test error')
}

function GoodChild() {
  return <div>Healthy child</div>
}

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <GoodChild />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Healthy child')).toBeInTheDocument()
  })

  it('catches rendering errors and shows fallback UI', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('shows retry button that resets the error state', () => {
    let shouldThrow = true

    function ConditionalChild() {
      if (shouldThrow) {
        throw new Error('Conditional error')
      }
      return <div>Recovered child</div>
    }

    render(
      <ErrorBoundary>
        <ConditionalChild />
      </ErrorBoundary>,
    )

    // Should show fallback
    expect(screen.getByRole('alert')).toBeInTheDocument()

    // Fix the error condition
    shouldThrow = false

    // Click retry
    const retryButton = screen.getByRole('button', { name: /try again/i })
    expect(retryButton).toBeInTheDocument()
    fireEvent.click(retryButton)

    // Should render child again
    expect(screen.getByText('Recovered child')).toBeInTheDocument()
  })

  it('fallback UI has accessible heading', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    )

    const heading = screen.getByRole('heading')
    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toMatch(/something went wrong/i)
  })
})
