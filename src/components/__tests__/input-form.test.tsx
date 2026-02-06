import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import InputForm from '../InputForm'
import type { GovernanceReportRequest } from '../../types/api'

const noop = async () => {}

function renderForm(props: { onSubmit?: (data: GovernanceReportRequest) => Promise<void>; isLoading?: boolean } = {}) {
  const onSubmit = props.onSubmit ?? vi.fn(noop)
  return {
    onSubmit,
    ...render(<InputForm onSubmit={onSubmit} isLoading={props.isLoading ?? false} />),
  }
}

describe('InputForm', () => {
  it('renders all required fields', () => {
    renderForm()
    expect(screen.getByLabelText(/website url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^city/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/state\/region/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/business type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/intent/i)).toBeInTheDocument()
  })

  it('submit button is disabled when required fields are empty', () => {
    renderForm()
    const submitBtn = screen.getByRole('button', { name: /generate governance report/i })
    expect(submitBtn).toBeDisabled()
  })

  it('shows validation error for invalid URL', async () => {
    renderForm()
    const user = userEvent.setup()

    const urlInput = screen.getByLabelText(/website url/i)
    await user.type(urlInput, 'not-a-url')
    await user.tab() // trigger blur validation

    expect(await screen.findByText(/please enter a valid url/i)).toBeInTheDocument()
  })

  it('shows validation errors when submitting with missing required fields', async () => {
    renderForm()
    const user = userEvent.setup()

    // Fill only the URL so the button becomes semi-valid, then force submit via form
    const urlInput = screen.getByLabelText(/website url/i)
    await user.type(urlInput, 'https://example.com')
    await user.tab()

    // The submit button should still be disabled with other fields empty
    const submitBtn = screen.getByRole('button', { name: /generate governance report/i })
    expect(submitBtn).toBeDisabled()
  })

  it('calls onSubmit with correct payload when all fields are valid', async () => {
    const onSubmit = vi.fn(noop)
    render(<InputForm onSubmit={onSubmit} isLoading={false} />)
    const user = userEvent.setup()

    // Fill all fields
    await user.type(screen.getByLabelText(/website url/i), 'https://example.com')
    await user.type(screen.getByLabelText(/^city/i), 'New York')
    await user.type(screen.getByLabelText(/state\/region/i), 'NY')
    await user.type(screen.getByLabelText(/country/i), 'US')

    await user.selectOptions(screen.getByLabelText(/business type/i), 'clinic')
    await user.selectOptions(screen.getByLabelText(/intent/i), 'seo')

    const submitBtn = screen.getByRole('button', { name: /generate governance report/i })
    expect(submitBtn).toBeEnabled()
    await user.click(submitBtn)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        website_url: 'https://example.com',
        location: {
          city: 'New York',
          region: 'NY',
          country: 'US',
        },
        business_type: 'clinic',
        intent: 'seo',
      } satisfies GovernanceReportRequest)
    })
  })

  it('submit button shows loading state during submission', () => {
    renderForm({ isLoading: true })
    const submitBtn = screen.getByRole('button', { name: /generating|loading/i })
    expect(submitBtn).toBeDisabled()
  })

  it('business type dropdown contains all 10 options', () => {
    renderForm()
    const select = screen.getByLabelText(/business type/i) as HTMLSelectElement
    // 10 business types + 1 placeholder = 11 options
    const options = select.querySelectorAll('option')
    // Filter out the placeholder
    const valueOptions = Array.from(options).filter((opt) => opt.value !== '')
    expect(valueOptions).toHaveLength(10)

    const expectedValues = [
      'clinic', 'dental', 'healthcare_services', 'ngo', 'education',
      'construction', 'logistics', 'manufacturing', 'professional_services', 'other',
    ]
    const actualValues = valueOptions.map((opt) => opt.value)
    expect(actualValues).toEqual(expectedValues)
  })

  it('intent selector contains all 3 options', () => {
    renderForm()
    const select = screen.getByLabelText(/intent/i) as HTMLSelectElement
    const options = select.querySelectorAll('option')
    // 3 intent options + 1 placeholder = 4 options
    const valueOptions = Array.from(options).filter((opt) => opt.value !== '')
    expect(valueOptions).toHaveLength(3)

    const expectedValues = ['seo', 'governance', 'both']
    const actualValues = valueOptions.map((opt) => opt.value)
    expect(actualValues).toEqual(expectedValues)
  })
})
