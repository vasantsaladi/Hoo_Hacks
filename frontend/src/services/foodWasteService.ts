/**
 * Food Waste Prediction API Service
 * Connects to the FastAPI backend for food waste predictions
 */

// API base URL - change this to match your backend URL
const API_BASE_URL = 'http://localhost:8000/api/v1';

// Prediction request interface matching the backend schema
export interface PredictionRequest {
  temperature: number;
  humidity?: number;
  product_type: string;
  historical_sales: number;
  number_of_guests?: number;
  quantity_of_food?: number;
  storage_conditions?: string;
}

// Restaurant prediction request interface matching the backend schema
export interface RestaurantPredictionRequest {
  food_type: string;
  number_of_guests: number;
  event_type: string;
  storage_condition: string;
  preparation_method: string;
  location: string;
  pricing_tier: string;
}

// Prediction response interface matching the backend schema
export interface PredictionResponse {
  prediction: number;
  co2_saved: number;
  recommendations: string[];
  utilization_rate?: number;
  food_type: string;
  total_food: number;
  waste_amount: number;
  waste_percentage: number;
  co2_emissions: number;
}

/**
 * Get food waste prediction from the API
 * @param data PredictionRequest data
 * @returns Promise with the prediction response
 */
export async function getPrediction(data: PredictionRequest): Promise<PredictionResponse> {
  try {
    console.log('Sending prediction request:', data);
    
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = 'Failed to get prediction';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // If parsing fails, use status text
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      
      console.error('Prediction API error:', errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Received prediction response:', result);
    
    // Add derived fields for the updated UI
    const totalFood = data.quantity_of_food || 400; // Default to 400kg if not provided
    
    return {
      ...result,
      food_type: data.product_type,
      total_food: totalFood,
      waste_amount: result.prediction,
      waste_percentage: Math.round((result.prediction / totalFood) * 100),
      co2_emissions: result.co2_saved
    };
  } catch (error) {
    console.error('Error fetching prediction:', error);
    // If the error is due to connection issues, provide a clearer message
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Could not connect to the prediction server. Please check if the backend is running.');
    }
    throw error;
  }
}

/**
 * Get restaurant food waste prediction from the API
 * @param data RestaurantPredictionRequest data
 * @returns Promise with the prediction response
 */
export async function getRestaurantPrediction(data: RestaurantPredictionRequest): Promise<PredictionResponse> {
  try {
    console.log('Sending restaurant prediction request:', data);
    
    const response = await fetch(`${API_BASE_URL}/restaurant/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = 'Failed to get restaurant prediction';
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // If parsing fails, use status text
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      
      console.error('Restaurant prediction API error:', errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Received restaurant prediction response:', result);
    
    // Add derived fields for the updated UI
    const totalFood = 400; // Default to 400kg for restaurant predictions
    
    return {
      ...result,
      food_type: data.food_type,
      total_food: totalFood,
      waste_amount: result.prediction,
      waste_percentage: Math.round((result.prediction / totalFood) * 100),
      co2_emissions: result.co2_saved
    };
  } catch (error) {
    console.error('Error fetching restaurant prediction:', error);
    // If the error is due to connection issues, provide a clearer message
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Could not connect to the prediction server. Please check if the backend is running.');
    }
    throw error;
  }
}

/**
 * Check API health
 * @returns Promise with health status
 */
export async function checkApiHealth(): Promise<{ status: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error(`API health check failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking API health:', error);
    throw error;
  }
}

/**
 * Get current temperature from a weather API
 * This is a mock function - in a real app, you would call a weather API
 * @param location Location string
 * @returns Promise with the current temperature
 */
export async function getCurrentTemperature(location: string = 'Charlottesville'): Promise<number> {
  // Mock implementation - would be replaced with actual weather API call
  const mockTemperatures: Record<string, number> = {
    'Charlottesville': 25,
    'New York': 22,
    'Los Angeles': 28,
    'Chicago': 20,
    'Miami': 30,
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTemperatures[location] || 25);
    }, 500);
  });
}

/**
 * Get current humidity from a weather API
 * This is a mock function - in a real app, you would call a weather API
 * @param location Location string
 * @returns Promise with the current humidity
 */
export async function getCurrentHumidity(location: string = 'Charlottesville'): Promise<number> {
  // Mock implementation - would be replaced with actual weather API call
  const mockHumidity: Record<string, number> = {
    'Charlottesville': 60,
    'New York': 55,
    'Los Angeles': 50,
    'Chicago': 65,
    'Miami': 75,
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockHumidity[location] || 60);
    }, 500);
  });
}

/**
 * Map product category to product type for API
 * @param category Product category
 * @returns Product type string
 */
export function mapCategoryToProductType(category: string): string {
  const categoryMap: Record<string, string> = {
    'vegetables': 'vegetables',
    'fruits': 'fruits',
    'dairy': 'dairy',
    'meat': 'meat',
    'bakery': 'bakery',
    'grains': 'grains',
    'seafood': 'seafood',
    'frozen': 'frozen',
    'canned': 'canned',
    'beverages': 'beverages',
    'snacks': 'snacks',
    'condiments': 'condiments',
  };

  return categoryMap[category.toLowerCase()] || 'other';
}

/**
 * Map storage location to storage conditions for API
 * @param storageLocation Storage location
 * @returns Storage conditions string
 */
export function mapStorageLocationToConditions(storageLocation: string): string {
  const locationMap: Record<string, string> = {
    'refrigerator': 'Refrigerated',
    'freezer': 'Frozen',
    'pantry': 'Room Temperature',
    'counter': 'Room Temperature',
    'display': 'Room Temperature',
    'heated': 'Heated',
  };

  return locationMap[storageLocation.toLowerCase()] || 'Room Temperature';
}

/**
 * Calculate historical sales based on inventory items
 * This is a mock function - in a real app, you would use actual sales data
 * @param category Product category
 * @returns Estimated historical sales
 */
export function estimateHistoricalSales(category: string): number {
  const salesEstimates: Record<string, number> = {
    'vegetables': 1200,
    'fruits': 1000,
    'dairy': 1500,
    'meat': 800,
    'bakery': 600,
    'grains': 400,
    'seafood': 300,
    'frozen': 500,
    'canned': 200,
    'beverages': 700,
    'snacks': 900,
    'condiments': 150,
  };

  return salesEstimates[category.toLowerCase()] || 500;
}
