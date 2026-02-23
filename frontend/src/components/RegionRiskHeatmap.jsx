import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function riskFill(risk) {
  if (risk === 'high') return '#C62828'
  if (risk === 'medium') return '#F9A825'
  return '#2E7D32'
}

export default function RegionRiskHeatmap() {
  const { t } = useTranslation()

  const points = useMemo(
    () => [
      { name: t('dashboard.regions.telangana'), risk: 'high', pest: t('dashboard.pests.locust'), lat: 17.385, lng: 78.4867 },
      { name: t('dashboard.regions.maharashtra'), risk: 'medium', pest: t('dashboard.pests.bph'), lat: 19.076, lng: 72.8777 },
      { name: t('dashboard.regions.karnataka'), risk: 'low', pest: t('dashboard.pests.stemBorer'), lat: 12.9716, lng: 77.5946 },
      { name: t('dashboard.regions.gujarat'), risk: 'high', pest: t('dashboard.pests.fallArmyworm'), lat: 23.0225, lng: 72.5714 },
      { name: t('dashboard.regions.punjab'), risk: 'medium', pest: t('dashboard.pests.aphids'), lat: 30.901, lng: 75.8573 }
    ],
    [t]
  )

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-700">
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.heatmapTitle')}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('dashboard.heatmapSubtitle')}</p>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
        <MapContainer
          center={[22.9734, 78.6569]}
          zoom={5}
          scrollWheelZoom={false}
          className="h-[260px] sm:h-[320px] lg:h-[380px] w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((point) => (
            <CircleMarker
              key={`${point.name}-${point.lat}`}
              center={[point.lat, point.lng]}
              radius={14}
              fillColor={riskFill(point.risk)}
              fillOpacity={0.7}
              color={riskFill(point.risk)}
              weight={2}
            >
              <Tooltip>
                <div className="text-xs">
                  <p><strong>{t('dashboard.region')}:</strong> {point.name}</p>
                  <p><strong>{t('dashboard.riskLevel')}:</strong> {t(`dashboard.risk.${point.risk}`)}</p>
                  <p><strong>{t('dashboard.predictedPest')}:</strong> {point.pest}</p>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </section>
  )
}
