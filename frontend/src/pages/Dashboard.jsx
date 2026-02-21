import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import { useNavigate } from 'react-router-dom'
import { clearToken, getDashboardData, logout, validateToken } from '../services/auth'

export default function Dashboard(){
  const navigate = useNavigate()
  const [status, setStatus] = useState('')

  useEffect(() => {
    validateToken()
      .then(res => {
        if (!res.ok) {
          clearToken()
          navigate('/login', { replace: true })
          return
        }
        return getDashboardData()
      })
      .then(async res => {
        if (!res) return
        if (!res.ok) {
          clearToken()
          navigate('/login', { replace: true })
          return
        }
        const data = await res.json()
        setStatus(data.message || '')
      })
      .catch(() => {
        clearToken()
        navigate('/login', { replace: true })
      })
  }, [navigate])

  function handleLogout(){
    logout()
      .finally(() => {
        clearToken()
        navigate('/login', { replace: true })
      })
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-agri-green">Welcome Admin</h1>
          <button onClick={handleLogout} className="px-4 py-2 rounded-md bg-gray-200">Logout</button>
        </header>

        <main className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Pest Prediction" subtitle="Coming Soon" />
          <Card title="Weather Risk" subtitle="Coming Soon" />
          <Card title="Crop Advisory" subtitle="Coming Soon" />
        </main>
        {status && <p className="mt-6 text-sm text-gray-600">{status}</p>}
      </div>
    </div>
  )
}
