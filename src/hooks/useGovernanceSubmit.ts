import { useState, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../services/api-client'
import { track } from '../analytics/tracker'
import type { GovernanceReportRequest, JobCreateResponse } from '../types/api'

interface SubmissionError {
  message: string
  isNetworkError: boolean
}

export function useGovernanceSubmit() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<SubmissionError | null>(null)
  const lastPayloadRef = useRef<GovernanceReportRequest | null>(null)

  const submit = useCallback(async (data: GovernanceReportRequest): Promise<string | null> => {
    setIsLoading(true)
    setError(null)
    lastPayloadRef.current = data

    track('report_generation_start', { url: data.website_url })

    try {
      const response = await apiClient.post<JobCreateResponse>(
        '/api/report/governance',
        data,
      )
      return response.job_id
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
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const retry = useCallback(async (): Promise<string | null> => {
    if (lastPayloadRef.current) {
      return submit(lastPayloadRef.current)
    }
    return null
  }, [submit])

  return { submit, retry, isLoading, error }
}
