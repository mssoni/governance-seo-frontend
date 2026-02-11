import type { CategoryInsight } from '../../types/api'

const ICON_MAP: Record<string, React.ReactNode> = {
  shield: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  search: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  user: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  alert: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
}

function getStatusBorderColor(status: string): string {
  if (status === 'at_risk') return 'border-l-red-400'
  if (status === 'on_track') return 'border-l-amber-400'
  return 'border-l-green-400'
}

export default function PersonalizedCategoryCards({
  insights,
}: {
  insights: CategoryInsight[]
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-6 text-xl font-bold text-gray-900">Where You Stand</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight) => {
          const borderColor = getStatusBorderColor(insight.status)
          const icon = ICON_MAP[insight.icon] ?? ICON_MAP.shield
          const countText =
            insight.issue_count === 1
              ? '1 high-confidence finding'
              : insight.issue_count > 1
                ? `${insight.issue_count} high-confidence findings`
                : null

          return (
            <div
              key={insight.category_id}
              className={`rounded-lg border border-gray-200 border-l-4 ${borderColor} bg-white p-5 shadow-sm`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-gray-400">{icon}</span>
                <h3 className="font-bold text-gray-900">{insight.display_name}</h3>
              </div>

              <p className="mb-3 text-base font-medium text-gray-900 leading-snug">
                {insight.headline}
              </p>

              {insight.detail && (
                <p className="mb-3 text-sm text-gray-600 leading-relaxed">{insight.detail}</p>
              )}

              {countText && (
                <p className="text-xs text-gray-400 mt-3">Based on {countText}</p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
