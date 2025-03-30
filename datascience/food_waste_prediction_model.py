import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

# Load your datasets
restaurant_data = pd.read_csv('datasets/restaurant_waste.csv')
brooklyn_data = pd.read_csv('datasets/brooklyn_waste.csv')

print("Data loaded successfully!")
print(f"Restaurant data shape: {restaurant_data.shape}")
print(f"Brooklyn data shape: {brooklyn_data.shape}")

# Skip Brooklyn dataset processing for now as it's causing issues
# We'll focus on the restaurant dataset which has cleaner data

# Focus on restaurant dataset as primary training data
# One-hot encode categorical variables
categorical_features = ['Type of Food', 'Event Type', 'Storage Conditions', 
                       'Purchase History', 'Seasonality', 'Preparation Method',
                       'Geographical Location', 'Pricing']

restaurant_encoded = pd.get_dummies(restaurant_data, columns=categorical_features)

# Add derived features based on the search results
restaurant_encoded['Waste_Per_Guest'] = restaurant_encoded['Wastage Food Amount'] / restaurant_encoded['Number of Guests']
restaurant_encoded['Utilization_Rate'] = (restaurant_encoded['Quantity of Food'] - restaurant_encoded['Wastage Food Amount']) / restaurant_encoded['Quantity of Food']

# Extract day of week from date if available (creating synthetic example)
import random
# Simulating days of week for demonstration
restaurant_encoded['Day_of_Week'] = [random.randint(0, 6) for _ in range(len(restaurant_encoded))]

# Add weather data if available (simulation for example)
restaurant_encoded['Temperature'] = [random.randint(40, 95) for _ in range(len(restaurant_encoded))]
restaurant_encoded['Is_Rainy'] = [random.choice([0, 1]) for _ in range(len(restaurant_encoded))]

# Normalize numerical features
scaler = StandardScaler()
numerical_features = ['Number of Guests', 'Quantity of Food', 'Waste_Per_Guest', 
                      'Utilization_Rate', 'Temperature']
restaurant_encoded[numerical_features] = scaler.fit_transform(restaurant_encoded[numerical_features])

# Split features and target
X = restaurant_encoded.drop(['Wastage Food Amount'], axis=1)
y = restaurant_encoded['Wastage Food Amount']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest model as recommended in search results
rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Evaluate model
predictions = rf_model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
print(f"Model Mean Absolute Error: {mae}")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

print("Top 10 Most Important Features:")
print(feature_importance.head(10))

# Function to predict food waste for new data
def predict_food_waste(input_data):
    """
    Predict food waste amount based on input features.
    
    Args:
        input_data (dict): Dictionary containing input features
        
    Returns:
        float: Predicted food waste amount in kg
    """
    # Convert input to DataFrame
    input_df = pd.DataFrame([input_data])
    
    # One-hot encode categorical variables
    for feature in categorical_features:
        if feature in input_data:
            feature_dummies = pd.get_dummies(input_df[feature], prefix=feature)
            input_df = pd.concat([input_df.drop(feature, axis=1), feature_dummies], axis=1)
    
    # Calculate derived features
    if 'Number of Guests' in input_df and 'Quantity of Food' in input_df:
        input_df['Waste_Per_Guest'] = input_df['Number of Guests'] / 10  # Placeholder value
        input_df['Utilization_Rate'] = 0.8  # Placeholder value
    
    # Ensure all columns from training are present
    missing_cols = set(X.columns) - set(input_df.columns)
    for col in missing_cols:
        input_df[col] = 0
    
    # Keep only columns used during training and ensure same order
    input_df = input_df[X.columns]
    
    # Create a copy of the numerical features for scaling
    numerical_data = input_df[numerical_features].copy()
    
    # Scale the numerical features all at once (as they were trained)
    input_df[numerical_features] = scaler.transform(numerical_data)
    
    # Make prediction
    prediction = rf_model.predict(input_df)[0]
    
    return prediction

# Example usage
if __name__ == "__main__":
    # Example input data
    sample_input = {
        'Type of Food': 'Meat',
        'Number of Guests': 300,
        'Event Type': 'Corporate',
        'Quantity of Food': 400,
        'Storage Conditions': 'Refrigerated',
        'Purchase History': 'Regular',
        'Seasonality': 'Summer',
        'Preparation Method': 'Buffet',
        'Geographical Location': 'Urban',
        'Pricing': 'Moderate',
        'Temperature': 75,
        'Is_Rainy': 0,
        'Day_of_Week': 3
    }
    
    # Predict food waste
    predicted_waste = predict_food_waste(sample_input)
    print(f"\nPredicted food waste for sample input: {predicted_waste:.2f} kg")
    
    # Calculate CO2 emissions saved (example calculation)
    co2_saved = predicted_waste * 2.5  # Assuming 2.5 kg CO2 per kg food waste
    print(f"Estimated CO2 emissions saved if waste is prevented: {co2_saved:.2f} kg")
