import type { StrengthItem, GapItem } from '../../types/api'

// --- Significance color coding ---

const significanceStyles: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
}

function getSignificanceStyle(significance: string): string {
  const lower = significance.toLowerCase()
  for (const [key, style] of Object.entries(significanceStyles)) {
    if (lower.startsWith(key)) return style
  }
  return 'bg-gray-100 text-gray-800'
}

// --- Sub-components ---

function StrengthCard({ item, accentColor }: { item: StrengthItem; accentColor: 'red' | 'green' }) {
  const borderColor = accentColor === 'red' ? 'border-l-red-400' : 'border-l-green-400'

  return (
    <div className={`rounded-lg border border-gray-200 border-l-4 ${borderColor} bg-white p-4 shadow-sm`}>
      <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
      <p className="mt-1 text-sm text-gray-600">{item.description}</p>
      <ul className="mt-2 space-y-1" aria-label={`Evidence for ${item.title}`}>
        {item.evidence.map((ev) => (
          <li key={ev} className="flex items-start gap-2 text-xs text-gray-500">
            <svg
              className="mt-0.5 h-3 w-3 shrink-0 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span>{ev}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function GapRow({ gap }: { gap: GapItem }) {
  return (
    <tr className="border-b border-gray-100 last:border-b-0">
      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{gap.category}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{gap.your_value}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{gap.competitor_value}</td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSignificanceStyle(gap.significance)}`}
        >
          {gap.significance}
        </span>
      </td>
    </tr>
  )
}

// --- Main component ---

interface StrengthsGapsProps {
  competitorAdvantages: StrengthItem[]
  userStrengths: StrengthItem[]
  gaps: GapItem[]
}

export default function StrengthsGaps({ competitorAdvantages, userStrengths, gaps }: StrengthsGapsProps) {
  return (
    <section aria-label="Strengths and gaps analysis" className="mt-8 space-y-8">
      {/* Competitor Advantages */}
      <div data-testid="competitor-advantages">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
          What They&rsquo;re Doing Better
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {competitorAdvantages.map((item) => (
            <StrengthCard key={item.title} item={item} accentColor="red" />
          ))}
        </div>
      </div>

      {/* User Strengths */}
      <div data-testid="user-strengths">
        <h2 className="mb-4 text-xl font-bold text-gray-900">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
          What You&rsquo;re Doing Better
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {userStrengths.map((item) => (
            <StrengthCard key={item.title} item={item} accentColor="green" />
          ))}
        </div>
      </div>

      {/* Gap Breakdown */}
      <div data-testid="gap-breakdown">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Gap Breakdown by Category</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200" role="table">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Your Value
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Competitor Value
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Significance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {gaps.map((gap) => (
                <GapRow key={gap.category} gap={gap} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
