import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import TrustIndicators from '../components/TrustIndicators'
import InputForm from '../components/InputForm'
import { apiClient, ApiError } from '../services/api-client'
import { track } from '../analytics/tracker'
import type { GovernanceReportRequest, JobCreateResponse } from '../types/api'

interface SubmissionError {
  message: string
  isNetworkError: boolean
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<SubmissionError | null>(null)
  const [lastPayload, setLastPayload] = useState<GovernanceReportRequest | null>(null)

  const submitReport = useCallback(async (data: GovernanceReportRequest) => {
    setIsLoading(true)
    setError(null)
    setLastPayload(data)

    track('report_generation_start', { url: data.website_url })

    try {
      const response = await apiClient.post<JobCreateResponse>(
        '/api/report/governance',
        data,
      )
      const params = new URLSearchParams({
        job: response.job_id,
        url: data.website_url,
        location: `${data.location.city},${data.location.region},${data.location.country}`,
        business_type: data.business_type,
        intent: data.intent,
      })
      navigate(`/report?${params.toString()}`)
    } catch (err) {
      if (err instanceof ApiError) {
        track('report_generation_failed', { error_type: 'api_error', status: err.status })
        setError({
          message: err.body || `Request failed (${err.status})`,
          isNetworkError: false,
        })
      } else {
        track('report_generation_failed', { error_type: 'network_error' })
        setError({
          message: 'Network error. Please check your connection and try again.',
          isNetworkError: true,
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  const handleRetry = useCallback(async () => {
    if (lastPayload) {
      await submitReport(lastPayload)
    }
  }, [lastPayload, submitReport])

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
