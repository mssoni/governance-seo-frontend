import { useState, useMemo } from 'react'
import type { ChecklistItem, Effort } from '../../types/api'

const effortStyles: Record<Effort, string> = {
  S: 'bg-green-100 text-green-800',
  M: 'bg-yellow-100 text-yellow-800',
  L: 'bg-red-100 text-red-800',
}

function EffortBadge({ effort }: { effort: Effort }) {
  return (
    <span
      data-testid={`effort-badge-${effort}`}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${effortStyles[effort]}`}
    >
      {effort}
    </span>
  )
}

function CategoryGroup({
  category,
  items,
  checked,
  onToggle,
}: {
  category: string
  items: ChecklistItem[]
  checked: Set<string>
  onToggle: (action: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <h3 className="text-sm font-semibold text-gray-900">{category}</h3>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-gray-100">
          {items.map((item) => {
            const key = `${item.category}::${item.action}`
            const isChecked = checked.has(key)

            return (
              <label
                key={key}
                className="flex cursor-pointer items-start gap-3 border-b border-gray-50 px-4 py-3 last:border-b-0 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(key)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm font-medium ${isChecked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {item.action}
                    </span>
                    <EffortBadge effort={item.effort} />
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {item.frequency}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                      {item.owner}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{item.why_it_matters}</p>
                </div>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

interface ChecklistSectionProps {
  items: ChecklistItem[]
}

export default function ChecklistSection({ items }: ChecklistSectionProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const grouped = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>()
    for (const item of items) {
      const group = map.get(item.category) ?? []
      group.push(item)
      map.set(item.category, group)
    }
    return map
  }, [items])

  const handleToggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900">30-Day Action Checklist</h2>
      <div className="space-y-3">
        {Array.from(grouped.entries()).map(([category, categoryItems]) => (
          <CategoryGroup
            key={category}
            category={category}
            items={categoryItems}
            checked={checked}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </section>
  )
}
