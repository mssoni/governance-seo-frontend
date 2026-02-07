import { useState, useEffect } from 'react'
import type { CompetitorSuggestion } from '../types/api'
import { fetchCompetitorSuggestions } from '../services/api-client'

interface UseCompetitorSuggestionsParams {
  businessType: string
  city: string
  region: string
  country: string
  websiteUrl?: string
}

interface UseCompetitorSuggestionsResult {
  suggestions: CompetitorSuggestion[]
  userPlace: CompetitorSuggestion | null
  loading: boolean
}

export function useCompetitorSuggestions({
  businessType,
  city,
  region,
  country,
  websiteUrl,
}: UseCompetitorSuggestionsParams): UseCompetitorSuggestionsResult {
  const [suggestions, setSuggestions] = useState<CompetitorSuggestion[]>([])
  const [userPlace, setUserPlace] = useState<CompetitorSuggestion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchCompetitorSuggestions({
      business_type: businessType,
      city,
      region,
      country,
      website_url: websiteUrl,
    })
      .then((response) => {
        if (!cancelled) {
          setSuggestions(response.suggestions)
          setUserPlace(response.user_place)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([])
          setUserPlace(null)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [businessType, city, region, country, websiteUrl])

  return { suggestions, userPlace, loading }
}
