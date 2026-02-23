import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Circle } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const STANDARD_TILE = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const SATELLITE_TILE = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

export default function SatelliteIntelligenceView() {
  const { t } = useTranslation()
  const [satelliteMode, setSatelliteMode] = useState(false)

  const zones = useMemo(
    () => [
      { lat: 17.385, lng: 78.4867, risk: 'high', radius: 70000 },
      { lat: 19.076, lng: 72.8777, risk: 'medium', radius: 65000 },
      { lat: 12.9716, lng: 77.5946, risk: 'low', radius: 55000 }
    ],
    []
  )

  const zoneColors = {
    high: '#C62828',
    medium: '#F9A825',
    low: '#2E7D32'
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-700">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.satelliteTitle')}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('dashboard.satelliteSubtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => setSatelliteMode((prev) => !prev)}
          className="rounded-xl border border-slate-300 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-300 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
        >
          {satelliteMode ? t('dashboard.standardView') : t('dashboard.satelliteView')}
        </button>
      </div>

      <div className={`mt-4 relative overflow-hidden rounded-xl border ${satelliteMode ? 'border-slate-700' : 'border-slate-200'} ${satelliteMode ? 'bg-slate-900' : 'bg-white'}`}>
        <MapContainer
          center={[22.9734, 78.6569]}
          zoom={5}
          scrollWheelZoom={false}
          className="h-[260px] sm:h-[320px] lg:h-[380px] w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url={satelliteMode ? SATELLITE_TILE : STANDARD_TILE}
          />
          {zones.map((zone, idx) => (
            <Circle
              key={idx}
              center={[zone.lat, zone.lng]}
              radius={zone.radius}
              pathOptions={{
                color: zoneColors[zone.risk],
                fillColor: zoneColors[zone.risk],
                fillOpacity: satelliteMode ? 0.25 : 0.12,
                weight: 2
              }}
            />
          ))}
        </MapContainer>

        {satelliteMode && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[28%] top-[36%] h-14 w-14 rounded-full bg-red-500/25 zone-pulse" />
            <div className="absolute left-[43%] top-[48%] h-12 w-12 rounded-full bg-amber-400/25 zone-pulse" />
            <div className="absolute left-[55%] top-[60%] h-10 w-10 rounded-full bg-green-500/25 zone-pulse" />
          </div>
        )}
      </div>
    </section>
  )
}
