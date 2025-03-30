"use client"

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useActionState } from 'react'
import { saveFormData, autoSaveFormData } from '@/app/actions'
import ErrorBoundary from './ErrorBoundary'
import type { Prediction } from '@/app/actions'

interface FormData {
  businessType: string;
  inventorySize: number;
  perishableItems: number;
  averageOrderSize: number;
  storageCapacity: number;
  currentWastePercentage: number;
  businessSize: string;
  location: string;
}

interface FormErrors {
  [key: string]: string;
}

interface ActionState {
  success: boolean;
  error?: string;
  predictions?: Prediction;
}

interface InputFormProps {
  onPredictionsChange: (predictions: Prediction | null) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

const initialFormData: FormData = {
  businessType: '',
  inventorySize: 0,
  perishableItems: 0,
  averageOrderSize: 0,
  storageCapacity: 0,
  currentWastePercentage: 0,
  businessSize: '',
  location: ''
}

export default function InputForm({ onPredictionsChange, onLoadingChange }: InputFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null)
  const [isPending, startTransition] = useTransition()
  const [state, formAction] = useActionState<ActionState, FormData>(saveFormData, { success: false })

  useEffect(() => {
    onLoadingChange(isLoading)
  }, [isLoading, onLoadingChange])

  useEffect(() => {
    if (state?.predictions) {
      onPredictionsChange(state.predictions)
    }
  }, [state, onPredictionsChange])

  // Auto-save functionality
  const debouncedAutoSave = useCallback(
    debounce(async (data: FormData) => {
      setAutoSaveStatus('saving')
      try {
        const result = await autoSaveFormData(data)
        setAutoSaveStatus(result.success ? 'saved' : 'error')
      } catch (error) {
        setAutoSaveStatus('error')
      }
    }, 1000),
    []
  )

  // Effect for auto-saving
  useEffect(() => {
    if (Object.values(formData).some(value => value !== '' && value !== 0)) {
      debouncedAutoSave(formData)
    }
  }, [formData, debouncedAutoSave])

  // Effect to handle form state changes
  useEffect(() => {
    if (state) {
      if (state.success) {
        setSuccess(true)
      } else if (state.error) {
        setErrors({ submit: state.error })
      }
    }
  }, [state])

  // Field-level validation
  const validateField = (name: string, value: any): string | null => {
    switch (name) {
      case 'inventorySize':
        if (value < 0) return 'Inventory size cannot be negative'
        if (value > 10000) return 'Inventory size seems too high'
        return null
      
      case 'perishableItems':
        if (value < 0) return 'Perishable items cannot be negative'
        if (value > formData.inventorySize) return 'Perishable items cannot exceed total inventory'
        return null
      
      case 'averageOrderSize':
        if (value < 0) return 'Order size cannot be negative'
        if (value > formData.storageCapacity) return 'Order size cannot exceed storage capacity'
        return null
      
      case 'currentWastePercentage':
        if (value < 0) return 'Waste percentage cannot be negative'
        if (value > 100) return 'Waste percentage cannot exceed 100%'
        return null
      
      case 'location':
        if (!value.trim()) return 'Location is required'
        if (!/^[A-Za-z\s,]+$/.test(value)) return 'Location should only contain letters, spaces, and commas'
        return null
      
      default:
        return null
    }
  }

  // Cross-field validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Business type specific validations
    if (formData.businessType === 'restaurant' && formData.inventorySize < 50) {
      newErrors.inventorySize = 'Restaurants typically maintain at least 50 items in inventory'
    }

    if (formData.businessType === 'grocery' && formData.perishableItems < 20) {
      newErrors.perishableItems = 'Grocery stores typically maintain at least 20 perishable items'
    }

    // Business size specific validations
    if (formData.businessSize === 'small' && formData.inventorySize > 500) {
      newErrors.inventorySize = 'Inventory size seems too high for a small business'
    }

    if (formData.businessSize === 'large' && formData.storageCapacity < 100) {
      newErrors.storageCapacity = 'Storage capacity seems too low for a large business'
    }

