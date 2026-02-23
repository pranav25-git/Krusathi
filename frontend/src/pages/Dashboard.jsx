import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
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
import RiskSummaryCard from '../components/RiskSummaryCard'
import RegionRiskHeatmap from '../components/RegionRiskHeatmap'
import SatelliteIntelligenceView from '../components/SatelliteIntelligenceView'
import HistoricalAnalytics from '../components/HistoricalAnalytics'
import PredictionForm from '../components/PredictionForm'
import Modal from '../components/Modal'
import ActionBar from '../components/ActionBar'
import { clearToken, validateToken } from '../services/auth'

function ConfidenceRing({ value }) {
  const safeValue = Math.max(0, Math.min(100, value))
  const angle = safeValue * 3.6

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative h-36 w-36 rounded-full"
        style={{ background: `conic-gradient(#1565C0 ${angle}deg, #dbeafe ${angle}deg 360deg)` }}
      >
        <div className="absolute inset-3 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
          <p className="text-2xl font-bold text-[#1565C0]">{safeValue}%</p>
        </div>
      </div>
    </div>
  )
}

function DashboardSection({ title, subtitle, children }) {
  return (
    <section className="mt-6">
      <div className="mb-3">
        <h2 className="text-xl font-semibold text-[var(--color-text)] dark:text-slate-100">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isExporting, setIsExporting] = useState(false)
  const [isPredictionOpen, setIsPredictionOpen] = useState(false)
  const analyticsRef = useRef(null)

  const [formData, setFormData] = useState({
    cropType: 'rice',
    state: 'telangana',
    district: 'hyderabad',
    locationLabel: '',
    temperature: '30',
    humidity: '78',
    rainfall: '22'
  })
  const [prediction, setPrediction] = useState(null)

  useEffect(() => {
    validateToken()
      .then((res) => {
        if (!res.ok) {
          clearToken()
          navigate('/login', { replace: true })
        }
      })
      .catch(() => {
        clearToken()
        navigate('/login', { replace: true })
      })
  }, [navigate])

  const activeRiskLevel = prediction?.risk || 'high'

  const riskLabelMap = {
    low: t('dashboard.riskLow'),
    medium: t('dashboard.riskMedium'),
    high: t('dashboard.riskHigh')
  }
  const riskColorMap = {
    low: 'bg-[var(--risk-low)]/10 text-[var(--risk-low)]',
    medium: 'bg-[var(--risk-medium)]/15 text-[var(--risk-medium)]',
    high: 'bg-[var(--risk-high)]/10 text-[var(--risk-high)]'
  }
  const alertStyles = {
    low: 'border-[var(--risk-low)]/35 bg-[var(--risk-low)]/10 text-[var(--risk-low)]',
    medium: 'border-[var(--risk-medium)]/35 bg-[var(--risk-medium)]/10 text-[#8a6400]',
    high: 'border-[var(--risk-high)]/35 bg-[var(--risk-high)]/10 text-[var(--risk-high)]'
  }
  const alertIconMap = { low: '✓', medium: '!', high: '!!' }

  const trendData = useMemo(
    () => [
      { day: t('dashboard.week.mon'), risk: 62 },
      { day: t('dashboard.week.tue'), risk: 68 },
      { day: t('dashboard.week.wed'), risk: 64 },
      { day: t('dashboard.week.thu'), risk: 73 },
      { day: t('dashboard.week.fri'), risk: 78 },
      { day: t('dashboard.week.sat'), risk: 82 },
      { day: t('dashboard.week.sun'), risk: 79 }
    ],
    [t]
  )

  const climateImpactData = useMemo(
    () => [
      { factor: t('dashboard.factorHumidity'), impact: 86 },
      { factor: t('dashboard.factorTemperature'), impact: 72 },
      { factor: t('dashboard.factorRainfall'), impact: 67 }
    ],
    [t]
  )

  const summaryCards = [
    { title: t('dashboard.cropName'), value: t(`prediction.crops.${formData.cropType}`) },
    {
      title: t('dashboard.region'),
      value:
        formData.locationLabel ||
        `${t(`prediction.states.${formData.state}`)} - ${t(`prediction.districts.${formData.district}`)}`
    },
    {
      title: t('dashboard.weatherSnapshot'),
      value: `${formData.temperature}°C | ${t('dashboard.humidityShort')} ${formData.humidity}%`
    },
    {
      title: t('dashboard.pestRiskLevel'),
      value: riskLabelMap[activeRiskLevel],
      tone: activeRiskLevel,
      badge: (
        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${riskColorMap[activeRiskLevel]}`}>
          {riskLabelMap[activeRiskLevel]}
        </span>
      )
    }
  ]

  const explainableFactors = [
    { icon: '1', title: t('dashboard.xaiFactor1Title'), description: t('dashboard.xaiFactor1Desc') },
    { icon: '2', title: t('dashboard.xaiFactor2Title'), description: t('dashboard.xaiFactor2Desc') },
    { icon: '3', title: t('dashboard.xaiFactor3Title'), description: t('dashboard.xaiFactor3Desc') }
  ]

  const preventiveItems = [
    t('dashboard.preventiveItem1'),
    t('dashboard.preventiveItem2'),
    t('dashboard.preventiveItem3')
  ]

  function handlePredictionComplete(payload) {
    if (!payload) return
    setFormData(payload.formData)
    setPrediction(payload.prediction)
    setIsPredictionOpen(false)
  }

  async function handleDownloadPdf() {
    if (!analyticsRef.current) return
    setIsExporting(true)
    try {
      const canvas = await html2canvas(analyticsRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 1.4
      })

      const image = canvas.toDataURL('image/png')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const locationText =
        formData.locationLabel ||
        `${t(`prediction.states.${formData.state}`)} - ${t(`prediction.districts.${formData.district}`)}`

      doc.setFontSize(16)
      doc.text(t('dashboard.pdfTitle'), 40, 40)
      doc.setFontSize(11)
      doc.text(`${t('dashboard.region')}: ${locationText}`, 40, 66)
      doc.text(`${t('dashboard.cropName')}: ${t(`prediction.crops.${formData.cropType}`)}`, 40, 84)
      doc.text(`${t('dashboard.riskLevel')}: ${riskLabelMap[activeRiskLevel]}`, 40, 102)
      doc.text(`${t('dashboard.predictedPest')}: ${prediction?.pest || t('dashboard.predictedPestValue')}`, 40, 120)
      doc.text(`${t('dashboard.recommendedAction')}: ${prediction?.action || t('dashboard.recommendedActionValue')}`, 40, 138)

      const imgWidth = pageWidth - 80
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      doc.addImage(image, 'PNG', 40, 160, imgWidth, Math.min(imgHeight, 580))

      doc.save('ai-pest-risk-report.pdf')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 dashboard-fade-in overflow-x-hidden">
      <ActionBar
        title={t('dashboard.title')}
        actionLabel={t('profile.newPrediction')}
        onAction={() => setIsPredictionOpen(true)}
      />

      <div className={`rounded-xl border px-4 sm:px-5 py-3 mt-5 mb-5 flex items-start gap-3 ${alertStyles[activeRiskLevel]}`}>
        <span className="text-xl leading-none mt-0.5 font-bold" aria-hidden="true">{alertIconMap[activeRiskLevel]}</span>
        <p className="text-sm sm:text-base font-semibold">{t(`dashboard.alert.${activeRiskLevel}`)}</p>
      </div>

      <section className="rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-green-100">{t('dashboard.welcomeBack')}</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold">{t('dashboard.analyticsTitle')}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs sm:text-sm font-semibold backdrop-blur-sm">
              {t('dashboard.systemActive')}
            </span>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs sm:text-sm font-semibold backdrop-blur-sm hover:bg-white/25 transition-all duration-300 disabled:opacity-70"
            >
              {isExporting ? t('dashboard.exportingPdf') : t('dashboard.downloadReport')}
            </button>
          </div>
        </div>
      </section>

      <DashboardSection title={t('dashboard.riskSummaryTitle')} subtitle={t('dashboard.subtitle')}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {summaryCards.map((card) => (
            <RiskSummaryCard key={card.title} title={card.title} value={card.value} tone={card.tone} badge={card.badge} />
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title={t('dashboard.aiPredictionTitle')}>
        <article className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 dark:from-slate-900 dark:to-slate-900 dark:border-blue-900/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.aiPredictionTitle')}</h3>
            <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold dark:bg-blue-950 dark:text-blue-300">
              {t('dashboard.aiEngineBadge')}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-blue-100 bg-white p-4 dark:bg-slate-900 dark:border-blue-900/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('dashboard.predictedPest')}</p>
              <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{prediction?.pest || t('dashboard.predictedPestValue')}</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-white p-4 dark:bg-slate-900 dark:border-blue-900/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('dashboard.confidence')}</p>
              <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{prediction?.confidence ?? 92}%</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-white p-4 dark:bg-slate-900 dark:border-blue-900/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('dashboard.riskLevel')}</p>
              <p className="mt-2">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${riskColorMap[activeRiskLevel]}`}>
                  {riskLabelMap[activeRiskLevel]}
                </span>
              </p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-white p-4 dark:bg-slate-900 dark:border-blue-900/40">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('dashboard.recommendedAction')}</p>
              <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{prediction?.action || t('dashboard.recommendedActionValue')}</p>
            </div>
          </div>
        </article>
      </DashboardSection>

      <div ref={analyticsRef}>
        <DashboardSection title={t('dashboard.analyticsTitle')}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2 dark:bg-slate-900 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">{t('dashboard.riskTrendChart')}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#33415533" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="risk" stroke="#1565C0" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">{t('dashboard.aiConfidence')}</h3>
              <ConfidenceRing value={prediction?.confidence ?? 92} />
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-3 dark:bg-slate-900 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">{t('dashboard.climateImpactChart')}</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={climateImpactData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#33415533" />
                    <XAxis dataKey="factor" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="impact" fill="#1565C0" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>
        </DashboardSection>
      </div>

      <DashboardSection title={t('dashboard.heatmapTitle')}>
        <RegionRiskHeatmap />
      </DashboardSection>

      <DashboardSection title={t('dashboard.satelliteTitle')}>
        <SatelliteIntelligenceView />
      </DashboardSection>

      <DashboardSection title={t('dashboard.historicalTitle')}>
        <HistoricalAnalytics />
      </DashboardSection>

      <DashboardSection title={t('dashboard.xaiTitle')}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {explainableFactors.map((factor) => (
            <article key={factor.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 dark:bg-slate-900 dark:border-slate-700">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-sm font-bold dark:bg-blue-950 dark:text-blue-300">
                {factor.icon}
              </span>
              <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{factor.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed dark:text-slate-400">{factor.description}</p>
            </article>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title={t('dashboard.preventiveTitle')}>
        <article className="rounded-xl border border-green-200 bg-green-50 px-5 py-5 shadow-sm dark:bg-green-950/20 dark:border-green-900/50">
          <ul className="space-y-2 text-sm text-slate-700 border-l-4 border-[var(--color-primary)] pl-3 dark:text-slate-300">
            {preventiveItems.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-[var(--color-primary)] mt-0.5 font-bold" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </DashboardSection>

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
