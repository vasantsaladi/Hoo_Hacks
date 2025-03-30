"use client"

import { useState, useEffect } from 'react'
import type { PredictionResponse } from '@/services/foodWasteService'
import { 
  getPrediction, 
  getCurrentTemperature, 
  getCurrentHumidity,
  mapCategoryToProductType,
  mapStorageLocationToConditions,
  estimateHistoricalSales
} from '@/services/foodWasteService'

interface InputFormProps {
  onPredictionsChange: (predictions: any | null) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

export default function InputForm({ onPredictionsChange, onLoadingChange }: InputFormProps) {
  const [formData, setFormData] = useState({
    temperature: 25,
    humidity: 60,
    product_type: 'vegetables',
    historical_sales: 1000,
    storage_conditions: 'Room Temperature'
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [location, setLocation] = useState('Charlottesville')

  // Update loading state in parent component
  useEffect(() => {
    onLoadingChange(isLoading)
  }, [isLoading, onLoadingChange])

  // Fetch current temperature and humidity on location change
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const temperature = await getCurrentTemperature(location)
        const humidity = await getCurrentHumidity(location)
        
        setFormData(prev => ({
          ...prev,
          temperature,
          humidity
        }))
      } catch (error) {
        console.error('Error fetching weather data:', error)
      }
    }
    
    fetchWeatherData()
  }, [location])

  // Validate form fields
  const validateField = (name: string, value: any): string | null => {
    switch (name) {
      case 'temperature':
        if (value < -30 || value > 50) return 'Temperature must be between -30°C and 50°C'
        return null
        
      case 'humidity':
        if (value < 0 || value > 100) return 'Humidity must be between 0% and 100%'
        return null
        
      case 'historical_sales':
        if (value < 0) return 'Historical sales cannot be negative'
        return null
        
      default:
        return null
    }
  }

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Convert numeric values
    const newValue = ['temperature', 'humidity', 'historical_sales'].includes(name)
      ? value === '' ? 0 : Number(value)
      : value

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))
    
    // Validate field
    const error = validateField(name, newValue)
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    } else {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: Record<string, string> = {}
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value)
      if (error) {
        newErrors[key] = error
      }
    })
    
    setErrors(newErrors)
    
    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return
    }
    
    // Submit form
    setIsLoading(true)
    
    try {
      const response = await getPrediction(formData)
      
      // Convert the response to the format expected by the parent component
      const convertedPredictions = {
        wasteAmount: response.prediction,
        savingsPotential: response.co2_saved,
        recommendations: response.recommendations
      }
      
      onPredictionsChange(convertedPredictions)
    } catch (error) {
      console.error('Error getting prediction:', error)
      setErrors({ submit: 'Failed to get prediction. Please try again.' })
      onPredictionsChange(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">Food Waste Predictor</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-300 mb-2">
            Location
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Charlottesville">Charlottesville</option>
            <option value="New York">New York</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Chicago">Chicago</option>
            <option value="Miami">Miami</option>
          </select>
        </div>
        
        {/* Temperature */}
        <div className="mb-4">
          <label htmlFor="temperature" className="block text-gray-300 mb-2 flex items-center">
            <span className="mr-2 text-green-400">🌡️</span>
            Current Temperature (°C)
          </label>
          <input
            type="number"
            id="temperature"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.temperature && (
            <p className="text-red-400 text-sm mt-1">{errors.temperature}</p>
          )}
        </div>
        
        {/* Humidity */}
        <div className="mb-4">
          <label htmlFor="humidity" className="block text-gray-300 mb-2 flex items-center">
            <span className="mr-2 text-green-400">💧</span>
            Current Humidity (%)
          </label>
          <input
            type="number"
            id="humidity"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.humidity && (
            <p className="text-red-400 text-sm mt-1">{errors.humidity}</p>
          )}
        </div>
        
        {/* Product Type */}
        <div className="mb-4">
          <label htmlFor="product_type" className="block text-gray-300 mb-2 flex items-center">
            <span className="mr-2 text-green-400">🍴</span>
            Food Type
          </label>
          <select
            id="product_type"
            name="product_type"
            value={formData.product_type}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="dairy">Dairy Products</option>
            <option value="meat">Meat</option>
            <option value="bakery">Baked Goods</option>
            <option value="seafood">Seafood</option>
            <option value="grains">Grains</option>
          </select>
        </div>
        
        {/* Storage Conditions */}
        <div className="mb-4">
          <label htmlFor="storage_conditions" className="block text-gray-300 mb-2 flex items-center">
            <span className="mr-2 text-green-400">❄️</span>
            Storage Conditions
          </label>
          <select
            id="storage_conditions"
            name="storage_conditions"
            value={formData.storage_conditions}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Refrigerated">Refrigerated</option>
            <option value="Frozen">Frozen</option>
            <option value="Room Temperature">Room Temperature</option>
            <option value="Heated">Heated</option>
          </select>
        </div>
        
        {/* Historical Sales */}
        <div className="mb-6">
          <label htmlFor="historical_sales" className="block text-gray-300 mb-2 flex items-center">
            <span className="mr-2 text-green-400">📊</span>
            Historical Sales (kg)
          </label>
          <input
            type="number"
            id="historical_sales"
            name="historical_sales"
            value={formData.historical_sales}
            onChange={handleChange}
            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {errors.historical_sales && (
            <p className="text-red-400 text-sm mt-1">{errors.historical_sales}</p>
          )}
        </div>
        
        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md">
            <p className="text-red-400 text-sm">{errors.submit}</p>
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded font-medium ${
            isLoading
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 transition-colors'
          }`}
        >
          {isLoading ? 'Predicting...' : 'Predict Food Waste'}
        </button>
      </form>
    </div>
  )
}