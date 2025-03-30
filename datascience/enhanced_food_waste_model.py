import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split

print("Starting optimized food waste prediction model...")

# ===== PART 1: DATA LOADING AND PREPROCESSING =====

# Create a function to load data with robust error handling
def load_data_safely(path, default_data=None):
    """
    Load data with error handling and fallback to default data.
    
    Parameters:
    -----------
    path : str
        Path to the data file
    default_data : pandas.DataFrame, optional
        Default data to return if loading fails
        
    Returns:
    --------
    pandas.DataFrame
        Loaded data or default data
    """
    try:
        return pd.read_csv(path)
    except Exception as e:
        print(f"Error loading {path}: {str(e)}")
        return default_data if default_data is not None else pd.DataFrame()

# Load the restaurant waste data
restaurant_data = load_data_safely('datasets/restaurant_waste.csv')
if not restaurant_data.empty:
    print(f"Loaded restaurant waste data with {len(restaurant_data)} records")
else:
    # Create synthetic data if file loading fails
    print("Creating synthetic restaurant data...")
    np.random.seed(42)
    restaurant_data = pd.DataFrame({
        'Type of Food': np.random.choice(['Meat', 'Vegetables', 'Dairy Products', 'Fruits', 'Baked Goods'], 500),
        'Number of Guests': np.random.randint(100, 500, 500),
        'Quantity of Food': np.random.randint(150, 600, 500),
        'Storage Conditions': np.random.choice(['Refrigerated', 'Room Temperature'], 500),
        'Preparation Method': np.random.choice(['Buffet', 'Finger Food', 'Sit-down Dinner'], 500),
        'Geographical Location': np.random.choice(['Urban', 'Suburban', 'Rural'], 500),
        'Pricing': np.random.choice(['Low', 'Moderate', 'High'], 500),
        'Wastage Food Amount': np.random.uniform(10, 50, 500)
    })

# Set fixed weather data (no API calls for speed)
print("Setting fixed weather data...")
temperature, humidity = 22, 50  # Default values

# Add weather data to restaurant data
restaurant_data['Current_Temperature'] = temperature
restaurant_data['Current_Humidity'] = humidity

# ===== PART 2: FEATURE ENGINEERING =====

# Create a mapping of specific food items to broader categories
def map_to_category(food_name):
    """
    Map food names to standardized categories.
    
    Parameters:
    -----------
    food_name : str
        Name of the food item
        
    Returns:
    --------
    str
        Standardized food category
    """
    food_name = str(food_name).lower()
    
    if any(dairy in food_name for dairy in ['butter', 'milk', 'cheese', 'yogurt', 'cream']):
        return "Dairy Products"
    elif any(meat in food_name for meat in ['meat', 'beef', 'chicken', 'pork', 'lamb', 'turkey']):
        return "Meat"
    elif any(veg in food_name for veg in ['vegetable', 'carrot', 'lettuce', 'spinach', 'broccoli']):
        return "Vegetables"
    elif any(fruit in food_name for fruit in ['fruit', 'apple', 'banana', 'orange', 'berry']):
        return "Fruits"
    elif any(grain in food_name for grain in ['bread', 'rice', 'pasta', 'cereal']):
        return "Grains"
    else:
        return "Other"

# Add derived features
print("Adding derived features...")
if 'Number of Guests' in restaurant_data.columns and 'Quantity of Food' in restaurant_data.columns:
    # Calculate food per guest ratio (important feature)
    restaurant_data['Food_Per_Guest'] = restaurant_data['Quantity of Food'] / restaurant_data['Number of Guests'].replace(0, 1)
    
    # Calculate utilization rate (if wastage is available)
    if 'Wastage Food Amount' in restaurant_data.columns:
        restaurant_data['Utilization_Rate'] = 1 - (restaurant_data['Wastage Food Amount'] / restaurant_data['Quantity of Food'].replace(0, 1))

# Apply category mapping if needed
if 'Type of Food' in restaurant_data.columns:
    # Check if we need to standardize food categories
    unique_food_types = restaurant_data['Type of Food'].nunique()
    if unique_food_types > 10:  # If too many categories, standardize them
        restaurant_data['Type of Food'] = restaurant_data['Type of Food'].apply(map_to_category)

# ===== PART 3: MACHINE LEARNING MODEL DEVELOPMENT =====

print("\n===== BUILDING MACHINE LEARNING MODEL =====")

