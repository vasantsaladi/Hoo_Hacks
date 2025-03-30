// Import React and other necessary libraries
import React from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, LineChart, BarChart, PieChart, ComposedChart, ScatterChart,
  Line, Bar, Pie, Cell, Area, Scatter,
  XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ReferenceLine
} from 'recharts';
import { FaLeaf } from 'react-icons/fa';

// Define TypeScript interfaces for component props
interface FinancialImpact {
  wastedCost: number;
  annualWastedCost: number;
  monthlySavings: number;
  annualSavings: number;
  fiveYearSavings: number;
  roi: number;
  paybackPeriod: number;
}

interface PredictionDisplayProps {
  activeTab: string;
  predictionData: {
    foodType: string;
    predictedWaste: number;
    co2Saved: number;
    utilizationRate: number;
    financialImpact: FinancialImpact;
    recommendations: string[];
  };
}

// Add a financial forecast chart component
const FinancialForecastChart = ({ financialImpact }: { financialImpact: FinancialImpact }) => {
  // Generate monthly forecast data for 24 months
  const generateForecastData = () => {
    const data = [];
    const monthlyWaste = financialImpact.wastedCost * 4; // 4 weeks per month
    const monthlyOptimized = monthlyWaste * 0.7; // 30% reduction
    
    // Initial values
    let cumulativeSavings = 0;
    let currentWaste = monthlyWaste;
    
    // Generate 24 months of data
    for (let i = 1; i <= 24; i++) {
      // Gradually improve optimization over time
      const optimizationFactor = Math.min(0.3 + (i * 0.01), 0.5); // Max 50% reduction
      const optimizedWaste = monthlyWaste * (1 - optimizationFactor);
      
      // Calculate monthly savings
      const monthlySavings = currentWaste - optimizedWaste;
      cumulativeSavings += monthlySavings;
      
      // Add data point
      data.push({
        month: i,
        currentWaste: currentWaste.toFixed(2),
        optimizedWaste: optimizedWaste.toFixed(2),
        monthlySavings: monthlySavings.toFixed(2),
        cumulativeSavings: cumulativeSavings.toFixed(2)
      });
      
      // Gradually reduce current waste as practices improve
      currentWaste = Math.max(currentWaste * 0.98, optimizedWaste);
    }
    
    return data;
  };
  
  const forecastData = generateForecastData();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">24-Month Financial Forecast</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={forecastData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} 
            />
            <YAxis 
              yAxisId="left"
              label={{ value: 'Monthly Cost ($)', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              label={{ value: 'Cumulative Savings ($)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip formatter={(value: number | string, name: string) => {
              if (name === 'cumulativeSavings') return [`$${value}`, 'Cumulative Savings'];
              if (name === 'monthlySavings') return [`$${value}`, 'Monthly Savings'];
              if (name === 'currentWaste') return [`$${value}`, 'Current Waste Cost'];
              if (name === 'optimizedWaste') return [`$${value}`, 'Optimized Waste Cost'];
              return [value, name];
            }} />
            <Legend />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="currentWaste" 
              name="Current Waste Cost" 
              fill="#ef4444" 
              stroke="#ef4444" 
              fillOpacity={0.3} 
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="optimizedWaste" 
              name="Optimized Waste Cost" 
              fill="#10b981" 
              stroke="#10b981" 
              fillOpacity={0.3} 
            />
            <Bar 
              yAxisId="left"
              dataKey="monthlySavings" 
              name="Monthly Savings" 
              fill="#3b82f6" 
              barSize={10} 
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="cumulativeSavings" 
              name="Cumulative Savings" 
              stroke="#8b5cf6" 
              strokeWidth={2} 
              dot={{ r: 1 }} 
              activeDot={{ r: 5 }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-sm text-center text-gray-600">
        This forecast shows how monthly waste costs decrease over time as optimization practices improve,
        with cumulative savings reaching ${forecastData[forecastData.length - 1].cumulativeSavings} after 24 months.
      </p>
    </div>
  );
};

// Add a seasonal waste pattern chart
const SeasonalWastePatternChart = ({ financialImpact }: { financialImpact: FinancialImpact }) => {
  // Generate seasonal data
  const seasonalData = [
    { month: 'Jan', waste: financialImpact.wastedCost * 4 * 1.2, season: 'Winter' },
    { month: 'Feb', waste: financialImpact.wastedCost * 4 * 1.1, season: 'Winter' },
    { month: 'Mar', waste: financialImpact.wastedCost * 4 * 1.0, season: 'Spring' },
    { month: 'Apr', waste: financialImpact.wastedCost * 4 * 0.9, season: 'Spring' },
    { month: 'May', waste: financialImpact.wastedCost * 4 * 0.8, season: 'Spring' },
    { month: 'Jun', waste: financialImpact.wastedCost * 4 * 0.9, season: 'Summer' },
    { month: 'Jul', waste: financialImpact.wastedCost * 4 * 1.0, season: 'Summer' },
    { month: 'Aug', waste: financialImpact.wastedCost * 4 * 1.1, season: 'Summer' },
    { month: 'Sep', waste: financialImpact.wastedCost * 4 * 1.0, season: 'Fall' },
    { month: 'Oct', waste: financialImpact.wastedCost * 4 * 1.1, season: 'Fall' },
    { month: 'Nov', waste: financialImpact.wastedCost * 4 * 1.3, season: 'Fall' },
    { month: 'Dec', waste: financialImpact.wastedCost * 4 * 1.5, season: 'Winter' }
  ];
  
  // Calculate seasonal averages
  const seasonalAverages = {
    Winter: (seasonalData.filter(d => d.season === 'Winter').reduce((sum, item) => sum + item.waste, 0) / 
             seasonalData.filter(d => d.season === 'Winter').length).toFixed(2),
    Spring: (seasonalData.filter(d => d.season === 'Spring').reduce((sum, item) => sum + item.waste, 0) / 
             seasonalData.filter(d => d.season === 'Spring').length).toFixed(2),
    Summer: (seasonalData.filter(d => d.season === 'Summer').reduce((sum, item) => sum + item.waste, 0) / 
             seasonalData.filter(d => d.season === 'Summer').length).toFixed(2),
    Fall: (seasonalData.filter(d => d.season === 'Fall').reduce((sum, item) => sum + item.waste, 0) / 
           seasonalData.filter(d => d.season === 'Fall').length).toFixed(2)
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Seasonal Waste Pattern Analysis</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={seasonalData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis label={{ value: 'Monthly Waste Cost ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number | string, name: string) => {
              if (typeof value === 'number') {
                return [`$${value.toFixed(2)}`, name === 'waste' ? 'Waste Cost' : name];
              }
              return [value, name];
            }} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="waste" 
              name="Waste Cost" 
              fill="#f97316" 
              stroke="#f97316" 
              fillOpacity={0.6} 
            />
            <ReferenceLine y={Number(seasonalAverages.Winter)} stroke="#0ea5e9" strokeDasharray="3 3" label={{ value: 'Winter Avg', position: 'right', fill: '#0ea5e9' }} />
            <ReferenceLine y={Number(seasonalAverages.Spring)} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Spring Avg', position: 'right', fill: '#10b981' }} />
            <ReferenceLine y={Number(seasonalAverages.Summer)} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Summer Avg', position: 'right', fill: '#f59e0b' }} />
            <ReferenceLine y={Number(seasonalAverages.Fall)} stroke="#8b5cf6" strokeDasharray="3 3" label={{ value: 'Fall Avg', position: 'right', fill: '#8b5cf6' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <h5 className="text-sm font-medium text-blue-700">Winter Average</h5>
          <p className="text-xl font-bold text-blue-600">${seasonalAverages.Winter}</p>
          <p className="text-xs text-blue-600 mt-1">Holiday season impact</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <h5 className="text-sm font-medium text-green-700">Spring Average</h5>
          <p className="text-xl font-bold text-green-600">${seasonalAverages.Spring}</p>
          <p className="text-xs text-green-600 mt-1">Lowest waste period</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <h5 className="text-sm font-medium text-yellow-700">Summer Average</h5>
          <p className="text-xl font-bold text-yellow-600">${seasonalAverages.Summer}</p>
          <p className="text-xs text-yellow-600 mt-1">Tourist season impact</p>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <h5 className="text-sm font-medium text-purple-700">Fall Average</h5>
          <p className="text-xl font-bold text-purple-600">${seasonalAverages.Fall}</p>
          <p className="text-xs text-purple-600 mt-1">Pre-holiday increase</p>
        </div>
      </div>
    </div>
  );
};

// Add a cost-benefit analysis chart
const CostBenefitAnalysisChart = ({ financialImpact }: { financialImpact: FinancialImpact }) => {
  // Generate investment scenario data
  const scenarioData = [
    { 
      name: 'Basic',
      investment: 1000,
      savings: financialImpact.annualSavings * 0.6,
      roi: (financialImpact.annualSavings * 0.6 / 1000 * 100).toFixed(0),
      payback: (1000 / (financialImpact.annualSavings * 0.6 / 12)).toFixed(1)
    },
    { 
      name: 'Standard',
      investment: 2500,
      savings: financialImpact.annualSavings * 1.0,
      roi: (financialImpact.annualSavings * 1.0 / 2500 * 100).toFixed(0),
      payback: (2500 / (financialImpact.annualSavings * 1.0 / 12)).toFixed(1)
    },
    { 
      name: 'Premium',
      investment: 5000,
      savings: financialImpact.annualSavings * 1.5,
      roi: (financialImpact.annualSavings * 1.5 / 5000 * 100).toFixed(0),
      payback: (5000 / (financialImpact.annualSavings * 1.5 / 12)).toFixed(1)
    },
    { 
      name: 'Enterprise',
      investment: 10000,
      savings: financialImpact.annualSavings * 2.2,
      roi: (financialImpact.annualSavings * 2.2 / 10000 * 100).toFixed(0),
      payback: (10000 / (financialImpact.annualSavings * 2.2 / 12)).toFixed(1)
    }
  ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-800">Investment Scenario Analysis</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="investment" 
              name="Investment" 
              unit="$"
              label={{ value: 'Initial Investment ($)', position: 'insideBottomRight', offset: -5 }} 
            />
            <YAxis 
              type="number" 
              dataKey="savings" 
              name="Annual Savings" 
              unit="$"
              label={{ value: 'Annual Savings ($)', angle: -90, position: 'insideLeft' }} 
            />
            <ZAxis 
              type="number" 
              dataKey="roi" 
              range={[50, 400]} 
              name="ROI" 
              unit="%" 
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value: number | string, name: string) => {
                if (name === 'Investment' && typeof value === 'number') return [`$${value}`, name];
                if (name === 'Annual Savings' && typeof value === 'number') return [`$${value}`, name];
                if (name === 'ROI' && typeof value === 'number') return [`${value}%`, name];
                return [value, name];
              }}
              content={({ active, payload }: { active?: boolean, payload?: any[] }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
                      <p className="font-medium text-gray-700">{data.name} Package</p>
                      <p className="text-sm text-gray-600">Investment: <span className="font-medium">${data.investment}</span></p>
                      <p className="text-sm text-gray-600">Annual Savings: <span className="font-medium">${data.savings}</span></p>
                      <p className="text-sm text-gray-600">ROI: <span className="font-medium">{data.roi}%</span></p>
                      <p className="text-sm text-gray-600">Payback: <span className="font-medium">{data.payback} months</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Scatter 
              name="Investment Scenarios" 
              data={scenarioData} 
              fill="#8884d8"
              shape={(props: any) => {
                const { cx, cy, payload } = props;
                const size = (Number(payload.roi) / 50) * 10 + 15;
                
                return (
                  <g>
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={size} 
                      fill={
                        payload.name === 'Basic' ? '#f97316' :
                        payload.name === 'Standard' ? '#10b981' :
                        payload.name === 'Premium' ? '#3b82f6' :
                        '#8b5cf6'
                      } 
                      fillOpacity={0.6} 
                    />
                    <text 
                      x={cx} 
                      y={cy} 
                      textAnchor="middle" 
                      fill="#fff" 
                      fontSize={12} 
                      fontWeight="bold" 
                      dy=".3em"
                    >
                      {payload.name}
                    </text>
                  </g>
                );
              }}
            />
            <ReferenceLine 
              x={0} 
              stroke="#666" 
            />
            <ReferenceLine 
              y={0} 
              stroke="#666" 
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-sm text-center text-gray-600">
        Bubble size represents ROI percentage. The Standard package offers the optimal balance of investment and returns.
      </p>
    </div>
  );
};

// Add a financial impact dashboard component
const FinancialImpactDashboard = ({ financialImpact }: { financialImpact: FinancialImpact }) => {
  // Prepare data for the ROI chart
  const roiData = [
    { name: 'Year 1', roi: 280 },
    { name: 'Year 2', roi: 420 },
    { name: 'Year 3', roi: 560 },
    { name: 'Year 4', roi: 700 },
    { name: 'Year 5', roi: 780 }
  ];

  // Prepare data for the cost breakdown chart
  const costBreakdownData = [
    { name: 'Food Purchase', value: financialImpact.wastedCost * 0.6 },
    { name: 'Labor', value: financialImpact.wastedCost * 0.2 },
    { name: 'Utilities', value: financialImpact.wastedCost * 0.1 },
    { name: 'Disposal', value: financialImpact.wastedCost * 0.1 }
  ];

  // Prepare data for the savings projection chart
  const savingsProjectionData = [
    { name: 'Month 1', current: financialImpact.wastedCost * 4, optimized: financialImpact.wastedCost * 4 * 0.85 },
    { name: 'Month 2', current: financialImpact.wastedCost * 4, optimized: financialImpact.wastedCost * 4 * 0.8 },
    { name: 'Month 3', current: financialImpact.wastedCost * 4, optimized: financialImpact.wastedCost * 4 * 0.75 },
    { name: 'Month 6', current: financialImpact.wastedCost * 4, optimized: financialImpact.wastedCost * 4 * 0.7 }
  ];

  return (
    <div className="space-y-6">
      {/* Financial Impact Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          whileHover={{ y: -5, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        >
          <h4 className="text-sm font-medium text-gray-500">Weekly Waste Cost</h4>
          <p className="text-2xl font-bold text-red-500">${financialImpact.wastedCost.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <span>Based on current operations</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          whileHover={{ y: -5, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        >
          <h4 className="text-sm font-medium text-gray-500">Potential Savings</h4>
          <p className="text-2xl font-bold text-green-500">${financialImpact.monthlySavings.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>30% reduction potential</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          whileHover={{ y: -5, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        >
          <h4 className="text-sm font-medium text-gray-500">Annual Waste Cost</h4>
          <p className="text-2xl font-bold text-red-500">${financialImpact.annualWastedCost.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Projected for 52 weeks</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
          whileHover={{ y: -5, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        >
          <h4 className="text-sm font-medium text-gray-500">Annual Savings</h4>
          <p className="text-2xl font-bold text-green-500">${financialImpact.annualSavings.toFixed(2)}</p>
          <div className="mt-2 flex items-center text-xs text-gray-500">
            <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Potential annual impact</span>
          </div>
        </motion.div>
      </div>
      
      {/* ROI Analysis */}
      <motion.div 
        className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
        whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <h3 className="text-lg font-medium text-gray-800 mb-4">Return on Investment Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={roiData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 1000]} label={{ value: 'ROI %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number | string) => {
                    if (typeof value === 'number') {
                      return [`${value}%`, 'ROI'];
                    }
                    return [value];
                  }} />
                  <Legend />
                  <Line type="monotone" dataKey="roi" stroke="#10b981" strokeWidth={2} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-700">Implementation Cost</h4>
                <p className="text-2xl font-bold text-green-600">$2,500</p>
                <p className="text-xs text-green-600 mt-1">One-time investment in training and systems</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-700">Payback Period</h4>
                <p className="text-2xl font-bold text-blue-600">3.7 months</p>
                <p className="text-xs text-blue-600 mt-1">Time to recover initial investment</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-purple-700">5-Year ROI</h4>
                <p className="text-2xl font-bold text-purple-600">780%</p>
                <p className="text-xs text-purple-600 mt-1">Total return on investment over 5 years</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Cost Breakdown and Savings Projection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost Breakdown */}
        <motion.div 
          className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
          whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        >
          <h3 className="text-lg font-medium text-gray-800 mb-4">Waste Cost Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {costBreakdownData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === 0 ? '#ef4444' : index === 1 ? '#f59e0b' : index === 2 ? '#3b82f6' : '#8b5cf6'} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number | string) => {
                  if (typeof value === 'number') {
                    return [`$${value.toFixed(2)}`, 'Cost'];
                  }
                  return [value];
                }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-center text-gray-600 mt-3">
            Food purchase costs represent the largest portion of waste expenses
          </p>
        </motion.div>
        
        {/* Savings Projection */}
        <motion.div 
          className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
          whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        >
          <h3 className="text-lg font-medium text-gray-800 mb-4">Monthly Savings Projection</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={savingsProjectionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number | string) => {
                  if (typeof value === 'number') {
                    return [`$${value.toFixed(2)}`, 'Cost'];
                  }
                  return [value];
                }} />
                <Legend />
                <Bar dataKey="current" name="Current Cost" fill="#ef4444" />
                <Bar dataKey="optimized" name="Optimized Cost" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-center text-gray-600 mt-3">
            Projected monthly costs with optimization vs. current operations
          </p>
        </motion.div>
      </div>
      
      {/* Financial Forecast Chart */}
      <motion.div 
        className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
        whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <FinancialForecastChart financialImpact={financialImpact} />
      </motion.div>
      
      {/* Seasonal Waste Pattern Chart */}
      <motion.div 
        className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
        whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <SeasonalWastePatternChart financialImpact={financialImpact} />
      </motion.div>
      
      {/* Cost-Benefit Analysis Chart */}
      <motion.div 
        className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
        whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <CostBenefitAnalysisChart financialImpact={financialImpact} />
      </motion.div>
      
      {/* Financial Benefits Table */}
      <motion.div 
        className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
        whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      >
        <h3 className="text-lg font-medium text-gray-800 mb-4">Financial Benefits Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benefit Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Impact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Impact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">5-Year Impact</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Direct Cost Savings</div>
                      <div className="text-xs text-gray-500">Reduced food purchase costs</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(financialImpact.monthlySavings * 4).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${financialImpact.annualSavings.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(financialImpact.annualSavings * 5).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Labor Efficiency</div>
                      <div className="text-xs text-gray-500">Reduced prep and handling time</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(financialImpact.monthlySavings * 0.5).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(financialImpact.annualSavings * 0.5).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(financialImpact.annualSavings * 0.5 * 5).toFixed(2)}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Waste Disposal Reduction</div>
                      <div className="text-xs text-gray-500">Lower waste management costs</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(financialImpact.monthlySavings * 0.2).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(financialImpact.annualSavings * 0.2).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(financialImpact.annualSavings * 0.2 * 5).toFixed(2)}</td>
              </tr>
              <tr className="bg-green-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-green-700">Total Financial Benefits</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-green-700">${(financialImpact.monthlySavings * 5.7).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-green-700">${(financialImpact.annualSavings * 1.7).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-green-700">${(financialImpact.annualSavings * 1.7 * 5).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

// Main PredictionDisplay component
const PredictionDisplay = ({ activeTab, predictionData }: PredictionDisplayProps) => {
  return (
    <div className="mt-8">
      {activeTab === 'financial' && (
        <FinancialImpactDashboard financialImpact={predictionData.financialImpact} />
      )}
      {/* Other tabs would go here */}
    </div>
  );
};

export default PredictionDisplay;