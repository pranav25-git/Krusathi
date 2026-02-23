import React from 'react'

export default function ProfileCard({ title, children }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-700 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
      <div className="mt-4">{children}</div>
    </article>
  )
}
