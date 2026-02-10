import ProgressBar from '../ProgressBar'

export default function SEOPollingProgress({
  progress,
  currentStep,
  stepsCompleted,
}: {
  progress: number
  currentStep: string | null
  stepsCompleted: string[]
}) {
  return (
    <div className="mt-8 rounded-lg border border-indigo-100 bg-indigo-50/50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Generating SEO Report...
      </h3>
      <ProgressBar
        progress={progress}
        currentStep={currentStep}
        stepsCompleted={stepsCompleted}
      />
    </div>
  )
}
