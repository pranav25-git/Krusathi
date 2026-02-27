import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getAllPredictions, validateToken } from '../services/auth'

function riskClass(predictionResult) {
  const normalized = String(predictionResult || '').toLowerCase()
  if (normalized === 'high') return 'bg-[var(--risk-high)]/10 text-[var(--risk-high)]'
  if (normalized === 'medium') return 'bg-[var(--risk-medium)]/15 text-[var(--risk-medium)]'
  return 'bg-[var(--risk-low)]/10 text-[var(--risk-low)]'
}

function toPercent(value) {
  return `${Math.round(Number(value || 0) * 100)}%`
}

export default function AllPredictions() {
  const navigate = useNavigate()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPredictions() {
      try {
        const authResponse = await validateToken()
        if (!authResponse.ok) {
          clearToken()
          navigate('/login', { replace: true })
          return
        }

        const response = await getAllPredictions()
        if (!response.ok) throw new Error('Failed to load predictions')
        const data = await response.json()
        setPredictions(Array.isArray(data) ? data : [])
      } catch {
        clearToken()
        navigate('/login', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    loadPredictions()
  }, [navigate])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">All Predictions</h1>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
        >
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">Loading...</p>
      ) : predictions.length === 0 ? (
        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">No predictions yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-5">
          {predictions.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">{item.crop_type}</h2>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${riskClass(item.prediction_result)}`}>
                  {item.prediction_result}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Crop Stage</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{item.crop_stage}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Confidence</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{toPercent(item.confidence_score)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Location</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 break-words">
                    {item.village}, {item.city}, {item.district}, {item.state}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Prediction Date</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{item.prediction_date}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Created At</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{item.created_at ? new Date(item.created_at).toLocaleString() : '-'}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 p-3">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">Climate Inputs</p>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <p>Temp: {item.temperature}</p>
                  <p>Humidity: {item.humidity}</p>
                  <p>Rainfall: {item.rainfall}</p>
                  <p>Wind: {item.wind_speed}</p>
                  <p>Soil: {item.soil_moisture}</p>
                </div>
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/predictions/${item.id}`)}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)]"
                >
                  View Full Analysis Report
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