# Ensure we have the necessary columns for modeling
necessary_columns = ['Type of Food', 'Wastage Food Amount']
if not all(col in restaurant_data.columns for col in necessary_columns):
    print("Error: Missing necessary columns in the dataset")
    # Create dummy data for demonstration
    restaurant_data = pd.DataFrame({
        'Type of Food': ['Meat', 'Vegetables', 'Dairy Products', 'Fruits', 'Baked Goods'] * 100,
        'Number of Guests': np.random.randint(100, 500, 500),
        'Quantity of Food': np.random.randint(150, 600, 500),
        'Storage Conditions': np.random.choice(['Refrigerated', 'Room Temperature'], 500),
        'Preparation Method': np.random.choice(['Buffet', 'Finger Food', 'Sit-down Dinner'], 500),
        'Geographical Location': np.random.choice(['Urban', 'Suburban', 'Rural'], 500),
        'Pricing': np.random.choice(['Low', 'Moderate', 'High'], 500),
        'Current_Temperature': np.random.uniform(15, 30, 500),
        'Current_Humidity': np.random.uniform(30, 70, 500),
        'Wastage Food Amount': np.random.uniform(10, 50, 500)
    })
    
    # Add derived features to synthetic data
    restaurant_data['Food_Per_Guest'] = restaurant_data['Quantity of Food'] / restaurant_data['Number of Guests']
    restaurant_data['Utilization_Rate'] = 1 - (restaurant_data['Wastage Food Amount'] / restaurant_data['Quantity of Food'])
    
    print("Created synthetic dataset for model demonstration")

# Data preprocessing - Select only the most important features based on domain knowledge
priority_features = [
    'Type of Food',
    'Number of Guests',
    'Quantity of Food',
    'Storage Conditions',
    'Current_Temperature',
    'Food_Per_Guest',
    'Utilization_Rate'
]

# Filter to only available priority features
features = [f for f in priority_features if f in restaurant_data.columns]
print(f"Using features: {features}")

# Select only rows with non-null target value
df_model = restaurant_data.dropna(subset=['Wastage Food Amount'])
print(f"Model dataset shape: {df_model.shape}")

# Handle missing values in features - simple imputation
for col in features:
    if col in df_model.columns and df_model[col].dtype.kind in 'ifc':  # numeric columns
        df_model[col] = df_model[col].fillna(df_model[col].median())
    elif col in df_model.columns:  # categorical columns
        df_model[col] = df_model[col].fillna('Unknown')

# Prepare X and y
X = df_model[features].copy()
y = df_model['Wastage Food Amount']

# Identify categorical columns
categorical_features = X.select_dtypes(include=['object']).columns.tolist()
numeric_features = X.select_dtypes(include=['int64', 'float64']).columns.tolist()

print(f"\nCategorical features: {categorical_features}")
print(f"Numeric features: {numeric_features}")

# Create preprocessing pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features)
    ])

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Reduce dataset size for faster training if it's large
max_train_samples = 1000  # Further reduced for even faster training
if len(X_train) > max_train_samples:
    print(f"Reducing training set from {len(X_train)} to {max_train_samples} samples for faster training")
    indices = np.random.choice(X_train.index, max_train_samples, replace=False)
    X_train = X_train.loc[indices]
    y_train = y_train.loc[indices]

# Create and train model with optimized parameters for speed
print("\nTraining Random Forest model...")
model = RandomForestRegressor(
    n_estimators=50,      # Reduced for speed
    max_depth=8,          # Further limited depth
    min_samples_split=5,
    max_features='sqrt',  # Use sqrt of features for faster training
    n_jobs=-1,            # Use all cores
    random_state=42
)

# Create pipeline
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', model)
])

# Train the model
pipeline.fit(X_train, y_train)

# Predict on test set
y_pred = pipeline.predict(X_test)

# Evaluate the model
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("\nModel Results:")
print(f"RMSE: {rmse:.4f}")
print(f"MAE: {mae:.4f}")
print(f"R2 Score: {r2:.4f}")

# ===== PART 4: FEATURE IMPORTANCE AND VISUALIZATION =====

# Analyze feature importance
print("\nAnalyzing feature importance...")
feature_names = []

# Add numeric feature names
for col in numeric_features:
    feature_names.append(col)

