import { useState, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useJobPolling } from '../hooks/useJobPolling'
import { useSeoJobPolling } from '../hooks/useSeoJobPolling'
import { useCompetitorSuggestions } from '../hooks/useCompetitorSuggestions'
import { apiClient } from '../services/api-client'
import { track } from '../analytics/tracker'
import ProgressBar from '../components/ProgressBar'
import ReportHeader from '../components/ReportHeader'
import ExecutiveSummary from '../components/report/ExecutiveSummary'
import MetricsCards from '../components/report/MetricsCards'
import IssuesList from '../components/report/IssuesList'
import ChecklistSection from '../components/report/ChecklistSection'
import LimitationsSection from '../components/report/LimitationsSection'
import SidePanel from '../components/report/SidePanel'
import ReportTabs from '../components/report/ReportTabs'
import type { TabId } from '../components/report/ReportTabs'
import CompetitorForm from '../components/CompetitorForm'
import CompetitorTable from '../components/report/CompetitorTable'
import StrengthsGaps from '../components/report/StrengthsGaps'
import SEOActionPlan from '../components/report/SEOActionPlan'
import ExecutiveStory from '../components/report/ExecutiveStory'
import BusinessImpactCategories from '../components/report/BusinessImpactCategories'
import TopImprovements from '../components/report/TopImprovements'
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

// --- Business Overview Content ---

function BusinessContent({
  report,
  onSwitchToTechnical,
}: {
  report: GovernanceReport
  onSwitchToTechnical: () => void
}) {
  return (
    <>
      <ExecutiveStory
        narrative={report.summary.executive_narrative}
        whatsWorking={report.summary.whats_working}
        needsAttention={report.summary.needs_attention}
      />
      <BusinessImpactCategories issues={report.issues} />
      <TopImprovements
        improvements={report.top_improvements}
        onSwitchToTechnical={onSwitchToTechnical}
      />
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
  const [activeTab, setActiveTab] = useState<TabId>('business')
  const [seoJobId, setSeoJobId] = useState<string | null>(null)
  const [seoSubmitError, setSeoSubmitError] = useState<string | undefined>(undefined)
  const [seoSubmitting, setSeoSubmitting] = useState(false)

  const seoPolling = useSeoJobPolling(seoJobId)

  // Track tab switches
  const handleTabChange = useCallback((tab: TabId) => {
    track('tab_switch', { tab })
    setActiveTab(tab)
  }, [])

  // --- Track governance report lifecycle ---
  const reportStartTime = useRef<number>(Date.now())
  const prevStatus = useRef(status)

  useEffect(() => {
    if (prevStatus.current !== status) {
      if (status === 'complete' && report) {
        track('report_generation_complete', {
          duration_ms: Date.now() - reportStartTime.current,
        })
      } else if (status === 'failed' || error) {
        track('report_generation_failed', { error_type: 'polling_error' })
      }
      prevStatus.current = status
    }
  }, [status, report, error])

  // Auto-switch to SEO tab when SEO report completes
  const prevSeoStatus = useRef(seoPolling.status)
  useEffect(() => {
    if (prevSeoStatus.current !== 'complete' && seoPolling.status === 'complete' && seoPolling.seoReport) {
      track('seo_report_complete')
      setActiveTab('seo')
    }
    prevSeoStatus.current = seoPolling.status
  }, [seoPolling.status, seoPolling.seoReport])

  // --- Competitor form submission ---
  const handleCompetitorSubmit = useCallback(
    async (data: SEOReportRequest) => {
      setSeoSubmitError(undefined)
      setSeoSubmitting(true)
      track('seo_report_start', { competitors: data.competitors.length })
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

  // SEO tab is always accessible (competitor form lives there)
  const seoEnabled = true
  const parsedLocation = parseLocation(location)
  const intentValue = (intent || 'both') as Intent

  // Competitor suggestions (fetched at page level, passed as props to CompetitorForm)
  const { suggestions: competitorSuggestions, loading: suggestionsLoading } =
    useCompetitorSuggestions({
      businessType,
      city: parsedLocation.city,
      region: parsedLocation.region,
      country: parsedLocation.country,
    })

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

          {/* Pages analyzed indicator */}
          <p className="mb-2 text-sm text-gray-500">
            Based on analysis of {report.pages_analyzed} most important pages
          </p>

          {/* Full report CTA banner */}
          <div
            data-testid="full-report-cta"
            className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800"
          >
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              This report covers your {report.pages_analyzed} most important pages.{' '}
              For a comprehensive full-site audit, reach out to us.
            </p>
          </div>

          <ReportTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            seoEnabled={seoEnabled}
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
              <div className="min-w-0">
                {activeTab === 'business' && (
                  <BusinessContent
                    report={report}
                    onSwitchToTechnical={() => setActiveTab('technical')}
                  />
                )}

                {activeTab === 'technical' && (
                  <GovernanceContent report={report} />
                )}

                {activeTab === 'seo' && (
                  <>
                    {/* SEO report complete — show results */}
                    {seoPolling.seoReport && (
                      <SEOContent report={seoPolling.seoReport} />
                    )}

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

                    {/* CompetitorForm — show when no SEO job and no SEO report */}
                    {!seoJobId && !seoPolling.seoReport && (
                      <CompetitorForm
                        websiteUrl={websiteUrl}
                        location={parsedLocation}
                        businessType={businessType}
                        intent={intentValue}
                        onSubmit={handleCompetitorSubmit}
                        isLoading={seoSubmitting}
                        error={seoSubmitError}
                        suggestions={competitorSuggestions}
                        suggestionsLoading={suggestionsLoading}
                      />
                    )}
                  </>
                )}
              </div>

              <div className="hidden lg:block">
                <SidePanel
                  issues={report.issues}
                  topImprovements={report.top_improvements}
                  activeTab={activeTab}
                />
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
