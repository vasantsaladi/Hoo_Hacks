
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
    
    return message + "\n- " + "\n- ".join(recommendations)

recommendation = recommend_actions(input_data['Type of Food'], prediction[0])
print("\nRecommendation:")
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
    
    print(f"\nSimulation for different {param_name} values:")
    for i, val in enumerate(values):
        print(f"{param_name}: {val}, Predicted Waste: {results[i]:.2f} kg")
    
    return results

# Simulate different scenarios
guests_range = [100, 200, 300, 400, 500]
simulate_scenarios(input_data, 'Number of Guests', guests_range, 'Number of Guests')

temp_range = [15, 20, 25, 30, 35]
simulate_scenarios(input_data, 'Current_Temperature', temp_range, 'Temperature (°C)')

print("\nSimulation results saved as PNG files")
print("\nModel usage example complete!")
