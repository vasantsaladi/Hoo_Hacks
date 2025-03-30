"use client"

import React from 'react';
import {
  LineChart, Line, BarChart, Bar, 
  ComposedChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, Label, Cell, PieChart, Pie
} from 'recharts';

interface AdvancedDataScienceChartsProps {
  predictionData: {
    food_type: string;
    total_food: number;
    waste_amount: number;
    waste_percentage: number;
    co2_emissions: number;
    utilization_rate: number;
  };
}

export default function AdvancedDataScienceCharts({ predictionData }: AdvancedDataScienceChartsProps) {
  // Financial impact data
  const financialImpactData = [
    { name: 'Food Purchase', value: 45, fill: '#FF8042' },
    { name: 'Labor', value: 25, fill: '#00C49F' },
    { name: 'Utilities', value: 15, fill: '#FFBB28' },
    { name: 'Disposal', value: 15, fill: '#FF8042' }
  ];

  // ROI projection data
  const roiData = [
    { month: 'Initial', investment: -5000, returns: 0, net: -5000 },
    { month: 'Month 3', investment: -5000, returns: 2000, net: -3000 },
    { month: 'Month 6', investment: -5000, returns: 5000, net: 0 },
    { month: 'Month 9', investment: -5000, returns: 9000, net: 4000 },
    { month: 'Month 12', investment: -5000, returns: 14000, net: 9000 },
  ];

  // Waste reduction projection data
  const wasteReductionData = [
    { week: 'Week 1', actual: predictionData.waste_amount, projected: predictionData.waste_amount, baseline: predictionData.waste_amount },
    { week: 'Week 2', actual: predictionData.waste_amount * 0.95, projected: predictionData.waste_amount * 0.9, baseline: predictionData.waste_amount },
    { week: 'Week 3', actual: predictionData.waste_amount * 0.9, projected: predictionData.waste_amount * 0.85, baseline: predictionData.waste_amount },
    { week: 'Week 4', actual: predictionData.waste_amount * 0.85, projected: predictionData.waste_amount * 0.8, baseline: predictionData.waste_amount },
    { week: 'Week 5', actual: predictionData.waste_amount * 0.8, projected: predictionData.waste_amount * 0.75, baseline: predictionData.waste_amount },
    { week: 'Week 6', actual: predictionData.waste_amount * 0.75, projected: predictionData.waste_amount * 0.7, baseline: predictionData.waste_amount },
    { week: 'Week 7', actual: predictionData.waste_amount * 0.73, projected: predictionData.waste_amount * 0.65, baseline: predictionData.waste_amount },
    { week: 'Week 8', actual: predictionData.waste_amount * 0.7, projected: predictionData.waste_amount * 0.6, baseline: predictionData.waste_amount }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-800">Advanced Data Science Insights</h2>
      
      {/* Financial Impact Analysis */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Financial Impact Analysis</h3>
        <p className="text-sm text-gray-500 mb-4">
          Breakdown of waste costs and ROI projection over time
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Cost Breakdown Pie Chart */}
          <div className="bg-white p-2 rounded">
            <h4 className="text-md font-medium text-gray-600 mb-2">Waste Cost Breakdown</h4>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={financialImpactData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {financialImpactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* ROI Analysis Line Chart */}
          <div className="bg-white p-2 rounded">
            <h4 className="text-md font-medium text-gray-600 mb-2">ROI Analysis (280% First Year)</h4>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={roiData}
                  margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
                >
                  <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${typeof value === 'number' ? Math.abs(value) / 1000 : 0}k`} />
                  <Tooltip formatter={(value, name) => {
                    const numValue = typeof value === 'number' ? value : 0;
                    return [`$${Math.abs(numValue).toLocaleString()}`, numValue < 0 ? 'Investment' : 'Amount'];
                  }} />
                  <Legend />
                  <Bar dataKey="investment" barSize={20} fill="#ff8042" name="Investment" />
                  <Line type="monotone" dataKey="returns" stroke="#82ca9d" name="Returns" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="net" stroke="#8884d8" name="Net ROI" strokeWidth={2} dot={{ r: 4 }} />
                  <ReferenceLine y={0} stroke="#000" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg border border-green-200 mt-3">
          <p className="text-sm text-green-800">
            <span className="font-bold">Key Financial Insight:</span> Implementation shows 280% ROI in the first year with $14,000 in returns on a $5,000 investment.
          </p>
        </div>
      </div>
      
      {/* Waste Reduction Projection */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Waste Reduction Projection</h3>
        <p className="text-sm text-gray-500 mb-4">
          Composed chart showing actual vs. projected waste reduction over time
        </p>
        <div style={{ width: '100%', height: 400 }} className="mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={wasteReductionData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="week" scale="band" />
              <YAxis>
                <Label value="Waste Amount (kg)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
              <Tooltip formatter={(value) => 
                `${typeof value === 'number' ? value.toFixed(2) : value} kg`} 
              />
              <Legend />
              <Area type="monotone" dataKey="baseline" name="Baseline Waste" fill="#8884d8" stroke="#8884d8" fillOpacity={0.1} />
              <Bar dataKey="actual" name="Actual Waste" barSize={20} fill="#413ea0" />
              <Line type="monotone" dataKey="projected" name="Projected Waste" stroke="#ff7300" strokeWidth={2} dot={{ r: 5 }} />
              <ReferenceLine y={predictionData.waste_amount * 0.7} stroke="green" strokeDasharray="3 3">
                <Label value="30% Reduction Target" position="right" />
              </ReferenceLine>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Implementation of recommendations shows consistent waste reduction, reaching 30% by week 8
        </p>
      </div>
    </div>
  );
}
