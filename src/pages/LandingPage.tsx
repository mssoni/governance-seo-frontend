import Hero from '../components/Hero'
import TrustIndicators from '../components/TrustIndicators'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <TrustIndicators />

      {/* Form section — placeholder for US-1.2 */}
      <section id="report-form" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Generate Your Report
        </h2>
        <p className="mt-2 text-gray-600">
          Fill in the details below to get your governance report.
        </p>
      </section>
    </div>
  )
}
