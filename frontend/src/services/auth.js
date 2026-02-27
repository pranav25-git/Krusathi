const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
const TOKEN_KEY = 'auth_token'

export function register(payload){
  return fetch(`${API_BASE}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export function login(payload){
  return fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export function setToken(token){
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(){
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken(){
  localStorage.removeItem(TOKEN_KEY)
}

export function authFetch(path, options = {}){
  const token = getToken()
  const headers = { ...(options.headers || {}) }
  if (token) headers.Authorization = `Bearer ${token}`
  return fetch(`${API_BASE}${path}`, { ...options, headers })
}

export function validateToken(){
  return authFetch('/api/validate-token', { method: 'GET' })
}

export function logout(){
  return authFetch('/api/logout', { method: 'POST' })
}

export function getDashboardData(){
  return authFetch('/api/dashboard', { method: 'GET' })
}

export function createPrediction(payload){
  return authFetch('/api/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export function getLatestPrediction(){
  return authFetch('/api/predictions/latest', { method: 'GET' })
}

export function getAllPredictions(){
  return authFetch('/api/predictions', { method: 'GET' })
}

export function getPredictionById(predictionId){
  return authFetch(`/api/predictions/${predictionId}`, { method: 'GET' })
}

export function getPredictionAnalytics(){
  return authFetch('/api/predictions/analytics', { method: 'GET' })
}
