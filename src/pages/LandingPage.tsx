import { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import TrustIndicators from '../components/TrustIndicators'
import InputForm from '../components/InputForm'
import { useGovernanceSubmit } from '../hooks/useGovernanceSubmit'
import type { GovernanceReportRequest } from '../types/api'

function navigateToReport(
  navigate: ReturnType<typeof useNavigate>,
  jobId: string,
  data: GovernanceReportRequest,
) {
  const params = new URLSearchParams({
    job: jobId,
    url: data.website_url,
    location: `${data.location.city},${data.location.region},${data.location.country}`,
    business_type: data.business_type,
    intent: data.intent,
  })
  navigate(`/report?${params.toString()}`)
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { submit, retry, isLoading, error } = useGovernanceSubmit()
  const lastPayloadRef = useRef<GovernanceReportRequest | null>(null)

  const submitReport = useCallback(async (data: GovernanceReportRequest) => {
    lastPayloadRef.current = data
    const jobId = await submit(data)
    if (jobId) {
      navigateToReport(navigate, jobId, data)
    }
  }, [submit, navigate])

  const handleRetry = useCallback(async () => {
    const jobId = await retry()
    if (jobId && lastPayloadRef.current) {
      navigateToReport(navigate, jobId, lastPayloadRef.current)
    }
  }, [retry, navigate])

  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <TrustIndicators />

      <section id="report-form" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Generate Your Report
        </h2>
        <p className="mt-2 mb-8 text-gray-600">
          Fill in the details below to get your governance report.
        </p>
        <InputForm onSubmit={submitReport} isLoading={isLoading} />

        {error && (
          <div role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error.message}</p>
            {error.isNetworkError && (
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Retry
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