    // Validate all fields
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof FormData])
      if (error) {
        newErrors[key] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newValue = (name === 'inventorySize' || 
                     name === 'perishableItems' || 
                     name === 'averageOrderSize' || 
                     name === 'storageCapacity' || 
                     name === 'currentWastePercentage')
      ? value === '' ? 0 : Number(value)
      : value

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))
    
    // Validate field on change
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

    // Clear success message when form is modified
    setSuccess(false)
  }

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur()
    e.preventDefault()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})
    setSuccess(false)

    startTransition(async () => {
      try {
        await formAction(formData)
        setSuccess(true)
      } catch (error) {
        setErrors({ submit: 'Failed to submit form. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    })
  }

  const handleReset = () => {
    setFormData(initialFormData)
    setErrors({})
    setSuccess(false)
    setAutoSaveStatus(null)
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold mb-4 text-white">Enter Your Business Data</h2>
      
      {/* Auto-save status */}
      {autoSaveStatus && (
        <div className={`text-sm ${
          autoSaveStatus === 'saved' ? 'text-green-400' :
          autoSaveStatus === 'saving' ? 'text-blue-400' :
          'text-red-400'
        }`}>
          {autoSaveStatus === 'saved' && 'Draft saved'}
          {autoSaveStatus === 'saving' && 'Saving...'}
          {autoSaveStatus === 'error' && 'Failed to save draft'}
        </div>
      )}
      
      {/* Business Type */}
      <div>
        <label htmlFor="businessType" className="block text-sm font-medium text-gray-300 mb-1">
          Business Type
        </label>
        <select
          id="businessType"
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md text-gray-900 bg-white ${errors.businessType ? 'border-red-500' : ''}`}
          required
        >
          <option value="">Select a type</option>
          <option value="restaurant">Restaurant</option>
          <option value="grocery">Grocery Store</option>
          <option value="cafe">Café</option>
          <option value="bakery">Bakery</option>
          <option value="other">Other</option>
        </select>
        {errors.businessType && (
          <p className="text-red-400 text-sm mt-1">{errors.businessType}</p>
        )}
      </div>

      {/* Business Size */}
      <div>
        <label htmlFor="businessSize" className="block text-sm font-medium text-gray-300 mb-1">
          Business Size
        </label>
        <select
          id="businessSize"
          name="businessSize"
          value={formData.businessSize}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md text-gray-900 bg-white ${errors.businessSize ? 'border-red-500' : ''}`}
          required
        >
          <option value="">Select size</option>
          <option value="small">Small (1-10 employees)</option>
          <option value="medium">Medium (11-50 employees)</option>
          <option value="large">Large (50+ employees)</option>
        </select>
        {errors.businessSize && (
          <p className="text-red-400 text-sm mt-1">{errors.businessSize}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md text-gray-900 bg-white ${errors.location ? 'border-red-500' : ''}`}
          placeholder="City, State"
          required
        />
        {errors.location && (
          <p className="text-red-400 text-sm mt-1">{errors.location}</p>
        )}
      </div>

      {/* Inventory Size */}
      <div>
        <label htmlFor="inventorySize" className="block text-sm font-medium text-gray-300 mb-1">
          Current Inventory Size (items)
        </label>
        <input
          type="number"
          id="inventorySize"
          name="inventorySize"
          value={formData.inventorySize || ''}
          onChange={handleChange}
          onWheel={handleWheel}
          className={`w-full p-2 border rounded-md text-gray-900 bg-white [&::-webkit-inner-spin-button]:text-gray-900 ${errors.inventorySize ? 'border-red-500' : ''}`}
          min="0"
          required
        />
        {errors.inventorySize && (
          <p className="text-red-400 text-sm mt-1">{errors.inventorySize}</p>
        )}
      </div>

      {/* Perishable Items */}
      <div>
        <label htmlFor="perishableItems" className="block text-sm font-medium text-gray-300 mb-1">
          Number of Perishable Items
        </label>
        <input
          type="number"
          id="perishableItems"
          name="perishableItems"
          value={formData.perishableItems || ''}
          onChange={handleChange}
          onWheel={handleWheel}
          className={`w-full p-2 border rounded-md text-gray-900 bg-white [&::-webkit-inner-spin-button]:text-gray-900 ${errors.perishableItems ? 'border-red-500' : ''}`}
          min="0"
          required
        />
        {errors.perishableItems && (
          <p className="text-red-400 text-sm mt-1">{errors.perishableItems}</p>
        )}
      </div>

      {/* Average Order Size */}
      <div>
        <label htmlFor="averageOrderSize" className="block text-sm font-medium text-gray-300 mb-1">
          Average Order Size (items)
        </label>
        <input
          type="number"
          id="averageOrderSize"
          name="averageOrderSize"
          value={formData.averageOrderSize || ''}
          onChange={handleChange}
          onWheel={handleWheel}
          className={`w-full p-2 border rounded-md text-gray-900 bg-white [&::-webkit-inner-spin-button]:text-gray-900 ${errors.averageOrderSize ? 'border-red-500' : ''}`}
          min="0"
          required
        />
        {errors.averageOrderSize && (
          <p className="text-red-400 text-sm mt-1">{errors.averageOrderSize}</p>
        )}
      </div>

      {/* Storage Capacity */}
      <div>
        <label htmlFor="storageCapacity" className="block text-sm font-medium text-gray-300 mb-1">
          Storage Capacity (cubic meters)
        </label>
        <input
          type="number"
          id="storageCapacity"
          name="storageCapacity"
          value={formData.storageCapacity || ''}
          onChange={handleChange}
          onWheel={handleWheel}
          className={`w-full p-2 border rounded-md text-gray-900 bg-white [&::-webkit-inner-spin-button]:text-gray-900 ${errors.storageCapacity ? 'border-red-500' : ''}`}
          min="0"
          required
        />
        {errors.storageCapacity && (
          <p className="text-red-400 text-sm mt-1">{errors.storageCapacity}</p>
        )}
      </div>

      {/* Current Waste Percentage */}
      <div>
        <label htmlFor="currentWastePercentage" className="block text-sm font-medium text-gray-300 mb-1">
          Current Waste Percentage
        </label>
        <input
          type="number"
          id="currentWastePercentage"
          name="currentWastePercentage"
          value={formData.currentWastePercentage || ''}
          onChange={handleChange}
          onWheel={handleWheel}
          className={`w-full p-2 border rounded-md text-gray-900 bg-white [&::-webkit-inner-spin-button]:text-gray-900 ${errors.currentWastePercentage ? 'border-red-500' : ''}`}
          min="0"
          max="100"
          step="0.1"
          required
        />
        {errors.currentWastePercentage && (
          <p className="text-red-400 text-sm mt-1">{errors.currentWastePercentage}</p>
        )}
      </div>

      {errors.submit && (
        <ErrorBoundary 
          error={new Error(errors.submit)} 
          reset={() => setErrors({})} 
        />
      )}

      {success && (
        <p className="text-green-400 text-sm text-center">
          Form submitted successfully! Your predictions are being generated.
        </p>
      )}

      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            isLoading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isLoading ? 'Submitting...' : 'Get Predictions'}
        </button>
        
        <button
          type="button"
          onClick={handleReset}
          className="flex-1 py-2 px-4 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors"
        >
          Reset Form
        </button>
      </div>
    </form>
  )
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
} 