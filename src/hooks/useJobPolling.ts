import { useReducer, useEffect, useCallback, useRef } from 'react'
import { apiClient } from '../services/api-client'
import type { JobStatusResponse, GovernanceReport, JobStatus } from '../types/api'

const POLL_INTERVAL_MS = 2500

interface PollingState {
  status: JobStatus | null
  progress: number
  currentStep: string | null
  stepsCompleted: string[]
  report: GovernanceReport | null
  error: string | null
  retryCount: number
}

type PollingAction =
  | { type: 'RESET' }
  | { type: 'POLL_SUCCESS'; response: JobStatusResponse }
  | { type: 'POLL_ERROR'; message: string }
  | { type: 'RETRY' }

const initialState: PollingState = {
  status: null,
  progress: 0,
  currentStep: null,
  stepsCompleted: [],
  report: null,
  error: null,
  retryCount: 0,
}

function reducer(state: PollingState, action: PollingAction): PollingState {
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
        report: action.response.status === 'complete' ? action.response.governance_report : null,
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

interface UseJobPollingResult {
  status: JobStatus | null
  progress: number
  currentStep: string | null
  stepsCompleted: string[]
  report: GovernanceReport | null
  error: string | null
  retry: () => void
}

export function useJobPolling(jobId: string): UseJobPollingResult {
  const [state, dispatch] = useReducer(reducer, initialState)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
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

    // Fire immediately, then poll on interval
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
    report: state.report,
    error: state.error,
    retry,
  }
}
