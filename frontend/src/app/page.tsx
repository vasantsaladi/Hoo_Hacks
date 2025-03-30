"use client"

import { useState } from 'react'
import { FaLeaf } from 'react-icons/fa'
import InputForm from '@/components/InputForm'
import PredictionDisplay from '@/components/PredictionDisplay'
import Visualizations from '@/components/Visualizations'
import InventoryTracker from '@/components/InventoryTracker'

interface Prediction {
  wasteAmount: number;
  savingsPotential: number;
  recommendations: string[];
}

export default function Home() {
  const [predictions, setPredictions] = useState<Prediction | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <main className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center">
            <FaLeaf className="text-green-400 mr-2" />
            Food Waste Predictor
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Optimize your inventory and reduce food waste
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputForm onPredictionsChange={setPredictions} onLoadingChange={setIsLoading} />
          {isLoading ? (
            <div className="animate-pulse bg-gray-800 p-6 rounded-lg shadow-md">
              <p className="text-gray-300">Loading predictions...</p>
            </div>
          ) : predictions ? (
            <PredictionDisplay predictions={predictions} />
          ) : null}
        </div>
        
        {predictions && (
          <>
            <Visualizations predictions={predictions} />
            <InventoryTracker predictions={predictions} />
          </>
        )}
      </div>
    </main>
  )
}
