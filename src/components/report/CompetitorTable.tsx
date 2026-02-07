import { useState } from 'react'
import type { CompetitorRow } from '../../types/api'

// --- Props ---

interface CompetitorTableProps {
  userRow: CompetitorRow
  competitors: CompetitorRow[]
}

// --- Color coding helpers ---

type ColorClass = 'bg-green-50 text-green-800' | 'bg-red-50 text-red-800' | 'bg-yellow-50 text-yellow-800'

/** Speed bands ranked from best to worst */
const SPEED_RANK: Record<string, number> = {
  fast: 3,
  good: 2,
  average: 1,
  'needs work': 0,
  slow: 0,
}

function getSpeedRank(band: string): number {
  const lower = band.toLowerCase()
  for (const [key, rank] of Object.entries(SPEED_RANK)) {
    if (lower.includes(key)) return rank
  }
  return 1 // default to average
}

/** Content coverage ranked from best to worst (matches backend values) */
const COVERAGE_RANK: Record<string, number> = {
  comprehensive: 3,
  moderate: 2,
  basic: 1,
  minimal: 0,
}

function getCoverageRank(coverage: string): number {
  const lower = coverage.toLowerCase()
  for (const [key, rank] of Object.entries(COVERAGE_RANK)) {
    if (lower.includes(key)) return rank
  }
  return 1
}

function compareColor(userVal: number, compVal: number): ColorClass {
  if (userVal > compVal) return 'bg-green-50 text-green-800'
  if (userVal < compVal) return 'bg-red-50 text-red-800'
  return 'bg-yellow-50 text-yellow-800'
}

function getSpeedColor(userRow: CompetitorRow, comp: CompetitorRow): ColorClass {
  return compareColor(getSpeedRank(userRow.speed_band), getSpeedRank(comp.speed_band))
}

function getCoverageColor(userRow: CompetitorRow, comp: CompetitorRow): ColorClass {
  return compareColor(getCoverageRank(userRow.content_coverage), getCoverageRank(comp.content_coverage))
}

function getServiceBreadthColor(userRow: CompetitorRow, comp: CompetitorRow): ColorClass {
  return compareColor(userRow.service_breadth, comp.service_breadth)
}

function getLocalSignalsColor(userRow: CompetitorRow, comp: CompetitorRow): ColorClass {
  return compareColor(userRow.local_signals.length, comp.local_signals.length)
}

function getReviewColor(userRow: CompetitorRow, comp: CompetitorRow): ColorClass {
  const userScore = (userRow.review_count ?? 0) * (userRow.review_rating ?? 0)
  const compScore = (comp.review_count ?? 0) * (comp.review_rating ?? 0)
  return compareColor(userScore, compScore)
}

// --- Tooltip component ---

function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <span
      className="relative cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
      role="button"
      aria-label="Show details"
    >
      {children}
      {isVisible && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-10 mb-2 w-48 -translate-x-1/2 rounded-md bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
        >
          {content}
        </span>
      )}
    </span>
  )
}

// --- Signal display ---

function SignalDisplay({ signals }: { signals: string[] }) {
  const label = signals.length === 1 ? '1 signal' : `${signals.length} signals`
  const tooltipContent = signals.join(', ')

  return (
    <Tooltip content={tooltipContent}>
      <span>{label}</span>
    </Tooltip>
  )
}

// --- Review display ---

function ReviewDisplay({ count, rating }: { count: number | null; rating: number | null }) {
  if (count === null || rating === null) {
    return <span className="text-gray-400">N/A</span>
  }
  return <span>{count} reviews ({rating}★)</span>
}

// --- Main component ---

export default function CompetitorTable({ userRow, competitors }: CompetitorTableProps) {
  const headerCellClasses = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500'
  const cellClasses = 'whitespace-nowrap px-4 py-3 text-sm'

  return (
    <section aria-label="Competitor comparison table" className="mt-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Competitor Overview</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200" role="table">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className={headerCellClasses}>Name</th>
              <th scope="col" className={headerCellClasses}>Site Speed</th>
              <th scope="col" className={headerCellClasses}>Content Coverage</th>
              <th scope="col" className={headerCellClasses}>Service Breadth</th>
              <th scope="col" className={headerCellClasses}>Local Signals</th>
              <th scope="col" className={headerCellClasses}>Review Posture</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {/* User row — always first, highlighted */}
            <tr data-testid="user-row" className="bg-indigo-50 font-medium">
              <td className={`${cellClasses} font-bold text-indigo-700`}>
                <div>{userRow.name}</div>
                <div className="text-xs font-normal text-indigo-500">{userRow.url}</div>
              </td>
              <td className={`${cellClasses} bg-indigo-50`}>
                <Tooltip content={`Speed: ${userRow.speed_band}`}>
                  <span>{userRow.speed_band}</span>
                </Tooltip>
              </td>
              <td className={`${cellClasses} bg-indigo-50`}>
                <Tooltip content={`Coverage: ${userRow.content_coverage}`}>
                  <span>{userRow.content_coverage}</span>
                </Tooltip>
              </td>
              <td className={`${cellClasses} bg-indigo-50`}>
                <Tooltip content={`${userRow.service_breadth} services detected`}>
                  <span>{userRow.service_breadth}</span>
                </Tooltip>
              </td>
              <td className={`${cellClasses} bg-indigo-50`}>
                <SignalDisplay signals={userRow.local_signals} />
              </td>
              <td className={`${cellClasses} bg-indigo-50`}>
                <Tooltip content={`${userRow.review_count ?? 0} reviews, ${userRow.review_rating ?? 'N/A'} rating`}>
                  <ReviewDisplay count={userRow.review_count} rating={userRow.review_rating} />
                </Tooltip>
              </td>
            </tr>

            {/* Competitor rows with color coding */}
            {competitors.map((comp) => (
              <tr key={comp.url}>
                <td className={cellClasses}>
                  <div className="font-medium text-gray-900">{comp.name}</div>
                  <div className="text-xs text-gray-500">{comp.url}</div>
                </td>
                <td className={`${cellClasses} ${getSpeedColor(userRow, comp)}`}>
                  <Tooltip content={`Speed: ${comp.speed_band}`}>
                    <span>{comp.speed_band}</span>
                  </Tooltip>
                </td>
                <td className={`${cellClasses} ${getCoverageColor(userRow, comp)}`}>
                  <Tooltip content={`Coverage: ${comp.content_coverage}`}>
                    <span>{comp.content_coverage}</span>
                  </Tooltip>
                </td>
                <td className={`${cellClasses} ${getServiceBreadthColor(userRow, comp)}`}>
                  <Tooltip content={`${comp.service_breadth} services detected`}>
                    <span>{comp.service_breadth}</span>
                  </Tooltip>
                </td>
                <td className={`${cellClasses} ${getLocalSignalsColor(userRow, comp)}`}>
                  <SignalDisplay signals={comp.local_signals} />
                </td>
                <td className={`${cellClasses} ${getReviewColor(userRow, comp)}`}>
                  <Tooltip content={`${comp.review_count ?? 0} reviews, ${comp.review_rating ?? 'N/A'} rating`}>
                    <ReviewDisplay count={comp.review_count} rating={comp.review_rating} />
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
