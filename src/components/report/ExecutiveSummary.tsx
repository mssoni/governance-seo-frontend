import type { ExecutiveSummary as ExecutiveSummaryType, SummaryItem } from '../../types/api'
import { DetectedAsBadge, ConfidenceChip } from './Badge'

function SummaryCard({
  item,
  variant,
}: {
  item: SummaryItem
  variant: 'positive' | 'attention'
}) {
  const borderColor = variant === 'positive' ? 'border-green-200' : 'border-orange-200'
  const bgColor = variant === 'positive' ? 'bg-green-50' : 'bg-orange-50'
  const titleColor = variant === 'positive' ? 'text-green-800' : 'text-orange-800'
  const descColor = variant === 'positive' ? 'text-green-600' : 'text-orange-600'

  return (
    <li className={`rounded-lg border ${borderColor} ${bgColor} p-4`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className={`font-medium ${titleColor}`}>{item.title}</p>
        <div className="flex shrink-0 gap-1.5">
          <DetectedAsBadge detectedAs={item.detected_as} />
          <ConfidenceChip confidence={item.confidence} />
        </div>
      </div>
      <p className={`text-sm ${descColor}`}>{item.description}</p>
    </li>
  )
}

interface ExecutiveSummaryProps {
  summary: ExecutiveSummaryType
}

export default function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-gray-900">Executive Summary</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {/* What's Working */}
        <div data-testid="whats-working">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-sm text-green-600">
              ✓
            </span>
            What&apos;s Working
          </h3>
          <ul className="space-y-3">
            {summary.whats_working.map((item, i) => (
              <SummaryCard key={i} item={item} variant="positive" />
            ))}
          </ul>
        </div>

        {/* Needs Attention */}
        <div data-testid="needs-attention">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-orange-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-sm text-orange-600">
              !
            </span>
            What Needs Attention
          </h3>
          <ul className="space-y-3">
            {summary.needs_attention.map((item, i) => (
              <SummaryCard key={i} item={item} variant="attention" />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
