import React from 'react'

export default function Card({title, subtitle}){
  return (
    <div className="card-shadow flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
      </div>
      <div className="mt-4">
        <span className="inline-block px-3 py-1 text-sm bg-green-50 text-agri-green rounded-full">Module</span>
      </div>
    </div>
  )
}
