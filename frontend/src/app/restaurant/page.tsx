"use client"

import { useState } from 'react'
import RestaurantInputForm from '@/components/RestaurantInputForm'
import RestaurantPredictionDisplay from '@/components/RestaurantPredictionDisplay'
import type { PredictionResponse } from '@/services/foodWasteService'
import { FaLeaf } from 'react-icons/fa'

export default function RestaurantPage() {
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="text-green-500 mr-3"><FaLeaf /></span>
            Restaurant Food Waste Predictor
          </h1>
          <p className="text-gray-600 mt-2">
            Predict and reduce food waste in your restaurant operations
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <RestaurantInputForm 
              onPredictionsChange={setPredictions}
              onLoadingChange={setIsLoading}
            />
            
            {/* Information Panel */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="text-green-500 mr-2"><FaLeaf /></span>
                Why Reduce Food Waste?
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Reduce operational costs by up to 15%</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Lower your restaurant's carbon footprint</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Improve inventory management efficiency</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Enhance your brand's sustainability image</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Contribute to global food waste reduction goals</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Results Area */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-gray-50 p-8 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Analyzing your restaurant data...</p>
              </div>
            ) : predictions ? (
              <div className="space-y-8">
                <RestaurantPredictionDisplay 
                  predictionData={{
                    food_type: predictions.food_type,
                    total_food: predictions.total_food,
                    waste_amount: predictions.waste_amount,
                    waste_percentage: predictions.waste_percentage,
                    co2_emissions: predictions.co2_emissions,
                    recommendations: predictions.recommendations,
                    utilization_rate: predictions.utilization_rate ?? 72 // Provide a default value if undefined
                  }}
                />
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg shadow-md border border-gray-200 flex flex-col items-center justify-center min-h-[400px]">
                <span className="text-green-500 text-5xl mb-4">📊</span>
                <h2 className="text-xl font-medium text-gray-800 mb-2">
                  Enter your restaurant details
                </h2>
                <p className="text-gray-600 text-center max-w-md">
                  Fill out the form to get personalized food waste predictions and actionable recommendations for your restaurant.
                </p>
              </div>
            )}
            
            {/* Additional Information */}
            {!isLoading && !predictions && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-3">How It Works</h3>
                  <p className="text-gray-600 text-sm">
                    Our AI model analyzes your restaurant's data including food type, quantity, guest count, 
                    and environmental factors to predict potential food waste and provide targeted recommendations.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-3">Data Privacy</h3>
                  <p className="text-gray-600 text-sm">
                    All data is processed securely and used only for generating predictions. 
                    We do not store your restaurant's operational data or share it with third parties.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-50 mt-12 py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              &copy; 2023 Restaurant Food Waste Predictor | Hoo Hacks Project
            </p>
            <div className="mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-green-500 text-sm mx-2">About</a>
              <a href="#" className="text-gray-600 hover:text-green-500 text-sm mx-2">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-green-500 text-sm mx-2">Terms</a>
              <a href="#" className="text-gray-600 hover:text-green-500 text-sm mx-2">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
