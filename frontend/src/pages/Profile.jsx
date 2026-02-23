import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ProfileCard from '../components/ProfileCard'
import { clearToken, getToken, logout } from '../services/auth'

function decodeTokenPayload(token) {
  if (!token || !token.includes('.')) return {}
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch {
    return {}
  }
}

function getInitialTheme() {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return 'light'
}

export default function Profile() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [theme, setTheme] = useState(getInitialTheme)
  const payload = useMemo(() => decodeTokenPayload(getToken()), [])

  const accountInfo = {
    email: payload.email || payload.sub || t('profile.notAvailable'),
    createdDate: payload.iat ? new Date(payload.iat * 1000).toLocaleDateString() : t('profile.notAvailable'),
    userId: payload.user_id || payload.id || payload.sub || t('profile.notAvailable')
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'dark')
    localStorage.setItem('theme', next)
  }

  function handleLogout() {
    logout().finally(() => {
      clearToken()
      navigate('/login', { replace: true })
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('profile.title')}</h1>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ProfileCard title={t('profile.accountInfo')}>
          <div className="space-y-2 text-sm">
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">{t('profile.userEmail')}:</span> {accountInfo.email}
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">{t('profile.accountCreated')}:</span> {accountInfo.createdDate}
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">{t('profile.userId')}:</span> {accountInfo.userId}
            </p>
          </div>
        </ProfileCard>

        <ProfileCard title={t('profile.preferences')}>
          <div className="space-y-3 text-sm">
            <p className="text-slate-700 dark:text-slate-300">
              <span className="font-medium">{t('profile.selectedLanguage')}:</span>{' '}
              {(i18n.resolvedLanguage || 'en').toUpperCase()}
            </p>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
            >
              {theme === 'dark' ? t('profile.lightMode') : t('profile.darkMode')}
            </button>
          </div>
        </ProfileCard>

        <ProfileCard title={t('profile.security')}>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-all duration-300"
          >
            {t('profile.logout')}
          </button>
        </ProfileCard>
      </div>
    </div>
  )
}
