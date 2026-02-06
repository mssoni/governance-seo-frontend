import { useReducer, useEffect, useCallback, useRef } from 'react'
import { apiClient } from '../services/api-client'
import type { JobStatusResponse, SEOReport, JobStatus } from '../types/api'

const POLL_INTERVAL_MS = 2500

interface SeoPollingState {
  status: JobStatus | null
  progress: number
  currentStep: string | null
  stepsCompleted: string[]
  seoReport: SEOReport | null
  error: string | null
  retryCount: number
}

type SeoPollingAction =
  | { type: 'RESET' }
  | { type: 'POLL_SUCCESS'; response: JobStatusResponse }
  | { type: 'POLL_ERROR'; message: string }
  | { type: 'RETRY' }

const initialState: SeoPollingState = {
  status: null,
  progress: 0,
  currentStep: null,
  stepsCompleted: [],
  seoReport: null,
  error: null,
  retryCount: 0,
}

function reducer(state: SeoPollingState, action: SeoPollingAction): SeoPollingState {
  switch (action.type) {
    case 'RESET':
      return { ...initialState, retryCount: state.retryCount }
    case 'POLL_SUCCESS':
      return {
        ...state,
        status: action.response.status,
        progress: action.response.progress,
        currentStep: action.response.current_step,
        stepsCompleted: action.response.steps_completed,
        seoReport: action.response.status === 'complete' ? action.response.seo_report : null,
        error: action.response.status === 'failed'
          ? (action.response.error ?? 'An unknown error occurred')
          : null,
      }
    case 'POLL_ERROR':
      return { ...state, error: action.message }
    case 'RETRY':
      return { ...initialState, retryCount: state.retryCount + 1 }
    default:
      return state
  }
}

export interface UseSeoJobPollingResult {
  status: JobStatus | null
  progress: number
  currentStep: string | null
  stepsCompleted: string[]
  seoReport: SEOReport | null
  error: string | null
  retry: () => void
}

/**
 * Polls for SEO report completion. Only active when jobId is non-null.
 */
export function useSeoJobPolling(jobId: string | null): UseSeoJobPollingResult {
  const [state, dispatch] = useReducer(reducer, initialState)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!jobId) return

    let active = true

    async function poll() {
      try {
        const response = await apiClient.get<JobStatusResponse>(
          `/api/report/status/${jobId}`,
        )
        if (!active) return
        dispatch({ type: 'POLL_SUCCESS', response })
        if (response.status === 'complete' || response.status === 'failed') {
          stopPolling()
        }
      } catch (err) {
        if (!active) return
        const message = err instanceof Error ? err.message : 'Failed to fetch report status'
        dispatch({ type: 'POLL_ERROR', message })
        stopPolling()
      }
    }

    dispatch({ type: 'RESET' })
    void poll()

    intervalRef.current = setInterval(() => {
      void poll()
    }, POLL_INTERVAL_MS)

    return () => {
      active = false
      stopPolling()
    }
  }, [jobId, state.retryCount, stopPolling])

  const retry = useCallback(() => {
    dispatch({ type: 'RETRY' })
  }, [])

  return {
    status: state.status,
    progress: state.progress,
    currentStep: state.currentStep,
    stepsCompleted: state.stepsCompleted,
    seoReport: state.seoReport,
    error: state.error,
    retry,
  }
}
