import pandas as pd
import json
import requests

# Load the JSON data
with open('datasets/data_test.json', 'r') as file:
    data = json.load(file)

# Extract the relevant sheets
product_data = data['sheets'][2]['data']  # Assuming 'Product' is the third sheet

# Convert product data to DataFrame
product_df = pd.DataFrame(product_data)

# Assign column names
product_df.columns = [
    'ID', 'Category_ID', 'Name', 'Name_subtitle', 'Keywords',
    'Pantry_Min', 'Pantry_Max', 'Pantry_Metric', 'Pantry_tips',
    'DOP_Pantry_Min', 'DOP_Pantry_Max', 'DOP_Pantry_Metric', 'DOP_Pantry_tips',
    'Pantry_After_Opening_Min', 'Pantry_After_Opening_Max', 'Pantry_After_Opening_Metric',
    'Refrigerate_Min', 'Refrigerate_Max', 'Refrigerate_Metric', 'Refrigerate_tips',
    'DOP_Refrigerate_Min', 'DOP_Refrigerate_Max', 'DOP_Refrigerate_Metric', 'DOP_Refrigerate_tips',
    'Refrigerate_After_Opening_Min', 'Refrigerate_After_Opening_Max', 'Refrigerate_After_Opening_Metric',
    'Refrigerate_After_Thawing_Min', 'Refrigerate_After_Thawing_Max', 'Refrigerate_After_Thawing_Metric',
    'Freeze_Min', 'Freeze_Max', 'Freeze_Metric', 'Freeze_Tips',
    'DOP_Freeze_Min', 'DOP_Freeze_Max', 'DOP_Freeze_Metric', 'DOP_Freeze_Tips'
]

# Define Safe Minimum Temperature based on some criteria
def get_safe_minimum_temperature(row):
    if row['Category_ID'] == 7:  # Dairy Products & Eggs
        return 0  # Example safe minimum temperature for dairy
    elif row['Category_ID'] == 8:  # Food Purchased Frozen
        return -18  # Example safe minimum temperature for frozen food
    return 5  # Default safe minimum temperature

# Apply the function to create the new column
product_df['Safe_Minimum_Temperature'] = product_df.apply(get_safe_minimum_temperature, axis=1)

# Extract only the necessary columns
extracted_df = product_df[
    ['ID', 'Category_ID', 'Name', 'DOP_Refrigerate_Min', 'DOP_Refrigerate_Max', 
     'DOP_Freeze_Min', 'DOP_Freeze_Max', 'Safe_Minimum_Temperature']
].copy()

# Function to extract values from dictionaries
def extract_value(dict_column, key):
    return dict_column.get(key) if isinstance(dict_column, dict) else dict_column

# Clean the relevant columns using .loc to avoid SettingWithCopyWarning
extracted_df['ID'] = extracted_df['ID'].apply(lambda x: extract_value(x, 'ID'))
extracted_df['Category_ID'] = extracted_df['Category_ID'].apply(lambda x: extract_value(x, 'Category_ID'))
extracted_df['Name'] = extracted_df['Name'].apply(lambda x: extract_value(x, 'Name'))

# Extract values from the relevant columns for refrigeration and freezing
extracted_df['DOP_Refrigerate_Min'] = extracted_df['DOP_Refrigerate_Min'].apply(lambda x: extract_value(x, 'DOP_Refrigerate_Min'))
extracted_df['DOP_Refrigerate_Max'] = extracted_df['DOP_Refrigerate_Max'].apply(lambda x: extract_value(x, 'DOP_Refrigerate_Max'))
extracted_df['DOP_Freeze_Min'] = extracted_df['DOP_Freeze_Min'].apply(lambda x: extract_value(x, 'DOP_Freeze_Min'))
extracted_df['DOP_Freeze_Max'] = extracted_df['DOP_Freeze_Max'].apply(lambda x: extract_value(x, 'DOP_Freeze_Max'))

# Convert relevant columns to numeric types, coercing errors to NaN
extracted_df['DOP_Refrigerate_Min'] = pd.to_numeric(extracted_df['DOP_Refrigerate_Min'], errors='coerce')
extracted_df['DOP_Refrigerate_Max'] = pd.to_numeric(extracted_df['DOP_Refrigerate_Max'], errors='coerce')
extracted_df['DOP_Freeze_Min'] = pd.to_numeric(extracted_df['DOP_Freeze_Min'], errors='coerce')
extracted_df['DOP_Freeze_Max'] = pd.to_numeric(extracted_df['DOP_Freeze_Max'], errors='coerce')

# Save the cleaned and extracted DataFrame to a new CSV file
extracted_df.to_csv('extracted_shelf_life_data.csv', index=False)

# Load the CSV file to check the output
loaded_df = pd.read_csv('extracted_shelf_life_data.csv')

# Function to get the user's location
def get_location():
    ip_url = "https://ipinfo.io"
    response = requests.get(ip_url)
    data = response.json()
    location = data['loc'].split(',')
    lat, lon = location[0], location[1]
    return lat, lon

