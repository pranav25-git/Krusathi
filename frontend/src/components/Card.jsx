import React from 'react'

const riskColor = {
  low: 'bg-[var(--risk-low)]/10 text-[var(--risk-low)]',
  medium: 'bg-[var(--risk-medium)]/15 text-[var(--risk-medium)]',
  high: 'bg-[var(--risk-high)]/10 text-[var(--risk-high)]'
}

export default function Card({ title, subtitle, risk = 'low', riskLabel = 'Low Risk' }){
  return (
    <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-h-[188px]">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      </div>
      <div className="mt-5">
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${riskColor[risk] || riskColor.low}`}>
          {riskLabel}
        </span>
      </div>
    </article>
  )
}
