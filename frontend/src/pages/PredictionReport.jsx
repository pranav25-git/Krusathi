import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { clearToken, getPredictionById, validateToken } from '../services/auth'

function riskClass(predictionResult) {
  const normalized = String(predictionResult || '').toLowerCase()
  if (normalized === 'high') return 'bg-[var(--risk-high)]/10 text-[var(--risk-high)] border-[var(--risk-high)]/30'
  if (normalized === 'medium') return 'bg-[var(--risk-medium)]/15 text-[var(--risk-medium)] border-[var(--risk-medium)]/30'
  return 'bg-[var(--risk-low)]/10 text-[var(--risk-low)] border-[var(--risk-low)]/30'
}

function confidenceText(score) {
  return `${Math.round(Number(score || 0) * 100)}%`
}

export default function PredictionReport() {
  const navigate = useNavigate()
  const { predictionId } = useParams()

  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReport() {
      try {
        const authResponse = await validateToken()
        if (!authResponse.ok) {
          clearToken()
          navigate('/login', { replace: true })
          return
        }

        const response = await getPredictionById(predictionId)
        if (response.status === 404) {
          setPrediction(null)
          return
        }
        if (!response.ok) throw new Error('Failed to load report')

        const data = await response.json()
        setPrediction(data)
      } catch {
        clearToken()
        navigate('/login', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [navigate, predictionId])

  const riskBadge = useMemo(() => riskClass(prediction?.prediction_result), [prediction])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">Full Analysis Report</h1>
        <button
          type="button"
          onClick={() => navigate('/predictions')}
          className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
        >
          Back to All Predictions
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">Loading report...</p>
      ) : !prediction ? (
        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">Prediction report not found.</p>
      ) : (
        <div className="mt-6 space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:bg-slate-900 dark:border-slate-700">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Prediction ID</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">#{prediction.id}</p>
              </div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${riskBadge}`}>
                {prediction.prediction_result}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Crop Type</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{prediction.crop_type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Crop Stage</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{prediction.crop_stage}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Confidence Score</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{confidenceText(prediction.confidence_score)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Prediction Date</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{prediction.prediction_date}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">Created At</p>
                <p className="font-medium text-slate-800 dark:text-slate-200">{prediction.created_at ? new Date(prediction.created_at).toLocaleString() : '-'}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:bg-slate-900 dark:border-slate-700">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Location Details</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div><p className="text-xs text-slate-500 dark:text-slate-400">State</p><p className="font-medium text-slate-800 dark:text-slate-200">{prediction.state}</p></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">District</p><p className="font-medium text-slate-800 dark:text-slate-200">{prediction.district}</p></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">City</p><p className="font-medium text-slate-800 dark:text-slate-200">{prediction.city}</p></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">Village</p><p className="font-medium text-slate-800 dark:text-slate-200">{prediction.village}</p></div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:bg-slate-900 dark:border-slate-700">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Climate Inputs</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
              <div><p className="text-xs text-slate-500 dark:text-slate-400">Temperature</p><p className="font-medium text-slate-800 dark:text-slate-200">{prediction.temperature}</p></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">Humidity</p><p className="font-medium text-slate-800 dark:text-slate-200">{prediction.humidity}</p></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">Rainfall</p><p className="font-medium text-slate-800 dark:text-slate-200">{prediction.rainfall}</p></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">Wind Speed</p><p className="font-medium text-slate-800 dark:text-slate-200">{prediction.wind_speed}</p></div>
              <div><p className="text-xs text-slate-500 dark:text-slate-400">Soil Moisture</p><p className="font-medium text-slate-800 dark:text-slate-200">{prediction.soil_moisture}</p></div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
