import type { SummaryItem } from '../../types/api'

interface ExecutiveStoryProps {
  narrative: string
  whatsWorking: SummaryItem[]
  needsAttention: SummaryItem[]
  issueInsights?: string[]
}

export default function ExecutiveStory({
  narrative,
  whatsWorking,
  needsAttention,
  issueInsights,
}: ExecutiveStoryProps) {
  return (
    <section className="rounded-xl bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm ring-1 ring-gray-100">
      {/* Narrative */}
      <p className="text-base leading-relaxed text-gray-700">{narrative}</p>

      {/* CHG-023: Key Findings — personalized issue insights */}
      {issueInsights && issueInsights.length > 0 && (
        <div className="mt-6">
          <h4 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Key Findings
          </h4>
          <ul className="space-y-2">
            {issueInsights.map((insight, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-lg border-l-4 border-l-blue-400 bg-blue-50/50 px-3 py-2"
              >
                <span className="mt-0.5 text-blue-500" aria-hidden="true">
                  &#8226;
                </span>
                <span className="text-sm text-gray-700">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {/* What's working — CHG-020: bulleted list with title + description */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
            What&apos;s working
          </h4>
          <ul className="space-y-3">
            {whatsWorking.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-lg border-l-4 border-l-green-400 bg-green-50/50 px-3 py-2"
              >
                <span className="mt-0.5 text-green-500" aria-hidden="true">
                  &#10003;
                </span>
                <div>
                  <span className="font-semibold text-gray-800">{item.title}</span>
                  {item.description && (
                    <p className="mt-0.5 text-sm text-gray-600">{item.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Needs attention — CHG-020: bulleted list with title + description */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Needs attention
          </h4>
          <ul className="space-y-3">
            {needsAttention.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 rounded-lg border-l-4 border-l-amber-400 bg-amber-50/50 px-3 py-2"
              >
                <span className="mt-0.5 text-amber-500" aria-hidden="true">
                  &#9888;
                </span>
                <div>
                  <span className="font-semibold text-gray-800">{item.title}</span>
                  {item.description && (
                    <p className="mt-0.5 text-sm text-gray-600">{item.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
