import { useSearchParams } from 'react-router-dom'
import { useJobPolling } from '../hooks/useJobPolling'
import ProgressBar from '../components/ProgressBar'
import ReportHeader from '../components/ReportHeader'
import ExecutiveSummary from '../components/report/ExecutiveSummary'
import MetricsCards from '../components/report/MetricsCards'
import IssuesList from '../components/report/IssuesList'
import ChecklistSection from '../components/report/ChecklistSection'
import type { GovernanceReport } from '../types/api'

function ReportContent({ report }: { report: GovernanceReport }) {
  return (
    <div>
      <ExecutiveSummary summary={report.summary} />
      <MetricsCards metrics={report.metrics} />
      <IssuesList issues={report.issues} />
      <ChecklistSection items={report.checklist_30d} />
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
