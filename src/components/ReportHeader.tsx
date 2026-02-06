interface ReportHeaderProps {
  websiteUrl: string
  location: string
  intent: string
}

export default function ReportHeader({ websiteUrl, location, intent }: ReportHeaderProps) {
  return (
    <header className="mb-8 border-b border-gray-200 pb-6">
      <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
        Governance Report
      </h1>
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 00-5.656-5.656l-1.102 1.101" />
          </svg>
          <a
            href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            {websiteUrl}
          </a>
        </span>
        <span className="text-gray-300">|</span>
        <span className="inline-flex items-center gap-1.5">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {location}
        </span>
        <span className="text-gray-300">|</span>
        <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
          {intent}
        </span>
      </div>
    </header>
  )
}
