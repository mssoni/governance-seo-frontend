import type { Issue, Severity } from '../../types/api'

interface BusinessImpactCategoriesProps {
  issues: Issue[]
}

interface CategoryConfig {
  name: string
  icon: React.ReactNode
}

const CATEGORIES: CategoryConfig[] = [
  {
    name: 'Trust & Credibility',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    name: 'Search Visibility',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    name: 'User Experience',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    name: 'Operational Risk',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
]

function getMaxSeverity(issues: Issue[]): Severity | null {
  if (issues.length === 0) return null
  if (issues.some((i) => i.severity === 'high')) return 'high'
  if (issues.some((i) => i.severity === 'medium')) return 'medium'
  return 'low'
}

function getStatusText(maxSeverity: Severity | null): string {
  if (maxSeverity === null) return 'Looking good'
  if (maxSeverity === 'low') return 'Minor improvements available'
  return 'Needs attention'
}

function getBorderColor(maxSeverity: Severity | null): string {
  if (maxSeverity === null) return 'border-l-green-400'
  if (maxSeverity === 'low') return 'border-l-amber-400'
  if (maxSeverity === 'medium') return 'border-l-amber-400'
  return 'border-l-red-400'
}

function getStatusColor(maxSeverity: Severity | null): string {
  if (maxSeverity === null) return 'text-green-600'
  if (maxSeverity === 'low') return 'text-amber-600'
  if (maxSeverity === 'medium') return 'text-amber-600'
  return 'text-red-600'
}

export default function BusinessImpactCategories({ issues }: BusinessImpactCategoriesProps) {
  const issuesByCategory = new Map<string, Issue[]>()
  for (const issue of issues) {
    const cat = issue.business_category
    if (!issuesByCategory.has(cat)) {
      issuesByCategory.set(cat, [])
    }
    issuesByCategory.get(cat)!.push(issue)
  }

  return (
    <section className="mt-8">
      <h2 className="mb-6 text-xl font-bold text-gray-900">Where You Stand</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {CATEGORIES.map((category) => {
          const categoryIssues = issuesByCategory.get(category.name) ?? []
          const maxSeverity = getMaxSeverity(categoryIssues)
          const statusText = getStatusText(maxSeverity)
          const borderColor = getBorderColor(maxSeverity)
          const statusColor = getStatusColor(maxSeverity)

          const summaryText =
            categoryIssues.length > 0
              ? categoryIssues[0].why_it_matters
              : 'No concerns detected in this area'

          const countText =
            categoryIssues.length === 1
              ? '1 finding'
              : categoryIssues.length > 1
                ? `${categoryIssues.length} findings`
                : null

          return (
            <div
              key={category.name}
              className={`rounded-lg border border-gray-200 border-l-4 ${borderColor} bg-white p-5 shadow-sm`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{category.icon}</span>
                  <h3 className="font-bold text-gray-900">{category.name}</h3>
                </div>
                {countText && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                    {countText}
                  </span>
                )}
              </div>
              <p className={`mb-2 text-sm font-medium ${statusColor}`}>{statusText}</p>
              <p className="text-sm leading-relaxed text-gray-600">{summaryText}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
