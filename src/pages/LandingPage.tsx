import { useState, useCallback } from 'react'
import Hero from '../components/Hero'
import TrustIndicators from '../components/TrustIndicators'
import InputForm from '../components/InputForm'
import type { GovernanceReportRequest } from '../types/api'

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async (data: GovernanceReportRequest) => {
    setIsLoading(true)
    try {
      // TODO: integrate with API client in US-1.3
      void data
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setIsLoading(false)
    }
  }, [])

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
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
      </section>
    </div>
  )
}
