import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { clearToken, getToken, logout } from '../services/auth'
import NotificationCenter from './NotificationCenter'

const navItems = [
  { to: '/', key: 'header.home' },
  { to: '/about', key: 'header.about' },
  { to: '/terms-and-conditions', key: 'header.terms' },
  { to: '/privacy-policy', key: 'header.privacy' }
]

function linkClass({ isActive }) {
  return [
    'px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300',
    isActive
      ? 'bg-[var(--color-primary)] text-white shadow-sm'
      : 'text-[var(--color-text)] hover:bg-green-50 dark:hover:bg-slate-800'
  ].join(' ')
}

function getInitialTheme() {
  const stored = localStorage.getItem('theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function SiteHeader() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const userMenuRef = useRef(null)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isAuthed, setIsAuthed] = useState(Boolean(getToken()))
  const [theme, setTheme] = useState(getInitialTheme)
  const currentLang = (i18n.resolvedLanguage || 'en').split('-')[0]

  useEffect(() => {
    setIsAuthed(Boolean(getToken()))
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const isDark = theme === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    function handleClickOutside(event) {
      if (!userMenuRef.current?.contains(event.target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleLogout() {
    logout().finally(() => {
      clearToken()
      setIsAuthed(false)
      navigate('/login', { replace: true })
    })
  }

  function handleLanguageChange(lang) {
    i18n.changeLanguage(lang)
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-black/5 shadow-sm dark:bg-slate-950/95 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          <Link to="/" className="text-sm sm:text-base font-bold text-[var(--color-primary)] tracking-tight">
            {t('common.appName')}
          </Link>

          <nav className="hidden md:flex items-center gap-2" aria-label={t('header.primaryNav')}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <NotificationCenter />
            <button
              type="button"
              onClick={toggleTheme}
              className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 hover:bg-slate-50 transition-all duration-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              aria-label={theme === 'dark' ? t('header.lightMode') : t('header.darkMode')}
            >
              {theme === 'dark' ? t('header.lightMode') : t('header.darkMode')}
            </button>

            <select
              value={currentLang}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              aria-label={t('header.language')}
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="mr">MR</option>
            </select>

            {!isAuthed && (
              <>
                <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-semibold border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-green-50 dark:hover:bg-slate-800 transition-all duration-300">
                  {t('header.login')}
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-all duration-300 shadow-sm hover:shadow-md">
                  {t('header.register')}
                </Link>
              </>
            )}

            {isAuthed && (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="h-10 w-10 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                  aria-label={t('profile.title')}
                >
                  <span aria-hidden="true">👤</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-2 notif-dropdown">
                    <Link to="/dashboard" className="block rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                      {t('header.dashboard')}
                    </Link>
                    <Link to="/profile" className="block rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800">
                      {t('profile.title')}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {t('header.logout')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? t('header.closeMenu') : t('header.openMenu')}
            aria-expanded={mobileOpen}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-2 dark:border-slate-800">
            <div className="flex items-center gap-2 pb-1">
              <NotificationCenter />
              <button
                type="button"
                onClick={toggleTheme}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-300 bg-white text-slate-700 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
              >
                {theme === 'dark' ? t('header.lightMode') : t('header.darkMode')}
              </button>
            </div>

            <div className="flex items-center gap-2 pb-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{t('header.language')}:</span>
              <button type="button" onClick={() => handleLanguageChange('en')} className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-300 ${currentLang === 'en' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white text-slate-700 border-slate-300 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-600'}`}>EN</button>
              <button type="button" onClick={() => handleLanguageChange('hi')} className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-300 ${currentLang === 'hi' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white text-slate-700 border-slate-300 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-600'}`}>HI</button>
              <button type="button" onClick={() => handleLanguageChange('mr')} className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-300 ${currentLang === 'mr' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white text-slate-700 border-slate-300 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-600'}`}>MR</button>
            </div>

            <nav className="grid gap-1" aria-label={t('header.mobileNav')}>
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  {t(item.key)}
                </NavLink>
              ))}
            </nav>

            <div className="grid gap-2 pt-2">
              {!isAuthed && (
                <>
                  <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-semibold text-center border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-green-50 dark:hover:bg-slate-800 transition-all duration-300">
                    {t('header.login')}
                  </Link>
                  <Link to="/register" className="px-4 py-2 rounded-xl text-sm font-semibold text-center bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-all duration-300">
                    {t('header.register')}
                  </Link>
                </>
              )}
              {isAuthed && (
                <>
                  <Link to="/dashboard" className="px-4 py-2 rounded-xl text-sm font-semibold text-center border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-green-50 dark:hover:bg-slate-800 transition-all duration-300">
                    {t('header.dashboard')}
                  </Link>
                  <Link to="/profile" className="px-4 py-2 rounded-xl text-sm font-semibold text-center border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-green-50 dark:hover:bg-slate-800 transition-all duration-300">
                    {t('profile.title')}
                  </Link>
                  <button type="button" onClick={handleLogout} className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-all duration-300">
                    {t('header.logout')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
