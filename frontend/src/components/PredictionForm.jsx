import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import locationsData from '../data/locations.json'

const DEFAULT_LOCATION = {
  state: 'Maharashtra',
  district: 'Jalgaon',
  city: 'Bodwad',
  village: 'Salshingi',
  area: 'Bodwad',
  latitude: 21.038,
  longitude: 75.55
}

function todayDate() {
  return new Date().toISOString().split('T')[0]
}

function normalizeName(value) {
  return String(value || '')
    .replace(/\bdistrict\b/gi, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function findBestMatch(candidates, value) {
  if (!Array.isArray(candidates) || candidates.length === 0) return ''
  const target = normalizeName(value)
  if (!target) return ''
  const exact = candidates.find((item) => normalizeName(item) === target)
  if (exact) return exact
  const loose = candidates.find((item) => {
    const normalized = normalizeName(item)
    return normalized.includes(target) || target.includes(normalized)
  })
  return loose || ''
}

function getLocationOptions(state, district, city) {
  const states = Object.keys(locationsData)
  const districts = state && locationsData[state] ? Object.keys(locationsData[state]) : []
  const cities = state && district && locationsData[state]?.[district] ? Object.keys(locationsData[state][district]) : []
  const villages = state && district && city && locationsData[state]?.[district]?.[city] ? locationsData[state][district][city] : []
  return { states, districts, cities, villages }
}

export default function PredictionForm({ onPredictionComplete }) {
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    cropType: 'rice',
    cropStage: 'vegetative',
    temperature: '',
    humidity: '',
    rainfall: '',
    windSpeed: '',
    soilMoisture: '',
    useCurrentLocation: true,
    state: DEFAULT_LOCATION.state,
    district: DEFAULT_LOCATION.district,
    city: DEFAULT_LOCATION.city,
    village: DEFAULT_LOCATION.village,
    date: todayDate()
  })
  const [errors, setErrors] = useState({})
  const [isPredicting, setIsPredicting] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [isAutoLocationSynced, setIsAutoLocationSynced] = useState(true)

  const [location, setLocation] = useState({
    loading: false,
    area: DEFAULT_LOCATION.area,
    district: DEFAULT_LOCATION.district,
    state: DEFAULT_LOCATION.state,
    label: `${DEFAULT_LOCATION.area}, ${DEFAULT_LOCATION.district}, ${DEFAULT_LOCATION.state}`,
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
    error: ''
  })
  const [weather, setWeather] = useState({
    loading: false,
    autoFilled: false,
    error: ''
  })

  const options = useMemo(
    () => getLocationOptions(formData.state, formData.district, formData.city),
    [formData.state, formData.district, formData.city]
  )

  useEffect(() => {
    if (!options.districts.includes(formData.district)) {
      setFormData((prev) => ({ ...prev, district: options.districts[0] || '' }))
    }
  }, [options.districts, formData.district])

  useEffect(() => {
    if (!options.cities.includes(formData.city)) {
      setFormData((prev) => ({ ...prev, city: options.cities[0] || '' }))
    }
  }, [options.cities, formData.city])

  useEffect(() => {
    if (!options.villages.includes(formData.village)) {
      setFormData((prev) => ({ ...prev, village: options.villages[0] || '' }))
    }
  }, [options.villages, formData.village])

  useEffect(() => {
    if (!formData.useCurrentLocation) {
      setIsAutoLocationSynced(false)
      return
    }

    async function detectLocation() {
      if (!navigator.geolocation) {
        applyFallbackLocation(t('prediction.locationNotSupported'))
        return
      }

      setLocation((prev) => ({ ...prev, loading: true, error: '' }))

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude
          const lon = pos.coords.longitude
          try {
            const detected = await reverseGeocode(lat, lon)

            setLocation({
              loading: false,
              area: detected.city,
              district: detected.district,
              state: detected.state,
              label: `${detected.city}, ${detected.district}, ${detected.state}`,
              latitude: lat,
              longitude: lon,
              error: ''
            })

            const synced = syncDetectedLocationToDataset(detected)
            if (synced.matched) {
              setIsAutoLocationSynced(true)
              setFormData((prev) => ({
                ...prev,
                state: synced.state,
                district: synced.district,
                city: synced.city,
                village: synced.village
              }))
            } else {
              // Keep detected location in badge; leave dropdowns open for manual correction.
              setIsAutoLocationSynced(false)
              setFormData((prev) => ({
                ...prev,
                state: synced.state || prev.state,
                district: '',
                city: '',
                village: ''
              }))
            }

            await fetchAndFillWeather(lat, lon)
          } catch {
            applyFallbackLocation(t('prediction.locationFetchFailed'))
          }
        },
        () => {
          applyFallbackLocation(t('prediction.locationPermissionDenied'))
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    }

    detectLocation()
  }, [formData.useCurrentLocation, t])

  function syncDetectedLocationToDataset(detected) {
    const states = Object.keys(locationsData)
    const state = findBestMatch(states, detected.state)
    if (!state) return { matched: false, state: '' }

    const districts = Object.keys(locationsData[state] || {})
    const district = findBestMatch(districts, detected.district)
    if (!district) return { matched: false, state }

    const cities = Object.keys(locationsData[state][district] || {})
    const city = findBestMatch(cities, detected.city) || cities[0]
    if (!city) return { matched: false, state }

    const villages = locationsData[state][district][city] || []
    const village = villages[0] || ''

    return { matched: true, state, district, city, village }
  }

  async function reverseGeocode(lat, lon) {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      { headers: { Accept: 'application/json' } }
    )
    if (!response.ok) throw new Error('reverse geocode failed')
    const data = await response.json()
    const addr = data.address || {}

    const district = addr.state_district || addr.county || addr.district || t('prediction.unknownDistrict')
    const city = addr.city || addr.town || addr.village || addr.suburb || addr.hamlet || t('prediction.currentLocationLabel')
    const state = addr.state || t('prediction.unknownState')
    return { city, district, state }
  }

  async function fetchAndFillWeather(lat, lon) {
    setWeather({ loading: true, autoFilled: false, error: '' })
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`
      )
      if (!response.ok) throw new Error('weather api failed')
      const data = await response.json()
      const current = data.current || {}
      setFormData((prev) => ({
        ...prev,
        temperature: current.temperature_2m != null ? String(Math.round(current.temperature_2m)) : prev.temperature,
        humidity: current.relative_humidity_2m != null ? String(Math.round(current.relative_humidity_2m)) : prev.humidity,
        rainfall: current.precipitation != null ? String(Math.round(current.precipitation)) : prev.rainfall,
        windSpeed: current.wind_speed_10m != null ? String(Math.round(current.wind_speed_10m)) : prev.windSpeed
      }))
      setWeather({ loading: false, autoFilled: true, error: '' })
    } catch {
      setFormData((prev) => ({
        ...prev,
        temperature: '',
        humidity: '',
        rainfall: '',
        windSpeed: ''
      }))
      setWeather({ loading: false, autoFilled: false, error: t('prediction.weatherFetchFailed') })
    }
  }

  function applyFallbackLocation(errorMessage) {
    setIsAutoLocationSynced(true)
    setFormData((prev) => ({
      ...prev,
      state: DEFAULT_LOCATION.state,
      district: DEFAULT_LOCATION.district,
      city: DEFAULT_LOCATION.city,
      village: DEFAULT_LOCATION.village
    }))
    setLocation({
      loading: false,
      area: DEFAULT_LOCATION.area,
      district: DEFAULT_LOCATION.district,
      state: DEFAULT_LOCATION.state,
      label: `${DEFAULT_LOCATION.area}, ${DEFAULT_LOCATION.district}, ${DEFAULT_LOCATION.state}`,
      latitude: DEFAULT_LOCATION.latitude,
      longitude: DEFAULT_LOCATION.longitude,
      error: errorMessage
    })
    fetchAndFillWeather(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude)
  }

  function setField(name, value) {
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  function validate() {
    const nextErrors = {}
    const requiredFields = [
      'cropType',
      'cropStage',
      'temperature',
      'humidity',
      'rainfall',
      'windSpeed',
      'soilMoisture',
      'date'
    ]

    requiredFields.forEach((field) => {
      if (!String(formData[field]).trim()) nextErrors[field] = t('prediction.required')
    })

    if (!formData.useCurrentLocation || !isAutoLocationSynced) {
      if (!formData.state) nextErrors.state = t('prediction.required')
      if (!formData.district) nextErrors.district = t('prediction.required')
      if (!formData.city) nextErrors.city = t('prediction.required')
      if (!formData.village) nextErrors.village = t('prediction.required')
    }

    const num = (value) => Number(value)
    if (formData.temperature && (num(formData.temperature) < 0 || num(formData.temperature) > 60)) {
      nextErrors.temperature = t('prediction.errors.temperatureRange')
    }
    if (formData.humidity && (num(formData.humidity) < 0 || num(formData.humidity) > 100)) {
      nextErrors.humidity = t('prediction.errors.humidityRange')
    }
    if (formData.rainfall && (num(formData.rainfall) < 0 || num(formData.rainfall) > 500)) {
      nextErrors.rainfall = t('prediction.errors.rainfallRange')
    }
    if (formData.windSpeed && (num(formData.windSpeed) < 0 || num(formData.windSpeed) > 150)) {
      nextErrors.windSpeed = t('prediction.errors.windSpeedRange')
    }
    if (formData.soilMoisture && (num(formData.soilMoisture) < 0 || num(formData.soilMoisture) > 100)) {
      nextErrors.soilMoisture = t('prediction.errors.soilMoistureRange')
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function buildMockResult() {
    const humidity = Number(formData.humidity)
    const rainfall = Number(formData.rainfall)
    const soil = Number(formData.soilMoisture)
    const score = humidity * 0.45 + rainfall * 0.25 + soil * 0.3

    let risk = 'low'
    if (score >= 70) risk = 'high'
    else if (score >= 45) risk = 'medium'

    const pestMap = {
      low: t('prediction.mockPests.low'),
      medium: t('prediction.mockPests.medium'),
      high: t('prediction.mockPests.high')
    }
    const confidence = Math.max(65, Math.min(97, Math.round(72 + score / 4)))

    return {
      risk,
      pest: pestMap[risk],
      confidence,
      action: t(`prediction.recommendedActions.${risk}`)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    setIsPredicting(true)
    setPrediction(null)

    window.setTimeout(() => {
      const result = buildMockResult()
      const locationLabel = formData.useCurrentLocation
        ? location.label
        : `${formData.village}, ${formData.city}, ${formData.district}, ${formData.state}`

      setPrediction(result)
      setIsPredicting(false)
      onPredictionComplete?.({
        formData: { ...formData, locationLabel },
        prediction: result
      })
    }, 950)
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 transition-all duration-300 disabled:opacity-70'
  const errorClass = 'mt-1 text-xs text-[var(--risk-high)]'
  const disableManualLocation = formData.useCurrentLocation && isAutoLocationSynced

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-700">
      <section>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('prediction.sectionCrop')}</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('prediction.cropType')}</span>
            <select value={formData.cropType} onChange={(e) => setField('cropType', e.target.value)} className={inputClass}>
              <option value="wheat">{t('prediction.crops.wheat')}</option>
              <option value="rice">{t('prediction.crops.rice')}</option>
              <option value="cotton">{t('prediction.crops.cotton')}</option>
              <option value="maize">{t('prediction.crops.maize')}</option>
              <option value="soybean">{t('prediction.crops.soybean')}</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('prediction.cropStage')}</span>
            <select value={formData.cropStage} onChange={(e) => setField('cropStage', e.target.value)} className={inputClass}>
              <option value="seedling">{t('prediction.stages.seedling')}</option>
              <option value="vegetative">{t('prediction.stages.vegetative')}</option>
              <option value="flowering">{t('prediction.stages.flowering')}</option>
              <option value="fruiting">{t('prediction.stages.fruiting')}</option>
              <option value="harvesting">{t('prediction.stages.harvesting')}</option>
            </select>
          </label>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('prediction.sectionLocation')}</h3>
        <div className="mt-3">
          <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={formData.useCurrentLocation}
              onChange={(e) => setField('useCurrentLocation', e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            {t('prediction.useCurrentLocation')}
          </label>
        </div>

        <div className="mt-3">
          {location.loading ? (
            <div className="h-10 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          ) : (
            <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-950/30 dark:border-green-900 dark:text-green-300">
              {`📍 ${location.label || `${DEFAULT_LOCATION.area}, ${DEFAULT_LOCATION.district}, ${DEFAULT_LOCATION.state}`}`}
            </span>
          )}
          {!location.loading && formData.useCurrentLocation && (
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{t('prediction.locationSynced')}</p>
          )}
          {location.error && <p className={errorClass}>{location.error}</p>}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('prediction.state')}</span>
            <select value={formData.state} onChange={(e) => setField('state', e.target.value)} className={inputClass} disabled={disableManualLocation}>
              {options.states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <p className={errorClass}>{errors.state}</p>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('prediction.district')}</span>
            <select value={formData.district} onChange={(e) => setField('district', e.target.value)} className={inputClass} disabled={disableManualLocation}>
              {!formData.district && <option value="">{t('prediction.selectDistrict')}</option>}
              {options.districts.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
            {errors.district && <p className={errorClass}>{errors.district}</p>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('prediction.city')}</span>
            <select value={formData.city} onChange={(e) => setField('city', e.target.value)} className={inputClass} disabled={disableManualLocation}>
              {!formData.city && <option value="">{t('prediction.selectCity')}</option>}
              {options.cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && <p className={errorClass}>{errors.city}</p>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('prediction.village')}</span>
            <select value={formData.village} onChange={(e) => setField('village', e.target.value)} className={inputClass} disabled={disableManualLocation}>
              {!formData.village && <option value="">{t('prediction.selectVillage')}</option>}
              {options.villages.map((village) => (
                <option key={village} value={village}>{village}</option>
              ))}
            </select>
            {errors.village && <p className={errorClass}>{errors.village}</p>}
          </label>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('prediction.sectionClimate')}</h3>
        <div className="mt-2">
          {weather.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              <div className="h-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-8 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          ) : weather.autoFilled ? (
            <p className="text-xs text-green-700 dark:text-green-300">{t('prediction.weatherAutofilled')}</p>
          ) : null}
          {weather.error && <p className={errorClass}>{weather.error}</p>}
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[
            ['temperature', t('prediction.temperature')],
            ['humidity', t('prediction.humidity')],
            ['rainfall', t('prediction.rainfall')],
            ['windSpeed', t('prediction.windSpeed')],
            ['soilMoisture', t('prediction.soilMoisture')]
          ].map(([name, label]) => (
            <label key={name} className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
              <input type="number" value={formData[name]} onChange={(e) => setField(name, e.target.value)} className={inputClass} required />
              {errors[name] && <p className={errorClass}>{errors[name]}</p>}
            </label>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('prediction.sectionDate')}</h3>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('prediction.date')}</span>
            <input type="date" value={formData.date} onChange={(e) => setField('date', e.target.value)} className={inputClass} />
            {errors.date && <p className={errorClass}>{errors.date}</p>}
          </label>
        </div>
      </section>

      <div className="mt-6">
        <button
          type="submit"
          disabled={isPredicting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--color-primary-dark)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPredicting && <span className="button-spinner" aria-hidden="true" />}
          {isPredicting ? t('prediction.predicting') : t('prediction.predict')}
        </button>
      </div>

      {prediction && (
        <article className="mt-5 rounded-xl border border-blue-200 bg-blue-50/60 p-4 dark:bg-blue-950/20 dark:border-blue-900/40">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('prediction.resultTitle')}</h4>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
            <p><span className="font-medium">{t('prediction.resultPredictedPest')}:</span> {prediction.pest}</p>
            <p><span className="font-medium">{t('prediction.resultRiskLevel')}:</span> {t(`dashboard.risk.${prediction.risk}`)}</p>
            <p><span className="font-medium">{t('prediction.resultConfidence')}:</span> {prediction.confidence}%</p>
            <p><span className="font-medium">{t('prediction.resultAction')}:</span> {prediction.action}</p>
          </div>
        </article>
      )}
    </form>
  )
}
