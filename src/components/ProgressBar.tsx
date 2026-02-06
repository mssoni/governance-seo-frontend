const PIPELINE_STEPS = [
  'url_normalize',
  'fetch_homepage',
  'parse_sitemap',
  'sample_pages',
  'run_detectors',
  'run_psi',
  'build_issues',
  'generate_checklist',
  'build_report',
]

interface ProgressBarProps {
  progress: number
  currentStep: string | null
  stepsCompleted: string[]
}

export default function ProgressBar({ progress, currentStep, stepsCompleted }: ProgressBarProps) {
  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Progress bar */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Generating report…</span>
        <span className="text-sm font-semibold text-indigo-600">{progress}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mb-6 h-3 w-full overflow-hidden rounded-full bg-gray-200"
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step labels */}
      <ul className="space-y-1.5">
        {PIPELINE_STEPS.map((step) => {
          const isCompleted = stepsCompleted.includes(step)
          const isCurrent = step === currentStep
          return (
            <li key={step} className="flex items-center gap-2 text-sm">
              {isCompleted ? (
                <span className="text-green-500" aria-label={`${step} completed`}>✓</span>
              ) : isCurrent ? (
                <span className="animate-pulse text-indigo-500">●</span>
              ) : (
                <span className="text-gray-300">○</span>
              )}
              <span
                className={
                  isCompleted
                    ? 'text-green-700'
                    : isCurrent
                      ? 'font-medium text-indigo-700'
                      : 'text-gray-400'
                }
              >
                {step}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
