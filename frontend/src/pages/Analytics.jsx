import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { clearToken, getPredictionAnalytics, validateToken } from '../services/auth'

const RISK_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e'
}

export default function Analytics() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const authResponse = await validateToken()
        if (!authResponse.ok) {
          clearToken()
          navigate('/login', { replace: true })
          return
        }

        const response = await getPredictionAnalytics()
        if (!response.ok) throw new Error('Failed to load analytics')
        const data = await response.json()
        setAnalytics(data)
      } catch {
        clearToken()
        navigate('/login', { replace: true })
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [navigate])

  const pieData = useMemo(() => {
    if (!analytics) return []
    return [
      { name: 'High', value: analytics.risk_distribution?.high || 0, color: RISK_COLORS.high },
      { name: 'Medium', value: analytics.risk_distribution?.medium || 0, color: RISK_COLORS.medium },
      { name: 'Low', value: analytics.risk_distribution?.low || 0, color: RISK_COLORS.low }
    ]
  }, [analytics])

  const barData = useMemo(() => {
    if (!analytics) return []
    return [
      { name: 'High', count: analytics.high_risk_count || 0, fill: RISK_COLORS.high },
      { name: 'Medium', count: analytics.medium_risk_count || 0, fill: RISK_COLORS.medium },
      { name: 'Low', count: analytics.low_risk_count || 0, fill: RISK_COLORS.low }
    ]
  }, [analytics])

  const trendData = useMemo(() => {
    if (!analytics?.climate_trend) return []
    return analytics.climate_trend.map((item) => ({
      date: item.prediction_date,
      temperature: item.temperature,
      humidity: item.humidity
    }))
  }, [analytics])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Analytics</h1>
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
      ) : !analytics ? (
        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">No analytics available.</p>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <article className="rounded-xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Predictions</p>
              <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{analytics.total_predictions}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">High / Medium / Low</p>
              <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
                {analytics.high_risk_count} / {analytics.medium_risk_count} / {analytics.low_risk_count}
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Avg Temperature</p>
              <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{analytics.avg_temperature}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-4 dark:bg-slate-900 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400">Avg Humidity</p>
              <p className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">{analytics.avg_humidity}</p>
            </article>
          </div>

          <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Risk Distribution (%)</h2>
              <div className="h-72 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Risk Counts</h2>
              <div className="h-72 mt-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#33415533" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count">
                      {barData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>

          <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Temperature & Humidity Trend</h2>
            <div className="h-80 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#33415533" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#2563eb" strokeWidth={2} />
                  <Line type="monotone" dataKey="humidity" stroke="#16a34a" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>
        </>
      )}
    </div>
  )
}
