import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import CompetitorTable from '../CompetitorTable'
import type { CompetitorRow } from '../../../types/api'

const userRow: CompetitorRow = {
  name: 'Your Business',
  url: 'https://example.com',
  speed_band: 'Fast',
  content_coverage: 'Good',
  service_breadth: 12,
  local_signals: ['location_page', 'schema_markup', 'nap_consistent'],
  review_count: 45,
  review_rating: 4.5,
}

const competitors: CompetitorRow[] = [
  {
    name: 'Competitor A',
    url: 'https://competitor-a.com',
    speed_band: 'Slow',
    content_coverage: 'Basic',
    service_breadth: 5,
    local_signals: ['schema_markup'],
    review_count: 120,
    review_rating: 4.8,
  },
  {
    name: 'Competitor B',
    url: 'https://competitor-b.com',
    speed_band: 'Average',
    content_coverage: 'Good',
    service_breadth: 8,
    local_signals: ['location_page', 'nap_consistent'],
    review_count: 30,
    review_rating: 3.9,
  },
]

describe('CompetitorTable (US-8.1)', () => {
  it('renders correct number of rows (you + competitors)', () => {
    render(<CompetitorTable userRow={userRow} competitors={competitors} />)

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    // 1 header row + 1 user row + 2 competitor rows = 4
    expect(rows).toHaveLength(4)
  })

  it('"You" row is first and highlighted', () => {
    render(<CompetitorTable userRow={userRow} competitors={competitors} />)

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    // rows[0] is header, rows[1] should be the user row
    const firstDataRow = rows[1]

    expect(within(firstDataRow).getByText(/your business/i)).toBeInTheDocument()
    // Check for highlight styling — user row should have a distinguishing data-testid
    expect(firstDataRow).toHaveAttribute('data-testid', 'user-row')
  })

  it('shows all columns with correct values', () => {
    render(<CompetitorTable userRow={userRow} competitors={competitors} />)

    // Check header columns
    expect(screen.getByText(/site speed/i)).toBeInTheDocument()
    expect(screen.getByText(/content coverage/i)).toBeInTheDocument()
    expect(screen.getByText(/service breadth/i)).toBeInTheDocument()
    expect(screen.getByText(/local signals/i)).toBeInTheDocument()
    expect(screen.getByText(/review posture/i)).toBeInTheDocument()

    // Check user row values (scoped to user row to avoid duplicates)
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    const userDataRow = rows[1]
    expect(within(userDataRow).getByText('Fast')).toBeInTheDocument()
    expect(within(userDataRow).getByText('Good')).toBeInTheDocument()
    expect(within(userDataRow).getByText('12')).toBeInTheDocument()

    // Check competitor A values (row index 2)
    const compARow = rows[2]
    expect(within(compARow).getByText('Slow')).toBeInTheDocument()
    expect(within(compARow).getByText('Basic')).toBeInTheDocument()
    expect(within(compARow).getByText('5')).toBeInTheDocument()
  })

  it('applies correct color coding (green when user is better)', () => {
    render(<CompetitorTable userRow={userRow} competitors={competitors} />)

    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')

    // Competitor A row (index 2)
    const compARow = rows[2]
    // User has service_breadth 12 vs Competitor A's 5 — user is better
    // The competitor's cell should be red (user advantage)
    const serviceCells = within(compARow).getAllByRole('cell')
    // service_breadth is the 4th data column (index 3 in cells, after name column at 0)
    const serviceBreadthCell = serviceCells[3]
    // Should have red background class because user (12) > competitor (5)
    expect(serviceBreadthCell.className).toMatch(/green|bg-green/)

    // Competitor A has 120 reviews vs user's 45 — competitor is better
    // Review posture cell should be red for Competitor A row
    const reviewCell = serviceCells[5]
    expect(reviewCell.className).toMatch(/red|bg-red/)
  })

  it('shows local signals count in cells', () => {
    render(<CompetitorTable userRow={userRow} competitors={competitors} />)

    // User has 3 local signals, shown as count
    expect(screen.getByText('3 signals')).toBeInTheDocument()
    // Competitor A has 1
    expect(screen.getByText('1 signal')).toBeInTheDocument()
    // Competitor B has 2
    expect(screen.getByText('2 signals')).toBeInTheDocument()
  })

  it('shows tooltips with evidence details on hover', async () => {
    render(<CompetitorTable userRow={userRow} competitors={competitors} />)
    const user = userEvent.setup()

    // Find the local signals cell for user row — should show tooltip listing signals
    const signalCell = screen.getByText('3 signals')
    await user.hover(signalCell)

    // Tooltip should show the signal names
    expect(await screen.findByText(/location_page/)).toBeInTheDocument()
    expect(screen.getByText(/schema_markup/)).toBeInTheDocument()
    expect(screen.getByText(/nap_consistent/)).toBeInTheDocument()
  })

  it('renders review posture with count and rating', () => {
    render(<CompetitorTable userRow={userRow} competitors={competitors} />)

    // User: 45 reviews, 4.5 rating
    expect(screen.getByText(/45.*4\.5/)).toBeInTheDocument()
    // Competitor A: 120 reviews, 4.8 rating
    expect(screen.getByText(/120.*4\.8/)).toBeInTheDocument()
  })
})
