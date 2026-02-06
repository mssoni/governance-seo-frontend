import { useState, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useJobPolling } from '../hooks/useJobPolling'
import { useSeoJobPolling } from '../hooks/useSeoJobPolling'
import { apiClient } from '../services/api-client'
import ProgressBar from '../components/ProgressBar'
import ReportHeader from '../components/ReportHeader'
import ExecutiveSummary from '../components/report/ExecutiveSummary'
import MetricsCards from '../components/report/MetricsCards'
import IssuesList from '../components/report/IssuesList'
import ChecklistSection from '../components/report/ChecklistSection'
import LimitationsSection from '../components/report/LimitationsSection'
import SidePanel from '../components/report/SidePanel'
import ReportTabs from '../components/report/ReportTabs'
import CompetitorForm from '../components/CompetitorForm'
import CompetitorTable from '../components/report/CompetitorTable'
import StrengthsGaps from '../components/report/StrengthsGaps'
import SEOActionPlan from '../components/report/SEOActionPlan'
import type {
  GovernanceReport,
  SEOReport,
  SEOReportRequest,
  JobCreateResponse,
  Location,
  BusinessType,
  Intent,
} from '../types/api'

// --- Governance Report Content ---

function GovernanceContent({ report }: { report: GovernanceReport }) {
  return (
    <>
      <ExecutiveSummary summary={report.summary} />
      <MetricsCards metrics={report.metrics} />
      <IssuesList issues={report.issues} />
      <ChecklistSection items={report.checklist_30d} />
      <LimitationsSection limitations={report.limitations} />
    </>
  )
}

// --- SEO Report Content ---

function SEOContent({ report }: { report: SEOReport }) {
  const userRow = report.competitor_table[0]
  const competitors = report.competitor_table.slice(1)

  return (
    <>
      <CompetitorTable userRow={userRow} competitors={competitors} />
      <StrengthsGaps
        competitorAdvantages={report.competitor_advantages}
        userStrengths={report.user_strengths}
        gaps={report.gaps}
      />
      <SEOActionPlan plan={report.plan_30d} />
    </>
  )
}

// --- SEO Polling Progress Indicator ---

function SEOPollingProgress({
  progress,
  currentStep,
  stepsCompleted,
}: {
  progress: number
  currentStep: string | null
  stepsCompleted: string[]
}) {
  return (
    <div className="mt-8 rounded-lg border border-indigo-100 bg-indigo-50/50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Generating SEO Report...
      </h3>
      <ProgressBar
        progress={progress}
        currentStep={currentStep}
        stepsCompleted={stepsCompleted}
      />
    </div>
  )
}

// --- Helper to parse location string ---

function parseLocation(locationStr: string): Location {
  const parts = locationStr.split(',').map((s) => s.trim())
  return {
    city: parts[0] ?? '',
    region: parts[1] ?? '',
    country: parts[2] ?? '',
  }
}

// --- Main export ---

export default function ReportPage() {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('job')
  const websiteUrl = searchParams.get('url') ?? ''
  const location = searchParams.get('location') ?? ''
  const intent = searchParams.get('intent') ?? ''
  const businessType = (searchParams.get('business_type') ?? 'professional_services') as BusinessType

  if (!jobId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <p className="text-lg text-gray-600">No job ID provided. Please submit a report first.</p>
      </div>
    )
  }

  return (
    <ReportPageContent
      jobId={jobId}
      websiteUrl={websiteUrl}
      location={location}
      intent={intent}
      businessType={businessType}
    />
  )
}

function ReportPageContent({
  jobId,
  websiteUrl,
  location,
  intent,
  businessType,
}: {
  jobId: string
  websiteUrl: string
  location: string
  intent: string
  businessType: BusinessType
}) {
  const { status, progress, currentStep, stepsCompleted, report, error, retry } =
    useJobPolling(jobId)

  // --- SEO state ---
  const [activeTab, setActiveTab] = useState<'governance' | 'seo'>('governance')
  const [seoJobId, setSeoJobId] = useState<string | null>(null)
  const [seoSubmitError, setSeoSubmitError] = useState<string | undefined>(undefined)
  const [seoSubmitting, setSeoSubmitting] = useState(false)

  const seoPolling = useSeoJobPolling(seoJobId)

  // Auto-switch to SEO tab when SEO report completes
  const prevSeoStatus = useRef(seoPolling.status)
  useEffect(() => {
    if (prevSeoStatus.current !== 'complete' && seoPolling.status === 'complete' && seoPolling.seoReport) {
      setActiveTab('seo')
    }
    prevSeoStatus.current = seoPolling.status
  }, [seoPolling.status, seoPolling.seoReport])

  // --- Competitor form submission ---
  const handleCompetitorSubmit = useCallback(
    async (data: SEOReportRequest) => {
      setSeoSubmitError(undefined)
      setSeoSubmitting(true)
      try {
        const response = await apiClient.post<JobCreateResponse>('/api/report/seo', data)
        setSeoJobId(response.job_id)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to start SEO analysis'
        setSeoSubmitError(message)
      } finally {
        setSeoSubmitting(false)
      }
    },
    [],
  )

  const seoEnabled = seoPolling.seoReport !== null
  const parsedLocation = parseLocation(location)
  const intentValue = (intent || 'both') as Intent

  // --- Error state (governance) ---
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div role="alert" className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
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

  // --- Complete state — render report with tabs ---
  if (status === 'complete' && report) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <ReportHeader websiteUrl={websiteUrl} location={location} intent={intent} />

          <ReportTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            seoEnabled={seoEnabled}
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
              <div className="min-w-0">
                {activeTab === 'governance' && (
                  <>
                    <GovernanceContent report={report} />

                    {/* SEO polling in progress indicator */}
                    {seoJobId && !seoPolling.seoReport && seoPolling.status !== 'failed' && (
                      <SEOPollingProgress
                        progress={seoPolling.progress}
                        currentStep={seoPolling.currentStep}
                        stepsCompleted={seoPolling.stepsCompleted}
                      />
                    )}

                    {/* SEO polling error */}
                    {seoPolling.error && (
                      <div
                        role="alert"
                        className="mt-8 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                      >
                        SEO analysis failed: {seoPolling.error}
                      </div>
                    )}

                    {/* CompetitorForm CTA — show when no SEO job is running */}
                    {!seoJobId && (
                      <CompetitorForm
                        websiteUrl={websiteUrl}
                        location={parsedLocation}
                        businessType={businessType}
                        intent={intentValue}
                        onSubmit={handleCompetitorSubmit}
                        isLoading={seoSubmitting}
                        error={seoSubmitError}
                      />
                    )}
                  </>
                )}

                {activeTab === 'seo' && seoPolling.seoReport && (
                  <SEOContent report={seoPolling.seoReport} />
                )}
              </div>

              <div className="hidden lg:block">
                <SidePanel issues={report.issues} />
              </div>
            </div>
          </ReportTabs>
        </div>
      </div>
    )
  }

  // --- Loading / polling state ---
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
