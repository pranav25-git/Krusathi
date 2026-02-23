import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from 'recharts'

export default function HistoricalAnalytics() {
  const { t } = useTranslation()
  const [year, setYear] = useState('2026')
  const [region, setRegion] = useState('telangana')

  const trendData = useMemo(() => {
    return Array.from({ length: 30 }, (_, index) => ({
      day: index + 1,
      risk: Math.min(95, 45 + ((index * 7 + 15) % 50))
    }))
  }, [year, region])

  const cropOutbreakData = useMemo(
    () => [
      { crop: t('dashboard.cropOptions.paddy'), outbreaks: 18 },
      { crop: t('dashboard.cropOptions.cotton'), outbreaks: 13 },
      { crop: t('dashboard.cropOptions.maize'), outbreaks: 10 }
    ],
    [t, year, region]
  )

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.historicalTitle')}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('dashboard.historicalSubtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs sm:text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="h-9 rounded-lg border border-slate-300 bg-white px-3 text-xs sm:text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
          >
            <option value="telangana">{t('dashboard.regionOptions.telangana')}</option>
            <option value="maharashtra">{t('dashboard.regionOptions.maharashtra')}</option>
            <option value="karnataka">{t('dashboard.regionOptions.karnataka')}</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-5">
        <article className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">{t('dashboard.thirtyDayTrend')}</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415533" />
                <XAxis dataKey="day" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="risk" stroke="#1565C0" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">{t('dashboard.cropOutbreakChart')}</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropOutbreakData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#33415533" />
                <XAxis dataKey="crop" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="outbreaks" fill="#1565C0" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  )
}
