import { useState, useCallback } from 'react'
import { apiClient } from '../services/api-client'
import { track } from '../analytics/tracker'
import type { SEOReportRequest, JobCreateResponse } from '../types/api'

export function useSeoSubmit() {
  const [seoJobId, setSeoJobId] = useState<string | null>(null)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = useCallback(async (data: SEOReportRequest) => {
    setError(undefined)
    setIsSubmitting(true)
    track('seo_report_start', { competitors: data.competitors.length })
    try {
      const response = await apiClient.post<JobCreateResponse>('/api/report/seo', data)
      setSeoJobId(response.job_id)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start SEO analysis'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  return { submit, seoJobId, isSubmitting, error }
}
