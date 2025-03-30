"use client"

import { useState } from 'react'
import type { PredictionResponse } from '@/services/foodWasteService'

interface PredictionDisplayProps {
  prediction: PredictionResponse;
}

export default function RestaurantPredictionDisplay({ prediction }: PredictionDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'recommendations'>('overview')
  
  // Calculate utilization percentage for display
  const utilizationPercentage = prediction.utilization_rate 
    ? Math.round(prediction.utilization_rate * 100) 
    : null

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="text-green-400 mr-2">📊</span>
          Prediction Results
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeTab === 'overview'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              activeTab === 'recommendations'
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Recommendations
          </button>
        </div>
      </div>
      
      {activeTab === 'overview' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Food Waste Prediction */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-300 text-sm font-medium">Predicted Food Waste</h3>
                <span className="text-yellow-400">🍽️</span>
              </div>
              <p className="text-3xl font-bold text-white mt-2">{prediction.prediction} kg</p>
              <p className="text-gray-400 text-sm mt-1">Food Type: {prediction.food_type}</p>
            </div>
            
            {/* CO2 Emissions Saved */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-300 text-sm font-medium">CO2 Emissions Saved</h3>
                <span className="text-green-400">🌱</span>
              </div>
              <p className="text-3xl font-bold text-white mt-2">{prediction.co2_saved} kg</p>
              <p className="text-gray-400 text-sm mt-1">By reducing food waste</p>
            </div>
          </div>
          
          {/* Utilization Rate */}
          {utilizationPercentage !== null && (
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-300 text-sm font-medium">Food Utilization Rate</h3>
                <span className="text-blue-400">📈</span>
              </div>
              
              <div className="w-full bg-gray-600 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${
                    utilizationPercentage > 80 
                      ? 'bg-green-500' 
                      : utilizationPercentage > 60 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${utilizationPercentage}%` }}
                ></div>
              </div>
              
              <p className="text-gray-300 text-sm mt-2">
                {utilizationPercentage}% of food is being utilized
              </p>
              
              <p className="text-gray-400 text-xs mt-1">
                {utilizationPercentage > 80 
                  ? 'Excellent utilization rate!' 
                  : utilizationPercentage > 60 
                    ? 'Good utilization rate, but room for improvement' 
                    : 'Poor utilization rate, significant waste reduction needed'}
              </p>
            </div>
          )}
          
          {/* Environmental Impact */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-300 text-sm font-medium">Environmental Impact</h3>
              <span className="text-green-400">♻️</span>
            </div>
            
            <p className="text-gray-300 text-sm">
              By reducing {prediction.prediction} kg of food waste, you can save:
            </p>
            
            <ul className="mt-2 space-y-1">
              <li className="text-gray-400 text-sm">
                • {prediction.co2_saved} kg of CO2 emissions
              </li>
              <li className="text-gray-400 text-sm">
                • {Math.round(prediction.prediction * 1.5)} liters of water
              </li>
              <li className="text-gray-400 text-sm">
                • {Math.round(prediction.prediction * 0.3)} kg of methane emissions
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Recommended Actions</h3>
          
          <ul className="space-y-3">
            {prediction.recommendations.map((recommendation, index) => (
              <li key={index} className="bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-200">{recommendation}</p>
              </li>
            ))}
          </ul>
          
          <div className="bg-gray-700 p-4 rounded-lg mt-6">
            <h4 className="text-gray-300 text-sm font-medium mb-2">Implementation Timeline</h4>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <p className="text-gray-300 text-sm">Immediate: Adjust ordering and storage practices</p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <p className="text-gray-300 text-sm">Short-term: Implement inventory tracking system</p>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <p className="text-gray-300 text-sm">Long-term: Develop partnerships for food donation</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