# Add one-hot encoded feature names
onehotencoder = preprocessor.named_transformers_['cat']
for i, category in enumerate(categorical_features):
    feature_names.extend([f"{category}_{val}" for val in onehotencoder.categories_[i]])

# Get feature importances
importances = pipeline.named_steps['model'].feature_importances_

# Create a DataFrame for visualization
if len(feature_names) == len(importances):
    feature_importance_df = pd.DataFrame({
        'Feature': feature_names,
        'Importance': importances
    }).sort_values('Importance', ascending=False)
    
    print("\nTop Feature Importances:")
    print(feature_importance_df.head(10))
    
    # Plot feature importances (only if we have a reasonable number)
    if len(feature_importance_df) <= 30:
        plt.figure(figsize=(10, 6))
        sns.barplot(x='Importance', y='Feature', data=feature_importance_df.head(10))
        plt.title('Top 10 Feature Importances')
        plt.tight_layout()
        plt.savefig('feature_importances.png')
        print("\nFeature importance plot saved as 'feature_importances.png'")

# Visualize actual vs predicted values (with sample to avoid overcrowding)
max_plot_points = 100  # Reduced for faster plotting
if len(y_test) > max_plot_points:
    # Sample points for the plot
    indices = np.random.choice(len(y_test), max_plot_points, replace=False)
    y_test_sample = y_test.iloc[indices]
    y_pred_sample = y_pred[indices]
else:
    y_test_sample = y_test
    y_pred_sample = y_pred

plt.figure(figsize=(8, 6))
plt.scatter(y_test_sample, y_pred_sample, alpha=0.5)
plt.plot([y_test_sample.min(), y_test_sample.max()], [y_test_sample.min(), y_test_sample.max()], 'r--')
plt.xlabel('Actual Food Waste')
plt.ylabel('Predicted Food Waste')
plt.title('Actual vs Predicted Food Waste')
plt.tight_layout()
plt.savefig('actual_vs_predicted.png')
print("\nActual vs predicted plot saved as 'actual_vs_predicted.png'")

# ===== PART 5: RECOMMENDATION FUNCTION =====

def recommend_actions(food_type, predicted_waste):
    """
    Generate recommendations based on predicted food waste.
    
    Parameters:
    -----------
    food_type : str
        The type of food
    predicted_waste : float
        Predicted waste amount
        
    Returns:
    --------
    str
        Recommendation message
    """
    # Calculate CO2 emissions saved (2.5kg CO2 per kg food waste)
    co2_emissions = predicted_waste * 2.5
    
    if predicted_waste > 30:
        message = f"High waste predicted for {food_type} ({predicted_waste:.2f} kg, {co2_emissions:.2f} kg CO2). Consider:"
        recommendations = [
            "Reducing purchase quantity by 30%",
            "Offering discounts as expiration dates approach",
            "Donating to food banks before expiration",
            "Implementing a first-in, first-out inventory system"
        ]
    elif predicted_waste > 15:
        message = f"Moderate waste predicted for {food_type} ({predicted_waste:.2f} kg, {co2_emissions:.2f} kg CO2). Consider:"
        recommendations = [
            "Reducing purchase quantity by 15%",
            "Creating promotions for items approaching expiration",
            "Adjusting storage conditions to extend shelf life",
            "Reviewing ordering patterns weekly"
        ]
    else:
        message = f"Low waste predicted for {food_type} ({predicted_waste:.2f} kg, {co2_emissions:.2f} kg CO2). Continue with:"
        recommendations = [
            "Current ordering patterns",
            "Regular monitoring of inventory",
            "Optimizing display to encourage sales of older stock first",
            "Sharing best practices with other departments"
        ]
    
    return message + "\n- " + "\n- ".join(recommendations)

# Example usage
print("\nExample Recommendation:")
example_food = 'Dairy Products'
example_waste = 35.0
print(recommend_actions(example_food, example_waste))

# ===== PART 6: SAVE MODEL FOR HUGGING FACE =====

# Save the trained model for later use
model_path = 'food_waste_prediction_model.pkl'
joblib.dump(pipeline, model_path)
print(f"\nModel saved as '{model_path}'")

# Create a sample input for testing
sample_input = pd.DataFrame({
    'Type of Food': ['Meat'],
    'Number of Guests': [300],
    'Quantity of Food': [400],
    'Storage Conditions': ['Refrigerated'],
    'Current_Temperature': [25],
    'Food_Per_Guest': [1.33]  # 400/300
})

