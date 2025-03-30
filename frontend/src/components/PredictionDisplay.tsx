"use client"

import { motion } from 'framer-motion'

interface Prediction {
  wasteAmount: number;
  savingsPotential: number;
  recommendations: string[];
}

interface PredictionDisplayProps {
  predictions: Prediction;
}

export default function PredictionDisplay({ predictions }: PredictionDisplayProps) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">Predictions</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-300">Estimated Waste Amount</h3>
          <p className="text-2xl font-bold text-red-400">{predictions.wasteAmount.toFixed(1)} lbs</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-300">Potential Savings</h3>
          <p className="text-2xl font-bold text-green-400">
            ${predictions.savingsPotential.toFixed(2)}
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-300">Recommendations</h3>
          <ul className="list-disc list-inside space-y-2">
            {predictions.recommendations.map((rec, index) => (
              <li key={index} className="text-gray-300">{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 