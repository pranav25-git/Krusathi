import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
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
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<PublicOnlyRoute><Login/></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><Register/></PublicOnlyRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
    </Routes>
  )
}
