import type { DetectedAs, Confidence } from '../../types/api'

const detectedAsStyles: Record<DetectedAs, string> = {
  observed: 'bg-blue-100 text-blue-800',
  inferred: 'bg-yellow-100 text-yellow-800',
}

const detectedAsLabels: Record<DetectedAs, string> = {
  observed: 'Observed',
  inferred: 'Inferred',
}

const confidenceStyles: Record<Confidence, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-orange-100 text-orange-800',
  low: 'bg-green-100 text-green-800',
}

const confidenceLabels: Record<Confidence, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export function DetectedAsBadge({ detectedAs }: { detectedAs: DetectedAs }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${detectedAsStyles[detectedAs]}`}
    >
      {detectedAsLabels[detectedAs]}
    </span>
  )
}

export function ConfidenceChip({ confidence }: { confidence: Confidence }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${confidenceStyles[confidence]}`}
    >
      {confidenceLabels[confidence]}
    </span>
  )
}
