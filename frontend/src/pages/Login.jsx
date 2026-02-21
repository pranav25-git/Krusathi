import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as apiLogin, setToken } from '../services/auth'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e){
    e.preventDefault()
    setError('')
    const normalizedEmail = email.trim()
    if(!normalizedEmail || !password){
      setError('Please enter email and password')
      return
    }

    apiLogin({ email: normalizedEmail, password }).then(async res => {
      if (res.ok) {
        const data = await res.json()
        if (!data.token) {
          setError('Login failed: token not received')
          return
        }
        setToken(data.token)
        navigate('/dashboard')
      } else {
        try {
          const j = await res.json()
          setError(j.detail || 'Invalid credentials')
        } catch {
          setError('Invalid credentials')
        }
      }
    }).catch(err => setError('Network error'))
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card-shadow">
        <h2 className="text-2xl font-bold text-agri-green">Login</h2>
        <p className="text-sm text-gray-600 mt-1">Sign in to access dashboard</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-1 block w-full rounded-md border-gray-200 shadow-sm p-2" placeholder="Password" />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div>
            <button type="submit" className="w-full px-4 py-2 bg-agri-green text-white rounded-md">Login</button>
          </div>

          <p className="text-sm text-center text-gray-600">Don't have an account? <Link to="/register" className="text-agri-green font-medium hover:underline">Register here</Link></p>
        </form>
      </div>
    </div>
  )
}
