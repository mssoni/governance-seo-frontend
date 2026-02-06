import { useState } from 'react'
import type { WeekPlan, WeekAction } from '../../types/api'

// --- Sub-components ---

function ActionCard({ action }: { action: WeekAction }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <h4 className="text-sm font-semibold text-gray-900">{action.action}</h4>

      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="font-medium text-gray-500">Why</dt>
          <dd className="mt-0.5 text-gray-700">{action.why}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Signal Strengthened</dt>
          <dd className="mt-0.5">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
              {action.signal_strengthened}
            </span>
          </dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Estimated Impact</dt>
          <dd className="mt-0.5 text-gray-700">{action.estimated_impact}</dd>
        </div>
        <div>
          <dt className="font-medium text-gray-500">Verification Method</dt>
          <dd className="mt-0.5 text-gray-700">{action.verification_method}</dd>
        </div>
      </dl>
    </div>
  )
}

function WeekSection({ weekPlan, defaultOpen }: { weekPlan: WeekPlan; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={`Week ${weekPlan.week}: ${weekPlan.theme}`}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
            {weekPlan.week}
          </span>
          <div>
            <span className="text-sm font-bold text-gray-900">Week {weekPlan.week}</span>
            <span className="ml-2 text-sm text-gray-500">{weekPlan.theme}</span>
          </div>
        </div>
        <svg
          className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="space-y-3 border-t border-gray-100 px-5 py-4">
          {weekPlan.actions.map((action) => (
            <ActionCard key={action.action} action={action} />
          ))}
        </div>
      )}
    </div>
  )
}

// --- Main component ---

interface SEOActionPlanProps {
  plan: WeekPlan[]
}

export default function SEOActionPlan({ plan }: SEOActionPlanProps) {
  return (
    <section aria-label="30-day SEO action plan" className="mt-8">
      {/* Disclaimer banner */}
      <div
        role="alert"
        className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        <div className="flex items-start gap-2">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p>
            <strong>Disclaimer:</strong> We do not guarantee rankings. SEO outcomes depend on many
            factors outside our control. The actions below are recommendations based on observed data
            and may take weeks or months to show measurable impact.
          </p>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold text-gray-900">30-Day Action Plan</h2>

      <div className="space-y-3">
        {plan.map((weekPlan) => (
          <WeekSection
            key={weekPlan.week}
            weekPlan={weekPlan}
            defaultOpen={weekPlan.week === 1}
          />
        ))}
      </div>
    </section>
  )
}
