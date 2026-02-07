import type { Issue } from '../../types/api'
import { track } from '../../analytics/tracker'

interface SidePanelProps {
  issues: Issue[]
}

export default function SidePanel({ issues }: SidePanelProps) {
  const topActions = issues.slice(0, 5)

  return (
    <aside className="no-print sticky top-4 space-y-4">
      {/* Top Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-900">Top Actions</h3>
        <ol className="space-y-2">
          {topActions.map((issue, i) => (
            <li key={issue.issue_id} className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {i + 1}
              </span>
              <span className="text-sm text-gray-700">{issue.title}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => { track('cta_click', { cta: 'print_report' }); window.print() }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>

        <button
          type="button"
          onClick={() => track('cta_click', { cta: 'need_help' })}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Need help?
        </button>

        <button
          type="button"
          disabled
          onClick={() => track('cta_click', { cta: 'connect_ga_gsc' })}
          className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 shadow-sm"
          title="Coming soon"
        >
          Connect GA/GSC
          <span className="ml-1 text-xs">(Coming soon)</span>
        </button>

        <a
          href="#competitors"
          onClick={() => track('cta_click', { cta: 'compare_competitors' })}
          className="block w-full rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-center text-sm font-medium text-indigo-700 shadow-sm hover:bg-indigo-100"
        >
          Compare against competitors
        </a>
      </div>
    </aside>
  )
}
