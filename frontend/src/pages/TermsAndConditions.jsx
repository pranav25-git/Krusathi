import React from 'react'
import { useTranslation } from 'react-i18next'

export default function TermsAndConditions(){
  const { t } = useTranslation()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <section className="bg-[var(--card-bg)] rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">{t('terms.title')}</h1>
        <p className="mt-3 text-slate-700 leading-relaxed">
          {t('terms.intro')}
        </p>
      </section>

      <section className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('terms.usageTitle')}</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {t('terms.usageBody')}
          </p>
        </article>

        <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('terms.dataTitle')}</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {t('terms.dataBody')}
          </p>
        </article>

        <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('terms.guaranteeTitle')}</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {t('terms.guaranteeBody')}
          </p>
        </article>

        <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('terms.ipTitle')}</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {t('terms.ipBody')}
          </p>
        </article>

        <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('terms.liabilityTitle')}</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {t('terms.liabilityBody')}
          </p>
        </article>

        <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('terms.responsibilityTitle')}</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-700 list-disc list-inside">
            <li>{t('terms.responsibility1')}</li>
            <li>{t('terms.responsibility2')}</li>
            <li>{t('terms.responsibility3')}</li>
          </ul>
        </article>
      </section>
    </div>
  )
}
