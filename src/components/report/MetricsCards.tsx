import type { MetricCard } from '../../types/api'
import EvidencePanel from './EvidencePanel'

function MetricCardItem({ metric }: { metric: MetricCard }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {metric.name}
      </h3>
      <p className="mb-2 text-2xl font-bold text-gray-900">{metric.value}</p>
      <p className="mb-3 text-sm text-gray-600">{metric.meaning}</p>

      <div className="mb-2 rounded-md bg-indigo-50 px-3 py-2">
        <p className="text-xs font-medium text-indigo-700">Why it matters</p>
        <p className="text-sm text-indigo-600">{metric.why_it_matters}</p>
      </div>

      <EvidencePanel evidence={metric.evidence} />
    </div>
  )
}

interface MetricsCardsProps {
  metrics: MetricCard[]
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <section className="mt-8">
      <h2 className="mb-6 text-xl font-bold text-gray-900">Metrics</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {metrics.map((metric, i) => (
          <MetricCardItem key={i} metric={metric} />
        ))}
      </div>
    </section>
  )
}
