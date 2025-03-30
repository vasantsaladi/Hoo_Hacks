# Food Waste Prediction API

This FastAPI backend provides a REST API for predicting food waste in restaurants using a machine learning model. The API allows restaurants to estimate potential food waste based on various parameters and receive actionable recommendations to reduce waste.

## Features

- **Food Waste Prediction**: Uses a Random Forest Regressor model to predict food waste in kg
- **CO2 Emissions Calculation**: Estimates environmental impact (2.5kg CO2 per kg food waste)
- **Actionable Recommendations**: Provides specific recommendations to reduce waste
- **Hugging Face Integration**: Combines model-based recommendations with AI-generated suggestions
- **Rate Limiting**: Protects the API from abuse with rate limiting

## Model Information

The food waste prediction model:

- Processes restaurant food waste data with features like food type, number of guests, and storage conditions
- Uses feature engineering including waste per guest and utilization rate
- Achieves high accuracy with an R² score of ~0.96
- Top predictive features: Utilization Rate (50.8%), Number of Guests (21.1%), Quantity of Food (19.5%)

## API Endpoints

### POST /api/v1/predict

Predicts food waste based on input parameters.

**Request Body:**

```json
{
  "temperature": 25,
  "humidity": 60,
  "product_type": "dairy",
  "historical_sales": 1000,
  "number_of_guests": 300,
  "quantity_of_food": 400,
  "storage_conditions": "Refrigerated"
}
```

**Response:**

```json
{
  "prediction": 35.42,
  "recommendations": [
    "Reduce Dairy Products purchase quantity by 30% to save approximately 35.42kg waste",
    "Offer progressive discounts as expiration dates approach to increase sales of Dairy Products",
    "Donate Dairy Products to food banks 2-3 days before expiration to reduce waste and help community",
    "Implement a first-in, first-out inventory system for Dairy Products to minimize spoilage"
  ],
  "co2_saved": 88.55,
  "food_type": "Dairy Products",
  "utilization_rate": 0.91
}
```

### GET /api/v1/health

Health check endpoint.

**Response:**

```json
{
  "status": "healthy"
}
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

## Testing

Run the test script to verify the API functionality:

```bash
python test_model_api.py
```

## Integration with Next.js Frontend

The API is designed to be easily integrated with a Next.js TypeScript frontend. Example fetch request:

```typescript
const predictWaste = async (data: PredictionRequest): Promise<PredictionResponse> => {
  const response = await fetch('http://localhost:8000/api/v1/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to predict food waste');
  }
  
  return response.json();
};

// TypeScript interfaces
interface PredictionRequest {
  temperature: number;
  humidity?: number;
  product_type: string;
  historical_sales: number;
  number_of_guests?: number;
  quantity_of_food?: number;
  storage_conditions?: string;
}

interface PredictionResponse {
  prediction: number;
  recommendations: string[];
  co2_saved: number;
  food_type: string;
  utilization_rate?: number;
}
```

## Model Architecture

The food waste prediction model is a Random Forest Regressor with the following characteristics:

- 50 estimators for faster training
- Maximum depth of 8 to prevent overfitting
- Uses sqrt of features for faster training
- Standardized numerical features
- One-hot encoded categorical variables

## Future Improvements

- Add user authentication and restaurant-specific models
- Implement A/B testing for recommendation effectiveness
- Add seasonal adjustments to predictions
- Integrate with inventory management systems
