import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e){
    e.preventDefault()
    setError('')
    if(!email || !password){
      setError('Please enter email and password')
      return
    }

    // Basic auth check (UI-only)
    if(email === 'admin@gmail.com' && password === 'Password@123'){
      navigate('/dashboard')
    } else {
      setError('Invalid credentials')
    }
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
        </form>
      </div>
    </div>
  )
}
