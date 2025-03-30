"use client"

import Link from 'next/link'
import { FaLeaf, FaChartBar, FaUtensils, FaTemperatureHigh } from 'react-icons/fa'
import ImpactVisualization from '@/components/ImpactVisualization'

export default function Home() {
  return (
    <main className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center">
            <span className="text-green-500 mr-2"><FaLeaf /></span>
            Food Waste Predictor
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Optimize your inventory and reduce food waste
          </p>
        </header>
        
        {/* Impact Visualization Section */}
        <div className="mb-12">
          <ImpactVisualization />
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg shadow-md mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Restaurant Food Waste Prediction Model</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <FaChartBar className="text-green-500 mr-2" />
                Key Features
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">•</span>
                  <span>Advanced machine learning model with <strong>78% accuracy</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">•</span>
                  <span>Personalized recommendations based on your specific data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">•</span>
                  <span>Interactive visualizations of waste metrics and targets</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">•</span>
                  <span>Environmental impact analysis with CO2 emissions tracking</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
                <FaTemperatureHigh className="text-green-500 mr-2" />
                Input Factors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-sm transition-all">
                  <p className="font-medium text-gray-700">Required</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li>• Temperature (°C)</li>
                    <li>• Product Type</li>
                    <li>• Historical Sales (kg)</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-sm transition-all">
                  <p className="font-medium text-gray-700">Optional</p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    <li>• Humidity (%)</li>
                    <li>• Number of Guests</li>
                    <li>• Food Quantity (kg)</li>
                    <li>• Storage Conditions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex justify-center">
            <Link 
              href="/restaurant" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-green-500 rounded-lg overflow-hidden shadow-lg hover:bg-green-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <span className="relative flex items-center">
                <FaUtensils className="mr-2" />
                <span>Go to Restaurant Prediction Tool</span>
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="text-green-500 mr-2">💡</span>
            Why Reduce Food Waste?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all">
              <h3 className="text-lg font-medium text-green-600 mb-2">Environmental Impact</h3>
              <p className="text-gray-600">Food waste in landfills produces methane, a greenhouse gas 25 times more potent than CO2. Reducing waste helps combat climate change.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all">
              <h3 className="text-lg font-medium text-green-600 mb-2">Economic Benefits</h3>
              <p className="text-gray-600">Restaurants can save up to 10% on food costs by implementing effective waste reduction strategies.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all">
              <h3 className="text-lg font-medium text-green-600 mb-2">Social Responsibility</h3>
              <p className="text-gray-600">With millions facing food insecurity, reducing waste and donating excess food can make a significant social impact.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
