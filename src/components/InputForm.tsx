import { useState, useCallback } from 'react'
import type { FormEvent, ChangeEvent, FocusEvent } from 'react'
import type { BusinessType, Intent, GovernanceReportRequest } from '../types/api'

// --- Constants ---

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: 'clinic', label: 'Clinic' },
  { value: 'dental', label: 'Dental' },
  { value: 'healthcare_services', label: 'Healthcare Services' },
  { value: 'ngo', label: 'NGO' },
  { value: 'education', label: 'Education' },
  { value: 'construction', label: 'Construction' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'professional_services', label: 'Professional Services' },
  { value: 'other', label: 'Other' },
]

const INTENTS: { value: Intent; label: string }[] = [
  { value: 'seo', label: 'I care about search traffic / SEO' },
  { value: 'governance', label: 'I care about stability / governance' },
  { value: 'both', label: 'Both' },
]

// --- Validation ---

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

// --- Types ---

interface FormState {
  website_url: string
  city: string
  region: string
  country: string
  business_type: string
  intent: string
}

interface FormErrors {
  website_url?: string
  city?: string
  region?: string
  country?: string
  business_type?: string
  intent?: string
}

interface InputFormProps {
  onSubmit: (data: GovernanceReportRequest) => Promise<void>
  isLoading: boolean
}

// --- Component ---

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [form, setForm] = useState<FormState>({
    website_url: '',
    city: '',
    region: '',
    country: '',
    business_type: '',
    intent: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = useCallback((name: string, value: string): string | undefined => {
    if (name === 'website_url') {
      if (!value.trim()) return 'Website URL is required'
      if (!isValidUrl(value.trim())) return 'Please enter a valid URL (e.g. https://example.com)'
    }
    if (name === 'city' && !value.trim()) return 'City is required'
    if (name === 'region' && !value.trim()) return 'State/Region is required'
    if (name === 'country' && !value.trim()) return 'Country is required'
    if (name === 'business_type' && !value) return 'Business type is required'
    if (name === 'intent' && !value) return 'Intent is required'
    return undefined
  }, [])

  const isFormValid = useCallback((): boolean => {
    const fields: (keyof FormState)[] = ['website_url', 'city', 'region', 'country', 'business_type', 'intent']
    return fields.every((field) => {
      const error = validateField(field, form[field])
      return error === undefined
    })
  }, [form, validateField])

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))

    // Clear error when user fixes it
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }, [touched, validateField])

  const handleBlur = useCallback((e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }, [validateField])

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const fields: (keyof FormState)[] = ['website_url', 'city', 'region', 'country', 'business_type', 'intent']
    const newErrors: FormErrors = {}
    let hasError = false

    for (const field of fields) {
      const error = validateField(field, form[field])
      if (error) {
        newErrors[field] = error
        hasError = true
      }
    }

    if (hasError) {
      setErrors(newErrors)
      setTouched(Object.fromEntries(fields.map((f) => [f, true])))
      return
    }

    const payload: GovernanceReportRequest = {
      website_url: form.website_url.trim(),
      location: {
        city: form.city.trim(),
        region: form.region.trim(),
        country: form.country.trim(),
      },
      business_type: form.business_type as BusinessType,
      intent: form.intent as Intent,
    }

    await onSubmit(payload)
  }, [form, onSubmit, validateField])

  const inputClasses = (fieldName: keyof FormErrors) =>
    `mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm ${
      errors[fieldName] && touched[fieldName]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300'
    }`

  const labelClasses = 'block text-sm font-medium text-gray-700'
  const errorClasses = 'mt-1 text-sm text-red-600'

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Website URL */}
      <div>
        <label htmlFor="website_url" className={labelClasses}>
          Website URL
        </label>
        <input
          id="website_url"
          name="website_url"
          type="url"
          required
          placeholder="https://example.com"
          value={form.website_url}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClasses('website_url')}
        />
        {errors.website_url && touched.website_url && (
          <p className={errorClasses}>{errors.website_url}</p>
        )}
      </div>

      {/* Location fields — responsive grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="city" className={labelClasses}>
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            placeholder="New York"
            value={form.city}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses('city')}
          />
          {errors.city && touched.city && (
            <p className={errorClasses}>{errors.city}</p>
          )}
        </div>

        <div>
          <label htmlFor="region" className={labelClasses}>
            State/Region
          </label>
          <input
            id="region"
            name="region"
            type="text"
            required
            placeholder="NY"
            value={form.region}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses('region')}
          />
          {errors.region && touched.region && (
            <p className={errorClasses}>{errors.region}</p>
          )}
        </div>

        <div>
          <label htmlFor="country" className={labelClasses}>
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            required
            placeholder="US"
            value={form.country}
            onChange={handleChange}
            onBlur={handleBlur}
            className={inputClasses('country')}
          />
          {errors.country && touched.country && (
            <p className={errorClasses}>{errors.country}</p>
          )}
        </div>
      </div>

      {/* Business Type */}
      <div>
        <label htmlFor="business_type" className={labelClasses}>
          Business Type
        </label>
        <select
          id="business_type"
          name="business_type"
          required
          value={form.business_type}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClasses('business_type')}
        >
          <option value="">Select business type…</option>
          {BUSINESS_TYPES.map((bt) => (
            <option key={bt.value} value={bt.value}>
              {bt.label}
            </option>
          ))}
        </select>
        {errors.business_type && touched.business_type && (
          <p className={errorClasses}>{errors.business_type}</p>
        )}
      </div>

      {/* Intent */}
      <div>
        <label htmlFor="intent" className={labelClasses}>
          Intent
        </label>
        <select
          id="intent"
          name="intent"
          required
          value={form.intent}
          onChange={handleChange}
          onBlur={handleBlur}
          className={inputClasses('intent')}
        >
          <option value="">Select your intent…</option>
          {INTENTS.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
        {errors.intent && touched.intent && (
          <p className={errorClasses}>{errors.intent}</p>
        )}
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={!isFormValid() || isLoading}
          className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-lg"
        >
          {isLoading ? 'Generating…' : 'Generate Governance Report'}
        </button>
      </div>
    </form>
  )
}
