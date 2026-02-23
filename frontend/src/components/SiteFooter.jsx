import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function SiteFooter(){
  const { t } = useTranslation()

  return (
    <footer className="bg-[var(--color-primary)] text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <p className="text-base font-semibold">{t('common.appName')}</p>
            <p className="text-sm text-green-100 mt-2 max-w-xl">
              {t('footer.tagline')}
            </p>
          </div>

          <nav className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-5 text-sm" aria-label={t('footer.linksAria')}>
            <Link to="/about" className="hover:text-green-100 transition-all duration-300">{t('footer.about')}</Link>
            <Link to="/terms-and-conditions" className="hover:text-green-100 transition-all duration-300">{t('footer.terms')}</Link>
            <Link to="/privacy-policy" className="hover:text-green-100 transition-all duration-300">{t('footer.privacy')}</Link>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-green-700/70 text-xs text-green-100">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  )
}
