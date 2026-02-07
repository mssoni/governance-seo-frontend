import type { SummaryItem } from '../../types/api'

interface ExecutiveStoryProps {
  narrative: string
  whatsWorking: SummaryItem[]
  needsAttention: SummaryItem[]
}

export default function ExecutiveStory({
  narrative,
  whatsWorking,
  needsAttention,
}: ExecutiveStoryProps) {
  return (
    <section className="rounded-xl bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm ring-1 ring-gray-100">
      {/* Narrative */}
      <p className="text-base leading-relaxed text-gray-700">{narrative}</p>

      <div className="mt-6 space-y-4">
        {/* What's working */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
            What&apos;s working
          </h4>
          <div className="flex flex-wrap gap-2">
            {whatsWorking.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-200"
              >
                {item.title}
              </span>
            ))}
          </div>
        </div>

        {/* Needs attention */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Needs attention
          </h4>
          <div className="flex flex-wrap gap-2">
            {needsAttention.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-200"
              >
                {item.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
