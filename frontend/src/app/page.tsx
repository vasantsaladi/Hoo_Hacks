"use client"

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center">
            <span className="text-green-400 mr-2">🌱</span>
            Food Waste Predictor
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Optimize your inventory and reduce food waste
          </p>
        </header>
        
        <div className="bg-gray-800 p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Restaurant Food Waste Prediction Model</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Required Information</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2 text-xl">•</span>
                  <span><strong>Temperature</strong> (in Celsius)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2 text-xl">•</span>
                  <span><strong>Product Type</strong> (e.g., dairy, produce, bakery)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2 text-xl">•</span>
                  <span><strong>Historical Sales Volume</strong> (in kg)</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Optional Information</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2 text-xl">•</span>
                  <span><strong>Humidity</strong> percentage</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2 text-xl">•</span>
                  <span><strong>Number of Guests</strong> (for restaurants)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2 text-xl">•</span>
                  <span><strong>Quantity of Food</strong> prepared (in kg)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2 text-xl">•</span>
                  <span><strong>Storage Conditions</strong> (e.g., Refrigerated, Room Temperature)</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-white mb-4">Our Model Focuses On</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <h4 className="font-medium text-green-400 text-lg flex items-center">
                  <span className="mr-2">🌡️</span>
                  Environmental Factors
                </h4>
                <p className="text-gray-300 mt-2">Temperature, humidity, and seasonal variations</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <h4 className="font-medium text-green-400 text-lg flex items-center">
                  <span className="mr-2">🥕</span>
                  Food Characteristics
                </h4>
                <p className="text-gray-300 mt-2">Product type, storage conditions, and shelf life</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <h4 className="font-medium text-green-400 text-lg flex items-center">
                  <span className="mr-2">🍽️</span>
                  Restaurant Metrics
                </h4>
                <p className="text-gray-300 mt-2">Number of guests, quantity of food prepared</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <h4 className="font-medium text-green-400 text-lg flex items-center">
                  <span className="mr-2">📊</span>
                  Historical Data
                </h4>
                <p className="text-gray-300 mt-2">Previous sales volumes and waste patterns</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex justify-center">
            <Link 
              href="/restaurant" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-600 to-green-500 rounded-lg overflow-hidden shadow-lg hover:from-green-500 hover:to-green-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center">
                <span className="mr-2 text-xl">🔍</span>
                <span>Go to Restaurant Prediction Tool</span>
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="text-green-400 mr-2">💡</span>
            Why Reduce Food Waste?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-400 mb-2">Environmental Impact</h3>
              <p className="text-gray-300">Food waste in landfills produces methane, a greenhouse gas 25 times more potent than CO2. Reducing waste helps combat climate change.</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-400 mb-2">Economic Benefits</h3>
              <p className="text-gray-300">Restaurants can save up to 10% on food costs by implementing effective waste reduction strategies.</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-400 mb-2">Social Responsibility</h3>
              <p className="text-gray-300">With millions facing food insecurity, reducing waste and donating excess food can make a significant social impact.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
