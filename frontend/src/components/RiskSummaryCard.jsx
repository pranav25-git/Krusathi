import React from 'react'

export default function RiskSummaryCard({ title, value, badge, tone = 'default' }){
  const toneClass = {
    default: 'border-slate-200',
    low: 'border-[var(--risk-low)]/30',
    medium: 'border-[var(--risk-medium)]/35',
    high: 'border-[var(--risk-high)]/35'
  }

  return (
    <article className={`rounded-xl border bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${toneClass[tone] || toneClass.default}`}>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-lg sm:text-xl font-semibold text-[var(--color-text)]">{value}</p>
        {badge}
      </div>
    </article>
  )
}
