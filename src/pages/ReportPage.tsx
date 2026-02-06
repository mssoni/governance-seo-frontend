import { useSearchParams } from 'react-router-dom'

export default function ReportPage() {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('job')

  if (!jobId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <p className="text-lg text-gray-600">No job ID provided. Please submit a report first.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <p className="text-lg text-gray-700">
        Loading report for job <span className="font-mono font-semibold">{jobId}</span>…
      </p>
    </div>
  )
}
