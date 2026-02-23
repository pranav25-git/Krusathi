import React from 'react'

export default function ActionBar({ title, actionLabel, onAction }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] shadow-sm hover:shadow-md transition-all duration-300"
        >
          <span aria-hidden="true">+</span>
          <span>{actionLabel}</span>
        </button>
      </div>
    </section>
  )
}
