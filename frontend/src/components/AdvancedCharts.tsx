"use client"

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import type { PredictionResponse } from '@/services/foodWasteService';

interface AdvancedChartsProps {
  prediction: PredictionResponse;
}

export default function AdvancedCharts({ prediction }: AdvancedChartsProps) {
  // Calculate utilized food amount
  const utilizedFood = prediction.utilization_rate 
    ? Math.round(prediction.utilization_rate * 400) 
    : 400 - prediction.prediction;

  // Data for utilization chart
  const utilizationData = [
    { name: 'Utilized', value: utilizedFood, color: '#22c55e' }, // Green-500
    { name: 'Waste', value: prediction.prediction, color: '#ef4444' }, // Red-500
  ];

  // Data for CO2 comparison chart
  const co2Data = [
    { name: 'Current', value: prediction.co2_saved, color: '#ef4444' }, // Red-500
    { name: 'Target (-30%)', value: Math.round(prediction.co2_saved * 0.7), color: '#22c55e' }, // Green-500
  ];

  // Data for waste reduction over time (simulated)
  const wasteReductionData = [
    { week: 'Week 1', waste: prediction.prediction, target: prediction.prediction },
    { week: 'Week 2', waste: Math.round(prediction.prediction * 0.95), target: Math.round(prediction.prediction * 0.9) },
    { week: 'Week 3', waste: Math.round(prediction.prediction * 0.9), target: Math.round(prediction.prediction * 0.85) },
    { week: 'Week 4', waste: Math.round(prediction.prediction * 0.85), target: Math.round(prediction.prediction * 0.8) },
    { week: 'Week 5', waste: Math.round(prediction.prediction * 0.8), target: Math.round(prediction.prediction * 0.75) },
    { week: 'Week 6', waste: Math.round(prediction.prediction * 0.75), target: Math.round(prediction.prediction * 0.7) },
  ];

  // Calculate potential savings
  const potentialSavings = Math.round(prediction.prediction * 0.3 * 5); // Assuming $5 per kg

  // Data for financial impact
  const financialData = [
    { name: 'Current Cost', value: Math.round(prediction.prediction * 5), color: '#ef4444' }, // Red-500
    { name: 'Potential Savings', value: potentialSavings, color: '#22c55e' }, // Green-500
    { name: 'Target Cost', value: Math.round(prediction.prediction * 5) - potentialSavings, color: '#3b82f6' }, // Blue-500
  ];

  // COLORS
  const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#eab308'];
  
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Advanced Data Insights</h2>
      
      {/* Food Utilization vs. Waste */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Food Utilization vs. Waste</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={utilizationData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip 
              formatter={(value) => [`${value} kg`, 'Amount']}
              contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem' }}
            />
            <Legend />
            <Bar dataKey="value" name="Amount (kg)">
              {utilizationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CO2 Emissions Impact */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">CO2 Emissions Impact</h3>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={co2Data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {co2Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} kg`, 'CO2 Emissions']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="space-y-4">
              <div>
                <p className="text-gray-600 text-sm">Current CO2 Emissions:</p>
                <p className="text-2xl font-bold text-red-500">{prediction.co2_saved} kg</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Target CO2 Emissions (-30%):</p>
                <p className="text-2xl font-bold text-green-500">{Math.round(prediction.co2_saved * 0.7)} kg</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Potential CO2 Reduction:</p>
                <p className="text-2xl font-bold text-blue-500">{Math.round(prediction.co2_saved * 0.3)} kg</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Waste Reduction Projection */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Waste Reduction Projection</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={wasteReductionData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} kg`, 'Waste']}
              contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem' }}
            />
            <Legend />
            <Line type="monotone" dataKey="waste" name="Projected Waste" stroke="#ef4444" strokeWidth={2} />
            <Line type="monotone" dataKey="target" name="Target Waste" stroke="#22c55e" strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Financial Impact */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Financial Impact</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={financialData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Amount']}
              contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem' }}
            />
            <Legend />
            <Bar dataKey="value" name="Amount ($)">
              {financialData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-green-800">
            <span className="font-bold">Potential Annual Savings: </span>
            ${potentialSavings * 52} by implementing the recommended waste reduction strategies
          </p>
        </div>
      </div>
    </div>
  );
}
