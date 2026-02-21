import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as apiRegister } from '../services/auth'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e){
    e.preventDefault()
    setError('')
    setSuccess('')
    const normalizedEmail = email.trim()
    if(!normalizedEmail || !password){
      setError('Please enter email and password')
      return
    }

    apiRegister({ email: normalizedEmail, password }).then(res => {
      if (res.ok) {
        setSuccess('Registration successful — please login')
        setTimeout(() => navigate('/login'), 1000)
      } else {
        res.json().then(j => setError(j.detail || 'Registration failed'))
      }
    }).catch(() => setError('Network error'))
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md card-shadow">
        <h2 className="text-2xl font-bold text-agri-green">Register</h2>
        <p className="text-sm text-gray-600 mt-1">Create an account</p>
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
          {success && <div className="text-sm text-green-600">{success}</div>}

          <div>
            <button type="submit" className="w-full px-4 py-2 bg-agri-green text-white rounded-md">Register</button>
          </div>

          <p className="text-sm text-center text-gray-600">Already have an account? <Link to="/login" className="text-agri-green font-medium hover:underline">Login here</Link></p>
        </form>
      </div>
    </div>
  )
}