# Add any other required columns from features
for col in features:
    if col not in sample_input.columns:
        if col in numeric_features:
            sample_input[col] = 0
        else:
            sample_input[col] = 'Unknown'

# Save the sample input
sample_input_path = 'sample_input.pkl'
joblib.dump(sample_input, sample_input_path)
print(f"Sample input saved as '{sample_input_path}'")

# Create a simple example script for using the model
example_script = """
import joblib
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Load the model
model = joblib.load('food_waste_prediction_model.pkl')

# Create input data (replace with your own data)
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
print(f"Estimated CO2 emissions saved: {prediction[0] * 2.5:.2f} kg CO2")

# Get recommendations
def recommend_actions(food_type, predicted_waste):
    co2_emissions = predicted_waste * 2.5
    
    if predicted_waste > 30:
        message = f"High waste predicted for {food_type} ({predicted_waste:.2f} kg, {co2_emissions:.2f} kg CO2). Consider:"
        recommendations = [
            "Reducing purchase quantity by 30%",
            "Offering discounts as expiration dates approach",
            "Donating to food banks before expiration"
        ]
    elif predicted_waste > 15:
        message = f"Moderate waste predicted for {food_type} ({predicted_waste:.2f} kg, {co2_emissions:.2f} kg CO2). Consider:"
        recommendations = [
            "Reducing purchase quantity by 15%",
            "Creating promotions for items approaching expiration",
            "Adjusting storage conditions to extend shelf life"
        ]
    else:
        message = f"Low waste predicted for {food_type} ({predicted_waste:.2f} kg, {co2_emissions:.2f} kg CO2). Continue with:"
        recommendations = [
            "Current ordering patterns",
            "Regular monitoring of inventory",
            "Optimizing display to encourage sales of older stock first"
        ]
    
    return message + "\\n- " + "\\n- ".join(recommendations)

recommendation = recommend_actions(input_data['Type of Food'], prediction[0])
print("\\nRecommendation:")
print(recommendation)

# Function to simulate different scenarios
def simulate_scenarios(base_input, varying_param, values, param_name):
    results = []
    for val in values:
        # Create a copy of the base input
        scenario = base_input.copy()
        scenario[varying_param] = val
        
        # Calculate derived features if needed
        if varying_param == 'Quantity of Food' or varying_param == 'Number of Guests':
            scenario['Food_Per_Guest'] = scenario['Quantity of Food'] / scenario['Number of Guests']
        
        # Convert to DataFrame
        scenario_df = pd.DataFrame([scenario])
        
        # Make prediction
        pred = model.predict(scenario_df)[0]
        results.append(pred)
    
    # Plot results
    plt.figure(figsize=(10, 6))
    plt.plot(values, results, 'o-')
    plt.xlabel(param_name)
    plt.ylabel('Predicted Food Waste (kg)')
    plt.title(f'Impact of {param_name} on Food Waste')
    plt.grid(True)
    plt.savefig(f'{varying_param}_impact.png')
    plt.close()
    
    print(f"\\nSimulation for different {param_name} values:")
    for i, val in enumerate(values):
        print(f"{param_name}: {val}, Predicted Waste: {results[i]:.2f} kg")
    
    return results

# Simulate different scenarios
guests_range = [100, 200, 300, 400, 500]
simulate_scenarios(input_data, 'Number of Guests', guests_range, 'Number of Guests')

temp_range = [15, 20, 25, 30, 35]
simulate_scenarios(input_data, 'Current_Temperature', temp_range, 'Temperature (°C)')

print("\\nSimulation results saved as PNG files")
print("\\nModel usage example complete!")
"""

with open('example_usage.py', 'w') as f:
    f.write(example_script)

print("Example usage script saved as 'example_usage.py'")
print("\nTo upload to Hugging Face:")
print("1. Create a new repository on huggingface.co")
print("2. Upload the following files:")
print("   - food_waste_prediction_model.pkl")
print("   - sample_input.pkl")
print("   - example_usage.py")
print("   - feature_importances.png")
print("   - actual_vs_predicted.png")
print("3. Create a README.md file explaining the model and how to use it")

# Create a README.md file for Hugging Face
readme_content = """# Optimized Food Waste Prediction Model

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
"""

with open('README.md', 'w') as f:
    f.write(readme_content)

print("README.md file created for Hugging Face")
print("\nOptimized model training and evaluation complete!")
