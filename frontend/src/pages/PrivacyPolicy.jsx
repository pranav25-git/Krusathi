import React from 'react'
import { useTranslation } from 'react-i18next'

export default function PrivacyPolicy(){
  const { t } = useTranslation()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <section className="bg-[var(--card-bg)] rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">{t('privacy.title')}</h1>
        <p className="mt-3 text-slate-700 leading-relaxed">
          {t('privacy.intro')}
        </p>
      </section>

      <section className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('privacy.collectTitle')}</h2>
          <ul className="mt-2 space-y-2 text-sm text-slate-700 list-disc list-inside">
            <li>{t('privacy.collect1')}</li>
            <li>{t('privacy.collect2')}</li>
            <li>{t('privacy.collect3')}</li>
          </ul>
        </article>

        <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('privacy.useTitle')}</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {t('privacy.useBody')}
          </p>
        </article>

        <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('privacy.protectionTitle')}</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {t('privacy.protectionBody')}
          </p>
        </article>

        <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('privacy.saleTitle')}</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {t('privacy.saleBody')}
          </p>
        </article>

        <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('privacy.cookiesTitle')}</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {t('privacy.cookiesBody')}
          </p>
        </article>

        <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{t('privacy.contactTitle')}</h2>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {t('privacy.contactBody')}
          </p>
        </article>
      </section>
    </div>
  )
}
