import type { TopImprovement, Effort } from '../../types/api'

interface TopImprovementsProps {
  improvements: TopImprovement[]
  onSwitchToTechnical?: () => void
}

const effortLabels: Record<Effort, string> = {
  S: 'Small',
  M: 'Medium',
  L: 'Large',
}

const effortColors: Record<Effort, string> = {
  S: 'bg-green-50 text-green-700 ring-green-200',
  M: 'bg-amber-50 text-amber-700 ring-amber-200',
  L: 'bg-red-50 text-red-700 ring-red-200',
}

export default function TopImprovements({
  improvements,
  onSwitchToTechnical,
}: TopImprovementsProps) {
  return (
    <section className="mt-8">
      <h2 className="mb-1 text-xl font-bold text-gray-900">Top Improvements</h2>
      <p className="mb-6 text-sm text-gray-500">
        Focus on these first for the biggest impact
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {improvements.map((item, i) => (
          <div
            key={i}
            className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            {/* Numbered circle */}
            <div className="mb-3 flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {i + 1}
              </span>
              <h3 className="font-bold text-gray-900">{item.title}</h3>
            </div>

            {/* Description */}
            <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-600">
              {item.description}
            </p>

            {/* Bottom row: effort badge + category pill */}
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${effortColors[item.effort]}`}
              >
                {effortLabels[item.effort]}
              </span>
              <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                {item.category}
              </span>
            </div>

            {/* CTA link */}
            <a
              href="#contact"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              We can help with this &rarr;
            </a>
          </div>
        ))}
      </div>

      {/* Link to full checklist */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToTechnical}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View full 30-day checklist in Technical Details &rarr;
        </button>
      </div>
    </section>
  )
}
