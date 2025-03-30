# Optimized Food Waste Prediction Model

This model predicts the amount of food waste based on various factors like food type, number of guests, quantity of food, and storage conditions.

## Features

- **Fast Training**: Optimized for quick training and inference
- **Accurate Predictions**: Achieves good accuracy with minimal features
- **CO2 Emissions Calculation**: Estimates environmental impact of food waste
- **Actionable Recommendations**: Provides specific recommendations to reduce waste

## How to Use

```python
import joblib
import pandas as pd

# Load the model
model = joblib.load('food_waste_prediction_model.pkl')

# Create input data
input_data = {
    'Type of Food': 'Meat',
    'Number of Guests': 300,
    'Quantity of Food': 400,
    'Storage Conditions': 'Refrigerated',
    'Current_Temperature': 25
}

# Calculate derived features
input_data['Food_Per_Guest'] = input_data['Quantity of Food'] / input_data['Number of Guests']

# Convert to DataFrame
input_df = pd.DataFrame([input_data])

# Make prediction
prediction = model.predict(input_df)
print(f"Predicted food waste: {prediction[0]:.2f} kg")
```

See `example_usage.py` for a complete example with recommendations and scenario simulations.

## Model Information

- **Algorithm**: Random Forest Regressor
- **Key Features**: Type of Food, Number of Guests, Quantity of Food, Food Per Guest
- **Performance**: RMSE: ~X.XX, R² Score: ~0.XX

## Files Included

- `food_waste_prediction_model.pkl`: The trained model
- `sample_input.pkl`: Sample input for testing
- `example_usage.py`: Example script for using the model
- `feature_importances.png`: Visualization of feature importances
- `actual_vs_predicted.png`: Plot of actual vs predicted values
