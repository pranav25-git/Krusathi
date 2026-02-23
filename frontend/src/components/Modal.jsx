import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ isOpen, onClose, title, closeLabel = 'Close', children }) {
  useEffect(() => {
    if (!isOpen) return undefined

    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) onClose()
  }

  return createPortal(
    <div
      className="fixed inset-0 w-screen h-screen z-[80] bg-black/40 backdrop-blur-md modal-fade overflow-y-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="min-h-screen w-full flex items-start justify-center px-0 sm:px-4 pt-0 sm:pt-12 pb-4">
        <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-t-xl sm:rounded-2xl shadow-xl modal-slide">
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-all duration-300"
              aria-label={closeLabel}
            >
              X
            </button>
          </div>
          <div className="p-4 sm:p-6 max-h-[90vh] overflow-y-auto overflow-x-hidden">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  )
}
