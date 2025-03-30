"use client"

interface Prediction {
  wasteAmount: number;
  savingsPotential: number;
  recommendations: string[];
}

interface VisualizationsProps {
  predictions: Prediction;
}

export default function Visualizations({ predictions }: VisualizationsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-xl font-semibold mb-4">Visualizations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Waste Amount Chart */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Waste Amount Chart Placeholder</p>
        </div>
        
        {/* Savings Potential Chart */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Savings Potential Chart Placeholder</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-500 mt-4 text-center">
        Note: Charts will be implemented with a charting library
      </p>
    </div>
  )
} 