# Function to get weather data by location
def get_weather_by_location(lat, lon):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        temperature = data['current_weather']['temperature']  # Temperature in Celsius
        humidity = data['current_weather']['windspeed']  # Windspeed in km/h
        return temperature, humidity
    else:
        print("Error retrieving weather data.")
        return None

# Get weather for the user's location
lat, lon = get_location()
weather_data = get_weather_by_location(lat, lon)

if weather_data:
    temperature, humidity = weather_data
    print(f"Temperature: {temperature}°C")
    print(f"Windspeed: {humidity} km/h")

    # Load the food shelf life dataset
    food_data = pd.read_csv('extracted_shelf_life_data.csv')

    # Add weather data to the food DataFrame
    food_data['Current_Temperature'] = temperature
    food_data['Current_Humidity'] = humidity

    # Save the combined DataFrame to a new CSV file
    food_data.to_csv('food_with_weather_data.csv', index=False)

    # Display the first few rows of the combined DataFrame
    print(food_data.head(20))

# Load the food wastage data from CSV
wastage_data = pd.read_csv('food_wastage_data.csv')  # Replace with your actual CSV filename

# Display the first few rows of the wastage data to verify
print("Wastage Data:")
print(wastage_data.head())

# Create a mapping of specific food items to broader categories
# Print the unique values in the 'Name' column to see what we're working with
print("Unique food names:")
print(food_data['Name'].unique())

# Print the unique values in the 'Type of Food' column from wastage_data
print("\nUnique food categories in wastage data:")
print(wastage_data['Type of Food'].unique())

# Create a more comprehensive mapping that looks for partial matches
def map_to_category(food_name):
    food_name = str(food_name).lower()
    
    if any(dairy in food_name for dairy in ['butter', 'milk', 'cheese', 'yogurt', 'cream']):
        return "Dairy"
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

# Apply the function to create the Food_Category column
food_data['Food_Category'] = food_data['Name'].apply(map_to_category)

# Print the distribution of categories to verify
print("\nFood category distribution:")
print(food_data['Food_Category'].value_counts())

# Make sure the categories in food_data match those in wastage_data
# Create a mapping from your categories to the exact categories in wastage_data if needed
category_standardization = {
    "Dairy": "Dairy Products",
    "Meat": "Meat Products",
    "Vegetables": "Fresh Vegetables",
    "Fruits": "Fresh Fruits",
    "Grains": "Grain Products",
    "Other": "Other"
}

# Apply the standardization mapping
food_data['Food_Category_Standardized'] = food_data['Food_Category'].map(category_standardization)

# Merge on the standardized category
merged_data = pd.merge(
    food_data, 
    wastage_data, 
    left_on='Food_Category_Standardized', 
    right_on='Type of Food', 
    how='left'
)


# Display the merged dataset
print("\nMerged Dataset with Wastage Food Amount:")
print(merged_data.head())

# Save the updated dataset to a new CSV file
merged_data.to_csv('updated_food_data_with_wastage.csv', index=False)


import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt
import seaborn as sns

# Load the merged dataset
df = merged_data.dropna(subset=['Wastage Food Amount'])

# Display basic information about the dataset
print("Dataset Info:")
print(df.info())
print("\nDescriptive Statistics:")
print(df.describe())

# Check for missing values
print("\nMissing Values:")
print(df.isnull().sum())

# Data preprocessing
# Select relevant features for the model
features = [
    'Category_ID', 'DOP_Refrigerate_Min', 'DOP_Refrigerate_Max', 
    'DOP_Freeze_Min', 'DOP_Freeze_Max', 'Safe_Minimum_Temperature',
    'Current_Temperature', 'Current_Humidity', 'Food_Category_Standardized',
    'Purchase History', 'Seasonality', 'Preparation Method', 'Geographical Location',
    'Pricing'
]

# Select only rows with non-null target value
df_model = df.dropna(subset=['Wastage Food Amount'])

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
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create models to compare
models = {
    'Random Forest': RandomForestRegressor(random_state=42),
    'Gradient Boosting': GradientBoostingRegressor(random_state=42)
}

# Model training and evaluation
results = {}

