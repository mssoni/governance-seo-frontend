import { useSearchParams } from 'react-router-dom'
import { useJobPolling } from '../hooks/useJobPolling'
import ProgressBar from '../components/ProgressBar'
import ReportHeader from '../components/ReportHeader'
import type { GovernanceReport } from '../types/api'

function ReportContent({ report }: { report: GovernanceReport }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">Executive Summary</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-semibold text-green-700">What&apos;s Working</h3>
          <ul className="space-y-2">
            {report.summary.whats_working.map((item, i) => (
              <li key={i} className="rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="font-medium text-green-800">{item.title}</p>
                <p className="mt-1 text-sm text-green-600">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-lg font-semibold text-orange-700">Needs Attention</h3>
          <ul className="space-y-2">
            {report.summary.needs_attention.map((item, i) => (
              <li key={i} className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                <p className="font-medium text-orange-800">{item.title}</p>
                <p className="mt-1 text-sm text-orange-600">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function ReportPage() {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('job')
  const websiteUrl = searchParams.get('url') ?? ''
  const location = searchParams.get('location') ?? ''
  const intent = searchParams.get('intent') ?? ''

  if (!jobId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <p className="text-lg text-gray-600">No job ID provided. Please submit a report first.</p>
      </div>
    )
  }

  return <ReportPageContent jobId={jobId} websiteUrl={websiteUrl} location={location} intent={intent} />
}

function ReportPageContent({
  jobId,
  websiteUrl,
  location,
  intent,
}: {
  jobId: string
  websiteUrl: string
  location: string
  intent: string
}) {
  const { status, progress, currentStep, stepsCompleted, report, error, retry } =
    useJobPolling(jobId)

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mb-2 text-lg font-semibold text-gray-900">Report Generation Failed</h2>
          <p className="mb-6 text-sm text-gray-600">{error}</p>
          <button
            onClick={retry}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  // Complete state — render report
  if (status === 'complete' && report) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <ReportHeader websiteUrl={websiteUrl} location={location} intent={intent} />
          <ReportContent report={report} />
        </div>
      </div>
    )
  }

  // Loading / polling state
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <ProgressBar
        progress={progress}
        currentStep={currentStep}
        stepsCompleted={stepsCompleted}
      />
    </div>
  )
}
