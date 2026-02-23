import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function NotificationCenter() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([
    { id: 1, type: 'high', read: false, key: 'notifications.highRisk' },
    { id: 2, type: 'medium', read: false, key: 'notifications.mediumRisk' },
    { id: 3, type: 'info', read: true, key: 'notifications.systemUpdate' }
  ])

  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items])

  function markAsRead(id) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  const typeClass = {
    high: 'bg-[var(--risk-high)]/10 text-[var(--risk-high)] border-[var(--risk-high)]/25',
    medium: 'bg-[var(--risk-medium)]/15 text-[#8a6400] border-[var(--risk-medium)]/30',
    info: 'bg-blue-50 text-blue-700 border-blue-200'
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-all duration-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
        aria-label={t('notifications.open')}
      >
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[var(--risk-high)] text-white text-[10px] font-semibold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown absolute right-0 mt-2 w-80 max-w-[85vw] rounded-xl border border-slate-200 bg-white shadow-xl p-3 z-50 dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('notifications.title')}</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">{unreadCount} {t('notifications.unread')}</span>
          </div>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className={`rounded-lg border p-2 ${typeClass[item.type]}`}>
                <p className="text-xs font-medium">{t(item.key)}</p>
                {!item.read && (
                  <button
                    type="button"
                    onClick={() => markAsRead(item.id)}
                    className="mt-1 text-[11px] underline underline-offset-2"
                  >
                    {t('notifications.markRead')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
