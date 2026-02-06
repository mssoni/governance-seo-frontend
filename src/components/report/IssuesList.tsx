import { useState } from 'react'
import type { Issue, Severity } from '../../types/api'
import { DetectedAsBadge, ConfidenceChip } from './Badge'
import EvidencePanel from './EvidencePanel'

const severityOrder: Record<Severity, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

const severityStyles: Record<Severity, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-orange-100 text-orange-800',
  low: 'bg-green-100 text-green-800',
}

const severityLabels: Record<Severity, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${severityStyles[severity]}`}
    >
      {severityLabels[severity]}
    </span>
  )
}

type FilterValue = 'all' | Severity

const filterOptions: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

function IssueCard({ issue }: { issue: Issue }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div data-testid="issue-card" className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-gray-900">{issue.title}</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <SeverityBadge severity={issue.severity} />
            <ConfidenceChip confidence={issue.confidence} />
            <DetectedAsBadge detectedAs={issue.detected_as} />
          </div>
        </div>
        <button
          type="button"
          aria-label="Expand issue details"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg
            className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <EvidencePanel evidence={issue.evidence} label="Show evidence" defaultOpen />

          <div className="mt-3 space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Why it matters</p>
              <p className="mt-0.5 text-sm text-gray-700">{issue.why_it_matters}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                What happens if ignored
              </p>
              <p className="mt-0.5 text-sm text-gray-700">{issue.what_happens_if_ignored}</p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">What to do</p>
              <ul className="mt-0.5 list-disc space-y-0.5 pl-5">
                {issue.what_to_do.map((step, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Expected impact
              </p>
              <p className="mt-0.5 text-sm text-gray-700">{issue.expected_impact}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface IssuesListProps {
  issues: Issue[]
}

export default function IssuesList({ issues }: IssuesListProps) {
  const [filter, setFilter] = useState<FilterValue>('all')

  const sorted = [...issues].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

  const filtered = filter === 'all' ? sorted : sorted.filter((issue) => issue.severity === filter)

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Issues</h2>

      {/* Filter buttons */}
      <div className="mb-4 flex gap-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={filter === option.value}
            onClick={() => setFilter(option.value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              filter === option.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Issue cards */}
      <div className="space-y-3">
        {filtered.map((issue) => (
          <IssueCard key={issue.issue_id} issue={issue} />
        ))}
      </div>
    </section>
  )
}
