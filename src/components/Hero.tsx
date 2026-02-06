export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Your Website&rsquo;s Health,{' '}
          <span className="text-indigo-600">Scored&nbsp;&amp;&nbsp;Explained</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
          Get a detailed governance and competitive SEO report for any website
          — in seconds, with full clarity on every finding.
        </p>

        <div className="mt-10">
          <a
            href="#report-form"
            className="inline-block rounded-lg bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-lg"
          >
            Generate Governance Report
          </a>
        </div>
      </div>
    </section>
  )
}
