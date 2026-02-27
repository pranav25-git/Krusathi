import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ActionBar from '../components/ActionBar'
import Modal from '../components/Modal'
import PredictionForm from '../components/PredictionForm'
import { clearToken, getLatestPrediction, validateToken } from '../services/auth'

function toRisk(predictionResult) {
  const normalized = String(predictionResult || '').toLowerCase()
  if (normalized === 'high') return 'high'
  if (normalized === 'medium') return 'medium'
  return 'low'
}

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [isPredictionOpen, setIsPredictionOpen] = useState(false)
  const [latestPrediction, setLatestPrediction] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function initialize() {
      try {
        const authResponse = await validateToken()
        if (!authResponse.ok) {
          clearToken()
          navigate('/login', { replace: true })
          return
        }

        const predictionResponse = await getLatestPrediction()
        if (predictionResponse.status === 404) {
          setLatestPrediction(null)
          return
        }

        if (!predictionResponse.ok) {
          throw new Error('Failed to load latest prediction')
        }

        const data = await predictionResponse.json()
        setLatestPrediction(data)
      } catch {
        clearToken()
        navigate('/login', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [navigate])

  const risk = useMemo(() => toRisk(latestPrediction?.prediction_result), [latestPrediction])

  const riskBadgeClass = {
    low: 'bg-[var(--risk-low)]/10 text-[var(--risk-low)]',
    medium: 'bg-[var(--risk-medium)]/15 text-[var(--risk-medium)]',
    high: 'bg-[var(--risk-high)]/10 text-[var(--risk-high)]'
  }

  function handlePredictionComplete(payload) {
    if (!payload?.savedPrediction) return
    setLatestPrediction(payload.savedPrediction)
    setIsPredictionOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 dashboard-fade-in overflow-x-hidden">
      <ActionBar
        title={t('dashboard.title')}
        actionLabel={t('profile.newPrediction')}
        onAction={() => setIsPredictionOpen(true)}
      />

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate('/predictions')}
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
        >
          All Predictions
        </button>
        <button
          type="button"
          onClick={() => navigate('/analytics')}
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
        >
          Analytics
        </button>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Latest Prediction</h2>

        {loading ? (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Loading...</p>
        ) : !latestPrediction ? (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">No predictions yet.</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Crop Type</p>
              <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{latestPrediction.crop_type}</p>
            </article>

            <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Risk Level</p>
              <p className="mt-1">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${riskBadgeClass[risk]}`}>
                  {latestPrediction.prediction_result}
                </span>
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Confidence</p>
              <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                {Math.round(Number(latestPrediction.confidence_score || 0) * 100)}%
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Climate</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                Temp: {latestPrediction.temperature} C, Humidity: {latestPrediction.humidity}%, Rainfall: {latestPrediction.rainfall}
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                Wind: {latestPrediction.wind_speed}, Soil Moisture: {latestPrediction.soil_moisture}%
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                {latestPrediction.village}, {latestPrediction.city}, {latestPrediction.district}, {latestPrediction.state}
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Prediction Date</p>
              <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{latestPrediction.prediction_date}</p>
            </article>
          </div>
        )}
      </section>

      <Modal
        isOpen={isPredictionOpen}
        onClose={() => setIsPredictionOpen(false)}
        title={t('profile.newPrediction')}
        closeLabel={t('profile.close')}
      >
        <PredictionForm onPredictionComplete={handlePredictionComplete} />
      </Modal>
    </div>
  )
}
