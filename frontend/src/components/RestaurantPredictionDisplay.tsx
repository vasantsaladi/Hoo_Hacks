"use client"

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import AdvancedDataScienceCharts from './AdvancedDataScienceCharts';

interface RestaurantPredictionDisplayProps {
  predictionData: {
    food_type: string;
    total_food: number;
    waste_amount: number;
    waste_percentage: number;
    co2_emissions: number;
    recommendations: string[];
    utilization_rate: number;
  };
}

export default function RestaurantPredictionDisplay({ predictionData }: RestaurantPredictionDisplayProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [financialImpact, setFinancialImpact] = useState({
    wastedCost: 0,
    potentialSavings: 0,
    annualWaste: 0,
    annualSavings: 0
  });

  // Calculate financial impact
  useEffect(() => {
    // Assuming average cost of $5 per kg of food
    const avgCostPerKg = 5;
    const wastedCost = predictionData.waste_amount * avgCostPerKg;
    const potentialSavings = wastedCost * 0.3; // Assuming 30% reduction potential
    
    // Annual projections (52 weeks)
    const annualWaste = wastedCost * 52;
    const annualSavings = potentialSavings * 52;
    
    setFinancialImpact({
      wastedCost: parseFloat(wastedCost.toFixed(2)),
      potentialSavings: parseFloat(potentialSavings.toFixed(2)),
      annualWaste: parseFloat(annualWaste.toFixed(2)),
      annualSavings: parseFloat(annualSavings.toFixed(2))
    });
  }, [predictionData]);

  // Data for Food Utilization vs. Waste Bar Chart
  const utilizationData = [
    { name: 'Utilized', value: predictionData.total_food - predictionData.waste_amount, color: '#22c55e' },
    { name: 'Waste', value: predictionData.waste_amount, color: '#ef4444' }
  ];

  // Data for CO2 Emissions Pie Chart
  const emissionsData = [
    { name: 'Current', value: predictionData.co2_emissions, color: '#ef4444' },
    { name: 'Target (-30%)', value: predictionData.co2_emissions * 0.3, color: '#22c55e' }
  ];

  // Data for Financial Impact Bar Chart
  const financialData = [
    { name: 'Current Cost', value: financialImpact.wastedCost, color: '#ef4444' },
    { name: 'Potential Savings', value: financialImpact.potentialSavings, color: '#22c55e' }
  ];

  // Limit recommendations to top 3
  const topRecommendations = predictionData.recommendations.slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Restaurant Prediction Results
        </h2>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'recommendations'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'analytics'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Detailed Analytics
          </button>
        </nav>
      </div>

      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics and CO2 Emissions - Moved to top */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Key Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Food Type:</span>
                    <span className="font-medium text-gray-800">{predictionData.food_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Food:</span>
                    <span className="font-medium text-gray-800">{predictionData.total_food} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Waste Amount:</span>
                    <span className="font-medium text-red-500">{predictionData.waste_amount} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Waste Percentage:</span>
                    <span className="font-medium text-red-500">{predictionData.waste_percentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">CO2 Emissions:</span>
                    <span className="font-medium text-gray-800">{predictionData.co2_emissions} kg</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">CO2 Emissions Impact</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={emissionsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {emissionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} kg`, 'CO2']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm text-green-800">
                    Potential CO2 Reduction: {(predictionData.co2_emissions * 0.3).toFixed(2)} kg by implementing recommendations
                  </p>
                </div>
              </div>
            </div>

            {/* Food Utilization Chart */}
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Food Utilization vs. Waste</h3>
              <p className="text-sm text-gray-500 mb-4">Utilization Rate: {predictionData.utilization_rate}%</p>
              <div className="h-64 bg-white">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={utilizationData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kg`, 'Amount']} />
                    <Bar dataKey="value" name="Amount (kg)">
                      {utilizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Recommended Actions</h3>
            
            {topRecommendations.map((recommendation, index) => (
              <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-sm transition-all">
                <p className="text-gray-700">{recommendation}</p>
              </div>
            ))}
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Implementation Timeline</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Immediate: Adjust ordering and storage practices</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Short-term: Implement inventory tracking system</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Long-term: Develop partnerships for food donation</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Financial Impact - Moved from Overview to Detailed Analytics */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Financial Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-500">Current Waste Cost</p>
                  <p className="text-2xl font-bold text-red-500">${financialImpact.wastedCost}</p>
                  <p className="text-xs text-gray-500">per week</p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-500">Potential Savings</p>
                  <p className="text-2xl font-bold text-green-500">${financialImpact.potentialSavings}</p>
                  <p className="text-xs text-gray-500">per week</p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-500">Annual Waste Cost</p>
                  <p className="text-2xl font-bold text-red-500">${financialImpact.annualWaste}</p>
                  <p className="text-xs text-gray-500">projected</p>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <p className="text-sm text-gray-500">Annual Savings</p>
                  <p className="text-2xl font-bold text-green-500">${financialImpact.annualSavings}</p>
                  <p className="text-xs text-gray-500">projected</p>
                </div>
              </div>
            </div>

            {/* Advanced Data Science Charts */}
            <AdvancedDataScienceCharts predictionData={predictionData} />

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Detailed Financial Analysis</h3>
              
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-700 mb-2">Weekly Financial Impact</h4>
                <div className="h-64 bg-white">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={financialData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                      <Bar dataKey="value" name="Amount ($)">
                        {financialData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-700 mb-2">Improvement Potential</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600">Current Waste Cost</p>
                      <p className="text-xl font-bold text-red-500">${financialImpact.wastedCost}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Target (-30%)</p>
                      <p className="text-xl font-bold text-green-500">${(financialImpact.wastedCost * 0.7).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600">Current Annual Cost</p>
                      <p className="text-xl font-bold text-red-500">${financialImpact.annualWaste}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Target (-30%)</p>
                      <p className="text-xl font-bold text-green-500">${(financialImpact.annualWaste * 0.7).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-md font-medium text-green-800 mb-2">Return on Investment Analysis</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">5-Year Savings</p>
                    <p className="text-xl font-bold text-green-600">${(financialImpact.annualSavings * 5).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Average Monthly Savings</p>
                    <p className="text-xl font-bold text-green-600">${(financialImpact.annualSavings / 12).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Payback Period</p>
                    <p className="text-xl font-bold text-blue-600">~3 months</p>
                  </div>
                </div>
                <p className="mt-4 text-green-800">
                  Implementing these recommendations could yield a 280% return on investment within the first year.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
