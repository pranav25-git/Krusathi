import React from 'react'
import { Link } from 'react-router-dom'

export default function Home(){
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        <section className="p-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-agri-green">AI-Based Pest Outbreak Prediction System</h1>
          <p className="mt-4 text-gray-700 text-lg">A frontend prototype for forecasting and advisory tools for modern agriculture. UI-only phase.</p>
          <div className="mt-6">
            <Link to="/login" className="inline-block px-6 py-3 rounded-md bg-agri-green text-white font-medium">Login</Link>
          </div>
        </section>

        <section className="p-6 flex items-center justify-center">
          <div className="w-full card-shadow">
            <div className="flex flex-col items-center text-center">
              <svg width="180" height="140" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C13.1046 2 14 2.89543 14 4V5H10V4C10 2.89543 10.8954 2 12 2Z" fill="#2f855a"/>
                <path d="M4 10C4 7.23858 6.23858 5 9 5H15C17.7614 5 20 7.23858 20 10V17H4V10Z" fill="#9ae6b4"/>
                <path d="M4 19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V18H4V19Z" fill="#a7f3d0"/>
              </svg>
              <h3 className="mt-4 text-lg font-semibold">Modern agricultural insights</h3>
              <p className="mt-2 text-sm text-gray-600">Clean, responsive UI ready for backend integration and ML modules later.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
