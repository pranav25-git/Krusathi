import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import About from './pages/About'
import TermsAndConditions from './pages/TermsAndConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import { getToken } from './services/auth'

function ProtectedRoute({ children }){
  const token = getToken()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function PublicOnlyRoute({ children }){
  const token = getToken()
  if (token) return <Navigate to="/dashboard" replace />
  return children
}

export default function App(){
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions/>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
          <Route path="/login" element={<PublicOnlyRoute><Login/></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register/></PublicOnlyRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}
