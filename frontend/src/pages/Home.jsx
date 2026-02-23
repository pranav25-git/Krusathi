import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function FeatureIconCloud(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path d="M7 16a4 4 0 114-4 4.5 4.5 0 018 2 3.5 3.5 0 01-.5 7H7a3 3 0 010-6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FeatureIconCrop(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path d="M12 21V9M12 9c0-3-2.5-6-6-6v2c0 2.8 2.2 5 5 5h1zm0 0c0-3 2.5-6 6-6v2c0 2.8-2.2 5-5 5h-1z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FeatureIconAi(){
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
      <path d="M9 8a3 3 0 116 0c0 1.5-.8 2.3-1.8 3.1-.9.7-1.2 1.1-1.2 1.9M12 17h.01M4 12a8 8 0 1116 0 8 8 0 01-16 0z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Home(){
  const { t } = useTranslation()

  return (
    <div className="pb-4">
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(12, 32, 15, 0.22), rgba(12, 32, 15, 0.38)), url('/assets/HomePageImage.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            <p className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-xs sm:text-sm font-medium text-white backdrop-blur-sm border border-white/30">
              {t('home.heroBadge')}
            </p>
            <h1 className="mt-5 text-white font-extrabold leading-tight tracking-tight text-3xl sm:text-5xl lg:text-6xl">
              {t('home.heroTitle')}
            </h1>
            <p className="text-green-50 mt-5 max-w-2xl text-base sm:text-lg leading-relaxed">
              {t('home.heroSubtitle')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="px-6 py-3 rounded-xl font-semibold bg-white text-[var(--color-primary)] hover:bg-green-50 shadow-md hover:shadow-xl transition-all duration-300">
                {t('home.startFree')}
              </Link>
              <Link to="/login" className="px-6 py-3 rounded-xl font-semibold border border-white text-white hover:bg-white hover:text-[var(--color-primary)] transition-all duration-300">
                {t('home.signIn')}
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-3 text-white">
                <p className="text-xl font-bold">{t('home.stat1Title')}</p>
                <p className="text-xs text-green-100 mt-1">{t('home.stat1Subtitle')}</p>
              </div>
              <div className="rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-3 text-white">
                <p className="text-xl font-bold">{t('home.stat2Title')}</p>
                <p className="text-xs text-green-100 mt-1">{t('home.stat2Subtitle')}</p>
              </div>
              <div className="rounded-xl bg-white/15 backdrop-blur-sm border border-white/25 px-4 py-3 text-white">
                <p className="text-xl font-bold">{t('home.stat3Title')}</p>
                <p className="text-xs text-green-100 mt-1">{t('home.stat3Subtitle')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">{t('home.whyTitle')}</h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            {t('home.whySubtitle')}
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl inline-flex items-center justify-center bg-green-100 text-[var(--color-primary)]" aria-hidden="true">
              <FeatureIconCloud />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[var(--color-text)]">{t('home.feature1Title')}</h3>
            <p className="mt-2 text-sm text-slate-600">{t('home.feature1Desc')}</p>
          </article>
          <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl inline-flex items-center justify-center bg-green-100 text-[var(--color-primary)]" aria-hidden="true">
              <FeatureIconCrop />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[var(--color-text)]">{t('home.feature2Title')}</h3>
            <p className="mt-2 text-sm text-slate-600">{t('home.feature2Desc')}</p>
          </article>
          <article className="bg-[var(--card-bg)] rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="w-11 h-11 rounded-xl inline-flex items-center justify-center bg-green-100 text-[var(--color-primary)]" aria-hidden="true">
              <FeatureIconAi />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[var(--color-text)]">{t('home.feature3Title')}</h3>
            <p className="mt-2 text-sm text-slate-600">{t('home.feature3Desc')}</p>
          </article>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">{t('home.ctaTitle')}</h3>
              <p className="mt-2 text-slate-600 text-sm sm:text-base">
                {t('home.ctaSubtitle')}
              </p>
            </div>
            <Link to="/register" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-dark)] transition-all duration-300 shadow-sm hover:shadow-md">
              {t('home.createAccount')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
