import { useState, useEffect } from 'react'
import type { CompetitorSuggestion } from '../types/api'
import { fetchCompetitorSuggestions } from '../services/api-client'

interface UseCompetitorSuggestionsParams {
  businessType: string
  city: string
  region: string
  country: string
}

interface UseCompetitorSuggestionsResult {
  suggestions: CompetitorSuggestion[]
  loading: boolean
}

export function useCompetitorSuggestions({
  businessType,
  city,
  region,
  country,
}: UseCompetitorSuggestionsParams): UseCompetitorSuggestionsResult {
  const [suggestions, setSuggestions] = useState<CompetitorSuggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchCompetitorSuggestions({
      business_type: businessType,
      city,
      region,
      country,
    })
      .then((response) => {
        if (!cancelled) {
          setSuggestions(response.suggestions)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([])
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [businessType, city, region, country])

  return { suggestions, loading }
}
