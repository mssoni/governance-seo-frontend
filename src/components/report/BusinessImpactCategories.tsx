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

// CHG-016: Business-impact framing per category (from business_goals.py)
const CATEGORY_BUSINESS_IMPACT: Record<string, {atRisk: string; onTrack: string}> = {
  "Trust & Credibility": {
    atRisk: "Visitors may not fully trust your site yet",
    onTrack: "Your site signals trust and security to visitors",
  },
  "Search Visibility": {
    atRisk: "Fewer people can find you in search results",
    onTrack: "Search engines can find and understand your content well",
  },
  "User Experience": {
    atRisk: "Some visitors may struggle or leave quickly",
    onTrack: "Your site loads well and is easy to use",
  },
  "Operational Risk": {
    atRisk: "Small gaps could become bigger problems",
    onTrack: "Your site's technical foundation is solid",
  },
}

function getMaxSeverity(issues: Issue[]): Severity | null {
  if (issues.length === 0) return null
  if (issues.some((i) => i.severity === 'high')) return 'high'
  if (issues.some((i) => i.severity === 'medium')) return 'medium'
  return 'low'
}

function getBorderColor(maxSeverity: Severity | null): string {
  if (maxSeverity === null) return 'border-l-green-400'
  if (maxSeverity === 'low') return 'border-l-amber-400'
  if (maxSeverity === 'medium') return 'border-l-amber-400'
  return 'border-l-red-400'
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
          const borderColor = getBorderColor(maxSeverity)

          // CHG-016: Lead with business impact, not severity
          const impactText =
            categoryIssues.length > 0
              ? CATEGORY_BUSINESS_IMPACT[category.name]?.atRisk ?? 'Areas for improvement'
              : CATEGORY_BUSINESS_IMPACT[category.name]?.onTrack ?? 'Looking good'

          const countText =
            categoryIssues.length === 1
              ? '1 high-confidence finding'
              : categoryIssues.length > 1
                ? `${categoryIssues.length} high-confidence findings`
                : null

          return (
            <div
              key={category.name}
              className={`rounded-lg border border-gray-200 border-l-4 ${borderColor} bg-white p-5 shadow-sm`}
            >
              {/* Category header */}
              <div className="mb-3 flex items-center gap-2">
                <span className="text-gray-400">{category.icon}</span>
                <h3 className="font-bold text-gray-900">{category.name}</h3>
              </div>

              {/* Business impact (leads) */}
              <p className="mb-3 text-base font-medium text-gray-900 leading-snug">{impactText}</p>

              {/* What we observed */}
              {categoryIssues.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    We observed
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {categoryIssues.map((issue, i) => (
                      <li key={i} className="text-sm text-gray-700 leading-relaxed">
                        {issue.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Confidence indicator (subtle) */}
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
