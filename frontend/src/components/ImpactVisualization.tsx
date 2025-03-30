"use client"

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

export default function ImpactVisualization() {
  // Sample data for food waste impact
  const wasteData = [
    { name: 'Current Average', value: 100, color: '#ef4444' }, // Red-500
    { name: 'With Optimization', value: 70, color: '#22c55e' }, // Green-500
  ];

  // Sample data for CO2 impact
  const co2Data = [
    { name: 'Current CO2', value: 250, color: '#ef4444' }, // Red-500
    { name: 'Potential Savings', value: 75, color: '#22c55e' }, // Green-500
  ];

  // Sample data for financial impact
  const financialData = [
    { name: 'Current Cost', value: 5000, color: '#ef4444' }, // Red-500
    { name: 'Potential Savings', value: 1500, color: '#22c55e' }, // Green-500
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Impact of Food Waste Reduction</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Food Waste Reduction */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Food Waste Reduction</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={wasteData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} kg`, 'Food Waste']}
                contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem' }}
              />
              <Bar dataKey="value" name="Food Waste (kg)">
                {wasteData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-gray-600 text-sm mt-2 text-center">
            Reduce food waste by up to 30%
          </p>
        </div>
        
        {/* CO2 Emissions Impact */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">CO2 Emissions Saved</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={co2Data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {co2Data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} kg`, 'CO2']} />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-gray-600 text-sm mt-2 text-center">
            Save up to 75kg of CO2 emissions per week
          </p>
        </div>
        
        {/* Financial Impact */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Financial Impact</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={financialData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Amount']}
                contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem' }}
              />
              <Bar dataKey="value" name="Amount ($)">
                {financialData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-gray-600 text-sm mt-2 text-center">
            Save up to $1,500 annually on food costs
          </p>
        </div>
      </div>
    </div>
  );
}
