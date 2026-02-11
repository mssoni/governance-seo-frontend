import type { TopImprovement } from '../../types/api'
import { track } from '../../analytics/tracker'

export default function BusinessSidePanel({
  topImprovements,
}: {
  topImprovements: TopImprovement[]
}) {
  return (
    <aside className="no-print sticky top-4 space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-900">Top Improvements</h3>
        <ol className="space-y-2">
          {topImprovements.slice(0, 3).map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {i + 1}
              </span>
              <span className="text-sm text-gray-700">{item.title}</span>
            </li>
          ))}
        </ol>
      </div>

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
      </div>
    </aside>
  )
}
