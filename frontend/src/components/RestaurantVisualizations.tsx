"use client"

import { useEffect, useRef } from 'react'
import type { PredictionResponse } from '@/services/foodWasteService'

// This would normally be imported from a chart library like Chart.js
// For this example, we'll create a simplified version
interface VisualizationsProps {
  prediction: PredictionResponse;
}

export default function RestaurantVisualizations({ prediction }: VisualizationsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Draw a simple bar chart showing waste vs. utilized food
  useEffect(() => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Calculate utilized food amount
    const totalFood = prediction.utilization_rate 
      ? prediction.prediction / (1 - prediction.utilization_rate)
      : prediction.prediction * 4 // Estimate if utilization rate not provided
    
    const utilizedFood = totalFood - prediction.prediction
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Set dimensions
    const margin = 40
    const width = canvas.width - margin * 2
    const height = canvas.height - margin * 2
    const barWidth = width / 3
    
    // Draw title
    ctx.fillStyle = '#000000'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Food Utilization vs. Waste', canvas.width / 2, margin / 2)
    
    // Draw axes
    ctx.strokeStyle = '#666666'
    ctx.beginPath()
    ctx.moveTo(margin, margin)
    ctx.lineTo(margin, canvas.height - margin)
    ctx.lineTo(canvas.width - margin, canvas.height - margin)
    ctx.stroke()
    
    // Calculate scale
    const maxValue = Math.max(utilizedFood, prediction.prediction)
    const scale = height / (maxValue * 1.2) // Add 20% padding
    
    // Draw utilized food bar
    const utilizedBarHeight = utilizedFood * scale
    ctx.fillStyle = '#4CAF50' // Green
    ctx.fillRect(
      margin + barWidth / 2,
      canvas.height - margin - utilizedBarHeight,
      barWidth,
      utilizedBarHeight
    )
    
    // Draw waste bar
    const wasteBarHeight = prediction.prediction * scale
    ctx.fillStyle = '#F44336' // Red
    ctx.fillRect(
      margin + barWidth * 2,
      canvas.height - margin - wasteBarHeight,
      barWidth,
      wasteBarHeight
    )
    
    // Draw labels
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    
    // Utilized food label
    ctx.fillText(
      'Utilized',
      margin + barWidth,
      canvas.height - margin + 20
    )
    ctx.fillText(
      `${Math.round(utilizedFood)} kg`,
      margin + barWidth,
      canvas.height - margin + 35
    )
    
    // Waste label
    ctx.fillText(
      'Waste',
      margin + barWidth * 2.5,
      canvas.height - margin + 20
    )
    ctx.fillText(
      `${prediction.prediction} kg`,
      margin + barWidth * 2.5,
      canvas.height - margin + 35
    )
    
    // Draw values on bars
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'center'
    
    // Utilized food value
    ctx.fillText(
      `${Math.round(utilizedFood)} kg`,
      margin + barWidth,
      canvas.height - margin - utilizedBarHeight - 10
    )
    
    // Waste value
    ctx.fillText(
      `${prediction.prediction} kg`,
      margin + barWidth * 2.5,
      canvas.height - margin - wasteBarHeight - 10
    )
    
    // Draw utilization rate if available
    if (prediction.utilization_rate) {
      ctx.fillStyle = '#000000'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(
        `Utilization Rate: ${Math.round(prediction.utilization_rate * 100)}%`,
        canvas.width / 2,
        margin - 10
      )
    }
  }, [prediction])
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="text-green-500 mr-2">📈</span>
        Food Waste Visualizations
      </h2>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Bar Chart */}
          <div className="flex-1">
            <canvas 
              ref={canvasRef} 
              width={400} 
              height={300} 
              className="w-full h-auto bg-white rounded-lg border border-gray-200"
            ></canvas>
          </div>
          
          {/* Stats and Insights */}
          <div className="flex-1 space-y-4">
            <h3 className="text-lg font-medium text-gray-800">Key Insights</h3>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-gray-700 text-sm font-medium mb-2">Food Waste Metrics</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Total Food:</span>
                  <span className="text-gray-800 font-medium">
                    {prediction.utilization_rate 
                      ? Math.round(prediction.prediction / (1 - prediction.utilization_rate)) 
                      : Math.round(prediction.prediction * 4)} kg
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Waste Amount:</span>
                  <span className="text-gray-800 font-medium">{prediction.prediction} kg</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Waste Percentage:</span>
                  <span className="text-gray-800 font-medium">
                    {prediction.utilization_rate 
                      ? Math.round((1 - prediction.utilization_rate) * 100) 
                      : Math.round((prediction.prediction / (prediction.prediction * 4)) * 100)}%
                  </span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">CO2 Emissions:</span>
                  <span className="text-gray-800 font-medium">{prediction.co2_saved} kg</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="text-gray-700 text-sm font-medium mb-2">Improvement Potential</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 text-sm">Current Waste</span>
                    <span className="text-gray-600 text-sm">Target (-30%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="h-3 rounded-full bg-red-500" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-800 text-sm">{prediction.prediction} kg</span>
                    <span className="text-green-500 text-sm">{Math.round(prediction.prediction * 0.7)} kg</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 text-sm">Current CO2</span>
                    <span className="text-gray-600 text-sm">Target (-30%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="h-3 rounded-full bg-red-500" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-800 text-sm">{prediction.co2_saved} kg</span>
                    <span className="text-green-500 text-sm">{Math.round(prediction.co2_saved * 0.7)} kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
