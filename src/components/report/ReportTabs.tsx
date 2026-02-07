import type { KeyboardEvent } from 'react'

// --- Tab type ---

export type TabId = 'business' | 'technical' | 'seo'

// --- Props ---

interface ReportTabsProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
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
  business: 'tab-business',
  technical: 'tab-technical',
  seo: 'tab-seo',
} as const

const PANEL_IDS = {
  business: 'tabpanel-business',
  technical: 'tabpanel-technical',
  seo: 'tabpanel-seo',
} as const

// --- Ordered tabs for arrow key navigation ---

const TAB_ORDER: TabId[] = ['business', 'technical', 'seo']

// --- Component ---

export default function ReportTabs({
  activeTab,
  onTabChange,
  seoEnabled,
  children,
}: ReportTabsProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TAB_ORDER.indexOf(activeTab)
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      for (let i = currentIndex + 1; i < TAB_ORDER.length; i++) {
        const next = TAB_ORDER[i]
        if (next !== 'seo' || seoEnabled) {
          onTabChange(next)
          break
        }
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      for (let i = currentIndex - 1; i >= 0; i--) {
        onTabChange(TAB_ORDER[i])
        break
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
          {/* Business Overview tab */}
          <button
            role="tab"
            type="button"
            id={TAB_IDS.business}
            aria-selected={activeTab === 'business'}
            aria-controls={PANEL_IDS.business}
            tabIndex={activeTab === 'business' ? 0 : -1}
            onClick={() => onTabChange('business')}
            className={`inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm transition-colors ${
              activeTab === 'business' ? activeClasses : inactiveClasses
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Business Overview
          </button>

          {/* Technical Details tab */}
          <button
            role="tab"
            type="button"
            id={TAB_IDS.technical}
            aria-selected={activeTab === 'technical'}
            aria-controls={PANEL_IDS.technical}
            tabIndex={activeTab === 'technical' ? 0 : -1}
            onClick={() => onTabChange('technical')}
            className={`inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm transition-colors ${
              activeTab === 'technical' ? activeClasses : inactiveClasses
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Technical Details
          </button>

          {/* SEO tab */}
          <button
            role="tab"
            type="button"
            id={TAB_IDS.seo}
            aria-selected={activeTab === 'seo'}
            aria-controls={PANEL_IDS.seo}
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
