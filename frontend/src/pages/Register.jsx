import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { register as apiRegister } from '../services/auth'

export default function Register(){
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(e){
    e.preventDefault()
    setError('')
    setSuccess('')
    const normalizedEmail = email.trim()
    if(!normalizedEmail || !password){
      setError(t('register.enterCredentials'))
      return
    }

    setSubmitting(true)
    apiRegister({ email: normalizedEmail, password }).then(res => {
      if (res.ok) {
        setSuccess(t('register.success'))
        setTimeout(() => navigate('/login'), 1000)
      } else {
        res.json().then(j => setError(j.detail || t('register.registrationFailed')))
      }
    }).catch(() => setError(t('register.networkError')))
      .finally(() => setSubmitting(false))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="max-w-md mx-auto bg-[var(--card-bg)] rounded-xl shadow-md border border-slate-200 p-6 sm:p-8">
        <h2 className="text-3xl font-bold text-[var(--color-primary)]">{t('register.title')}</h2>
        <p className="mt-2 text-sm text-slate-600">{t('register.subtitle')}</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              placeholder={t('register.emailPlaceholder')}
              autoComplete="email"
              required
            />
          </div>

          <div className="relative">
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-12 text-slate-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
              placeholder={t('register.passwordPlaceholder')}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 transition-all duration-300"
              aria-label={showPassword ? t('register.hidePassword') : t('register.showPassword')}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18M10.58 10.58a2 2 0 002.84 2.84M9.88 5.09A9.77 9.77 0 0112 4c5 0 9 4 10 8a10.5 10.5 0 01-3.12 4.91M6.1 6.1A10.45 10.45 0 002 12c1 4 5 8 10 8 2.02 0 3.89-.64 5.4-1.73" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
                  <circle cx="12" cy="12" r="3" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{success}</div>}

          <div>
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[var(--color-primary-dark)] hover:shadow-md transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-75" disabled={submitting}>
              {submitting && <span className="button-spinner" aria-hidden="true" />}
              <span>{submitting ? t('register.creatingAccount') : t('register.createAccount')}</span>
            </button>
          </div>

          <p className="text-center text-sm text-slate-600">
            {t('register.haveAccount')}{' '}
            <Link to="/login" className="font-semibold text-[var(--color-primary)] hover:underline">
              {t('register.signIn')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
