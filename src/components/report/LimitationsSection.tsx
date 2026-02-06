import type { LimitationItem } from '../../types/api'

interface LimitationsSectionProps {
  limitations: LimitationItem[]
}

export default function LimitationsSection({ limitations }: LimitationsSectionProps) {
  return (
    <section className="mt-8">
      <h2 className="mb-1 text-xl font-bold text-gray-900">What We Can&apos;t Control</h2>
      <p className="mb-4 text-sm text-gray-500">
        These factors affect outcomes but are outside the scope of this report.
      </p>

      <div className="space-y-3">
        {limitations.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3">
        <h3 className="text-sm font-semibold text-indigo-900">What we can detect quickly</h3>
        <p className="mt-1 text-sm text-indigo-700">
          While we can&apos;t control these factors, regular monitoring can detect their effects
          early. Sudden traffic drops, ranking changes, or performance shifts can signal algorithm
          updates, competitor moves, or seasonal patterns — giving you time to respond before the
          impact grows.
        </p>
      </div>
    </section>
  )
}