for model_name, model in models.items():
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
    
    # Store results
    results[model_name] = {
        'MSE': mse,
        'RMSE': rmse,
        'MAE': mae,
        'R2': r2,
        'pipeline': pipeline
    }
    
    print(f"\n{model_name} Results:")
    print(f"MSE: {mse:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"MAE: {mae:.4f}")
    print(f"R2 Score: {r2:.4f}")

# Select the best model based on RMSE
best_model_name = min(results, key=lambda k: results[k]['RMSE'])
best_model = results[best_model_name]['pipeline']
print(f"\nBest Model: {best_model_name}")

# Hyperparameter tuning for the best model
if best_model_name == 'Random Forest':
    param_grid = {
        'model__n_estimators': [50, 100, 200],
        'model__max_depth': [None, 10, 20, 30],
        'model__min_samples_split': [2, 5, 10]
    }
else:  # Gradient Boosting
    param_grid = {
        'model__n_estimators': [50, 100, 200],
        'model__learning_rate': [0.01, 0.1, 0.2],
        'model__max_depth': [3, 5, 7]
    }

# Perform grid search with cross-validation
grid_search = GridSearchCV(
    best_model,
    param_grid,
    cv=5,
    scoring='neg_root_mean_squared_error',
    n_jobs=-1
)

grid_search.fit(X_train, y_train)

# Get the best hyperparameters
best_params = grid_search.best_params_
print(f"\nBest hyperparameters: {best_params}")

# Evaluate the tuned model
best_model_tuned = grid_search.best_estimator_
y_pred_tuned = best_model_tuned.predict(X_test)

mse_tuned = mean_squared_error(y_test, y_pred_tuned)
rmse_tuned = np.sqrt(mse_tuned)
mae_tuned = mean_absolute_error(y_test, y_pred_tuned)
r2_tuned = r2_score(y_test, y_pred_tuned)

print("\nTuned Model Results:")
print(f"MSE: {mse_tuned:.4f}")
print(f"RMSE: {rmse_tuned:.4f}")
print(f"MAE: {mae_tuned:.4f}")
print(f"R2 Score: {r2_tuned:.4f}")

# Analyze feature importance (for Random Forest or Gradient Boosting)
if hasattr(best_model_tuned[-1], 'feature_importances_'):
    # Extract feature names after one-hot encoding
    preprocessor = best_model_tuned.named_steps['preprocessor']
    feature_names = []
    
    # Add numeric feature names
    for col in numeric_features:
        feature_names.append(col)
    
    # Add one-hot encoded feature names
    onehotencoder = preprocessor.named_transformers_['cat']
    for i, category in enumerate(categorical_features):
        feature_names.extend([f"{category}_{val}" for val in 
                             onehotencoder.categories_[i]])
    
    # Get feature importances
    importances = best_model_tuned[-1].feature_importances_
    
    # Create a DataFrame for visualization
    if len(feature_names) == len(importances):
        feature_importance_df = pd.DataFrame({
            'Feature': feature_names,
            'Importance': importances
        }).sort_values('Importance', ascending=False)
        
        print("\nTop 10 Feature Importances:")
        print(feature_importance_df.head(10))
        
        # Plot feature importances
        plt.figure(figsize=(12, 8))
        sns.barplot(x='Importance', y='Feature', data=feature_importance_df.head(15))
        plt.title('Top 15 Feature Importances')
        plt.tight_layout()
        plt.savefig('feature_importances.png')
        print("\nFeature importance plot saved as 'feature_importances.png'")

# Function to predict food waste for new data
def predict_food_waste(new_data):
    """
    Predict food waste amount for new data.
    
    Parameters:
    -----------
    new_data : pandas.DataFrame
        Data containing the same features used for training
        
    Returns:
    --------
    numpy.ndarray
        Predicted food waste amounts
    """
    return best_model_tuned.predict(new_data)

# Save the trained model for later use
import joblib
joblib.dump(best_model_tuned, 'food_waste_prediction_model.pkl')
print("\nModel saved as 'food_waste_prediction_model.pkl'")

# Visualize actual vs predicted values
plt.figure(figsize=(10, 6))
plt.scatter(y_test, y_pred_tuned, alpha=0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--')
plt.xlabel('Actual Food Waste')
plt.ylabel('Predicted Food Waste')
plt.title('Actual vs Predicted Food Waste')
plt.tight_layout()
plt.savefig('actual_vs_predicted.png')
print("\nActual vs predicted plot saved as 'actual_vs_predicted.png'")

# Example: Creating a simple function to recommend actions based on predictions
def recommend_actions(food_type, predicted_waste, confidence):
    """
    Generate recommendations based on predicted food waste.
    
    Parameters:
    -----------
    food_type : str
        The type of food
    predicted_waste : float
        Predicted waste amount
    confidence : float
        Confidence in the prediction (e.g., R2 score)
        
    Returns:
    --------
    str
        Recommendation message
    """
    if predicted_waste > 30:
        message = f"High waste predicted for {food_type}. Consider:"
        recommendations = [
            "Reducing purchase quantity by 30%",
            "Offering discounts as expiration dates approach",
            "Donating to food banks before expiration"
        ]
    elif predicted_waste > 15:
        message = f"Moderate waste predicted for {food_type}. Consider:"
        recommendations = [
            "Reducing purchase quantity by 15%",
            "Creating promotions for items approaching expiration",
            "Adjusting storage conditions to extend shelf life"
        ]
    else:
        message = f"Low waste predicted for {food_type}. Continue with:"
        recommendations = [
            "Current ordering patterns",
            "Regular monitoring of inventory",
            "Optimizing display to encourage sales of older stock first"
        ]
    
    return message + "\n- " + "\n- ".join(recommendations)

# Example usage
print("\nExample Recommendation:")
example_food = 'Dairy Products'
example_waste = 35.0
example_confidence = r2_tuned
print(recommend_actions(example_food, example_waste, example_confidence))

print("\nTraining and evaluation complete!")



















