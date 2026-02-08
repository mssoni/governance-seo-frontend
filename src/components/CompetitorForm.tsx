import { useState, useCallback } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import type {
  SEOReportRequest,
  Location,
  BusinessType,
  Intent,
  CompetitorSuggestion,
} from '../types/api'

// --- Validation (same as InputForm) ---

function isValidUrl(value: string): boolean {
  if (/^https?:\/\//i.test(value)) {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }
  // Allow bare domains like "example.com"
  if (/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+/.test(value)) {
    return true
  }
  return false
}

// --- Props ---

interface CompetitorFormProps {
  websiteUrl: string
  location: Location
  businessType: BusinessType
  intent: Intent
  onSubmit: (data: SEOReportRequest) => Promise<void>
  isLoading: boolean
  error?: string
  suggestions?: CompetitorSuggestion[]
  suggestionsLoading?: boolean
  userPlace?: CompetitorSuggestion | null
}

// --- Component ---

export default function CompetitorForm({
  websiteUrl,
  location,
  businessType,
  intent,
  onSubmit,
  isLoading,
  error,
  suggestions = [],
  suggestionsLoading = false,
  userPlace,
}: CompetitorFormProps) {
  const [competitors, setCompetitors] = useState<[string, string, string]>(['', '', ''])
  const [errors, setErrors] = useState<[string?, string?, string?]>([])
  const [touched, setTouched] = useState<[boolean, boolean, boolean]>([false, false, false])
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set())
  const [noWebsiteMessage, setNoWebsiteMessage] = useState<string | null>(null)

  const validateCompetitor = useCallback(
    (index: number, value: string): string | undefined => {
      const trimmed = value.trim()
      // Fields 0 and 1 are required, field 2 is optional
      if (index < 2 && !trimmed) {
        return 'Competitor URL is required'
      }
      if (trimmed && !isValidUrl(trimmed)) {
        return 'Please enter a valid URL (e.g. https://example.com)'
      }
      return undefined
    },
    [],
  )

  const handleChange = useCallback(
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setCompetitors((prev) => {
        const next = [...prev] as [string, string, string]
        next[index] = value
        return next
      })

      if (touched[index]) {
        const err = validateCompetitor(index, value)
        setErrors((prev) => {
          const next = [...prev] as [string?, string?, string?]
          next[index] = err
          return next
        })
      }
    },
    [touched, validateCompetitor],
  )

  const handleBlur = useCallback(
    (index: number) => () => {
      setTouched((prev) => {
        const next = [...prev] as [boolean, boolean, boolean]
        next[index] = true
        return next
      })
      const err = validateCompetitor(index, competitors[index])
      setErrors((prev) => {
        const next = [...prev] as [string?, string?, string?]
        next[index] = err
        return next
      })
    },
    [competitors, validateCompetitor],
  )

  const isFormValid = useCallback((): boolean => {
    // At least 2 valid competitor URLs required
    const validUrls = competitors.filter((url, idx) => {
      const trimmed = url.trim()
      if (!trimmed) return false
      if (!isValidUrl(trimmed)) return false
      // Also check no validation error
      const err = validateCompetitor(idx, url)
      return err === undefined
    })
    return validUrls.length >= 2
  }, [competitors, validateCompetitor])

  const handleSuggestionClick = useCallback(
    (suggestion: CompetitorSuggestion) => {
      // Clear any previous no-website message
      setNoWebsiteMessage(null)

      if (!suggestion.website_url) {
        setNoWebsiteMessage(`"${suggestion.name}" has no website listed on Google.`)
        return
      }

      // Find the first empty competitor field
      const emptyIndex = competitors.findIndex((url) => url.trim() === '')
      if (emptyIndex === -1) {
        // All fields are filled — do nothing
        return
      }

      // Fill the empty field with the suggestion's website URL
      setCompetitors((prev) => {
        const next = [...prev] as [string, string, string]
        next[emptyIndex] = suggestion.website_url!
        return next
      })

      // Mark the field as touched and clear its error
      setTouched((prev) => {
        const next = [...prev] as [boolean, boolean, boolean]
        next[emptyIndex] = true
        return next
      })
      setErrors((prev) => {
        const next = [...prev] as [string?, string?, string?]
        next[emptyIndex] = undefined
        return next
      })

      // Track this suggestion as selected
      const key = `${suggestion.name}-${suggestion.address}`
      setSelectedSuggestions((prev) => new Set(prev).add(key))
    },
    [competitors],
  )

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()

      // Validate all required fields
      const newErrors: [string?, string?, string?] = [
        validateCompetitor(0, competitors[0]),
        validateCompetitor(1, competitors[1]),
        validateCompetitor(2, competitors[2]),
      ]

      const hasError = newErrors.some((e) => e !== undefined)
      if (hasError) {
        setErrors(newErrors)
        setTouched([true, true, true])
        return
      }

      // Build competitors array (filter out empty optional field)
      const competitorUrls = competitors
        .map((url) => url.trim())
        .filter((url) => url.length > 0)

      const payload: SEOReportRequest = {
        website_url: websiteUrl,
        location,
        business_type: businessType,
        intent,
        competitors: competitorUrls,
      }

      await onSubmit(payload)
    },
    [competitors, websiteUrl, location, businessType, intent, onSubmit, validateCompetitor],
  )

  const inputClasses = (index: number) =>
    `mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm ${
      errors[index] && touched[index]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300'
    }`

  const labels = ['Competitor 1 URL', 'Competitor 2 URL', 'Competitor 3 URL (optional)']
  const placeholders = [
    'https://competitor-one.com',
    'https://competitor-two.com',
    'https://competitor-three.com',
  ]

  return (
    <section
      id="competitors"
      className="mt-8 rounded-lg border border-indigo-100 bg-indigo-50/50 p-6"
      aria-label="Competitor comparison form"
    >
      <h2 className="mb-2 text-xl font-bold text-gray-900">
        Compare Against Competitors
      </h2>
      <p className="mb-6 text-sm text-gray-600">
        Enter competitor URLs to generate a Local Competitive SEO Report. At least 2 competitors are required.
      </p>

      {/* --- Your Google Review Card --- */}
      {userPlace && (
        <div
          data-testid="user-review-card"
          className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4"
        >
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-green-700">
            Your Google Business Profile
          </p>
          <p className="text-lg font-bold text-gray-900">{userPlace.name}</p>
          <p className="mt-1 text-sm text-gray-600">{userPlace.address}</p>
          {userPlace.rating != null && userPlace.review_count != null && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-lg font-semibold text-amber-600">
                {userPlace.rating} ★
              </span>
              <span className="text-sm text-gray-500">
                ({userPlace.review_count.toLocaleString()} reviews)
              </span>
            </div>
          )}
        </div>
      )}

      {/* --- Competitor Suggestions Section --- */}
      {suggestionsLoading && (
        <p className="mb-4 text-sm text-gray-500 italic">
          Finding nearby competitors...
        </p>
      )}

      {!suggestionsLoading && suggestions.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-gray-600">
            Nearby competitors in your area — click to add as competitor
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((suggestion, idx) => {
              const key = `${suggestion.name}-${suggestion.address}`
              const isSelected = selectedSuggestions.has(key)
              return (
                <button
                  type="button"
                  key={key}
                  data-testid={`suggestion-card-${idx}`}
                  data-selected={isSelected ? 'true' : 'false'}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`cursor-pointer rounded-lg border p-3 text-left shadow-sm transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-50 ring-1 ring-indigo-300'
                      : 'border-gray-200 bg-white hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-gray-900">{suggestion.name}</p>
                    {isSelected && (
                      <span className="ml-1 text-indigo-600" aria-label="Selected">✓</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{suggestion.address}</p>
                  {suggestion.rating != null && suggestion.review_count != null && (
                    <p className="mt-1 text-xs text-amber-600">
                      {suggestion.rating} ★ ({suggestion.review_count} reviews)
                    </p>
                  )}
                  {!suggestion.website_url && (
                    <p className="mt-1 text-xs italic text-gray-400">No website listed</p>
                  )}
                </button>
              )
            })}
          </div>
          {noWebsiteMessage && (
            <p className="mt-2 text-sm text-amber-600" role="status">
              {noWebsiteMessage}
            </p>
          )}
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {labels.map((label, index) => (
          <div key={index}>
            <label
              htmlFor={`competitor_${index + 1}`}
              className="block text-sm font-medium text-gray-700"
            >
              {label}
            </label>
            <input
              id={`competitor_${index + 1}`}
              name={`competitor_${index + 1}`}
              type="url"
              required={index < 2}
              placeholder={placeholders[index]}
              value={competitors[index]}
              onChange={handleChange(index)}
              onBlur={handleBlur(index)}
              className={inputClasses(index)}
              aria-label={`Competitor ${index + 1} URL`}
              aria-invalid={!!(errors[index] && touched[index])}
              aria-describedby={errors[index] && touched[index] ? `competitor_${index + 1}_error` : undefined}
            />
            {errors[index] && touched[index] && (
              <p id={`competitor_${index + 1}_error`} className="mt-1 text-sm text-red-600" role="alert">{errors[index]}</p>
            )}
          </div>
        ))}

        <div className="pt-2">
          <button
            type="submit"
            disabled={!isFormValid() || isLoading}
            className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
            aria-label={isLoading ? 'Generating report' : 'Generate Local Competitive SEO Report'}
          >
            {isLoading ? 'Generating…' : 'Generate Local Competitive SEO Report'}
          </button>
        </div>
      </form>
    </section>
  )
}
