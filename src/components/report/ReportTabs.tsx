import type { KeyboardEvent } from 'react'

// --- Props ---

interface ReportTabsProps {
  activeTab: 'governance' | 'seo'
  onTabChange: (tab: 'governance' | 'seo') => void
  seoEnabled: boolean
  children: React.ReactNode
}

// --- Lock icon for disabled SEO tab ---

function LockIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  )
}

// --- Tab IDs ---

const TAB_IDS = {
  governance: 'tab-governance',
  seo: 'tab-seo',
} as const

const PANEL_IDS = {
  governance: 'tabpanel-governance',
  seo: 'tabpanel-seo',
} as const

// --- Component ---

export default function ReportTabs({
  activeTab,
  onTabChange,
  seoEnabled,
  children,
}: ReportTabsProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      if (activeTab === 'governance' && seoEnabled) {
        onTabChange('seo')
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (activeTab === 'seo') {
        onTabChange('governance')
      }
    }
  }

  const activeClasses =
    'border-indigo-600 text-indigo-600 font-semibold'
  const inactiveClasses =
    'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 font-medium'
  const disabledClasses =
    'border-transparent text-gray-400 cursor-not-allowed font-medium'

  return (
    <div>
      {/* Tab list */}
      <div
        role="tablist"
        aria-label="Report sections"
        onKeyDown={handleKeyDown}
        className="border-b border-gray-200"
      >
        <div className="-mb-px flex gap-6">
          {/* Governance tab */}
          <button
            role="tab"
            type="button"
            id={TAB_IDS.governance}
            aria-selected={activeTab === 'governance'}
            aria-controls={PANEL_IDS[activeTab]}
            tabIndex={activeTab === 'governance' ? 0 : -1}
            onClick={() => onTabChange('governance')}
            className={`inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm transition-colors ${
              activeTab === 'governance' ? activeClasses : inactiveClasses
            }`}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Governance Report
          </button>

          {/* SEO tab */}
          <button
            role="tab"
            type="button"
            id={TAB_IDS.seo}
            aria-selected={activeTab === 'seo'}
            aria-controls={PANEL_IDS[activeTab]}
            aria-disabled={!seoEnabled || undefined}
            disabled={!seoEnabled}
            tabIndex={activeTab === 'seo' ? 0 : -1}
            onClick={() => {
              if (seoEnabled) {
                onTabChange('seo')
              }
            }}
            className={`relative inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm transition-colors ${
              !seoEnabled
                ? disabledClasses
                : activeTab === 'seo'
                  ? activeClasses
                  : inactiveClasses
            }`}
          >
            {!seoEnabled ? (
              <LockIcon />
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            )}
            Competitive SEO Report
            {!seoEnabled && (
              <span className="ml-1 text-xs text-gray-400">
                — Add competitors to unlock
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab panel */}
      <div
        role="tabpanel"
        id={PANEL_IDS[activeTab]}
        aria-labelledby={TAB_IDS[activeTab]}
        tabIndex={0}
        className="pt-6"
      >
        {children}
      </div>
    </div>
  )
}
