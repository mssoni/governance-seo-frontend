import { useState } from 'react'
import type { Evidence } from '../../types/api'

interface EvidencePanelProps {
  evidence: Evidence[]
  label?: string
  defaultOpen?: boolean
}

export default function EvidencePanel({ evidence, label, defaultOpen = false }: EvidencePanelProps) {
  const [open, setOpen] = useState(defaultOpen)

  if (evidence.length === 0) return null

  const showLabel = label ?? 'Show evidence'
  const hideLabel = label ? `Hide ${label.replace(/^Show\s*/i, '')}` : 'Hide evidence'

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {open ? hideLabel : showLabel}
      </button>
      {open && (
        <ul className="mt-2 space-y-1.5 pl-5">
          {evidence.map((item, i) => (
            <li key={i} className="text-sm text-gray-600">
              <span>{item.description}</span>
              {item.raw_value != null && (
                <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-500">
                  {item.raw_value}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
