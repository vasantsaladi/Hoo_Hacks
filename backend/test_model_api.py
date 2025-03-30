"""
Test script for the food waste prediction API
"""
import requests
import json
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# API endpoint
API_URL = "http://localhost:8001/api/v1/predict"

def test_prediction_api():
    """
    Test the food waste prediction API with various scenarios
    """
    print("Testing food waste prediction API...")
    
    # Test case 1: Basic prediction
    test_case_1 = {
        "temperature": 25,
        "humidity": 60,
        "product_type": "dairy",
        "historical_sales": 1000
    }
    
    # Test case 2: With additional parameters
    test_case_2 = {
        "temperature": 22,
        "humidity": 55,
        "product_type": "meat",
        "historical_sales": 800,
        "number_of_guests": 300,
        "quantity_of_food": 400,
        "storage_conditions": "Refrigerated"
    }
    
    # Test case 3: Different product type
    test_case_3 = {
        "temperature": 28,
        "humidity": 65,
        "product_type": "vegetables",
        "historical_sales": 1200,
        "number_of_guests": 250,
        "quantity_of_food": 350
    }
    
    test_cases = [test_case_1, test_case_2, test_case_3]
    results = []
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest Case {i}:")
        print(json.dumps(test_case, indent=2))
        
        try:
            response = requests.post(API_URL, json=test_case)
            
            if response.status_code == 200:
                result = response.json()
                results.append(result)
                
                print(f"\nPrediction: {result['prediction']} kg")
                print(f"CO2 Saved: {result['co2_saved']} kg")
                print(f"Food Type: {result['food_type']}")
                
                if result.get('utilization_rate') is not None:
                    print(f"Utilization Rate: {result['utilization_rate'] * 100:.1f}%")
                
                print("\nRecommendations:")
                for i, rec in enumerate(result['recommendations'], 1):
                    print(f"{i}. {rec}")
            else:
                print(f"Error: {response.status_code}")
                print(response.text)
        except Exception as e:
            print(f"Error: {str(e)}")
    
    # Visualize results if we have enough data
    if len(results) >= 3:
        visualize_results(results)

def visualize_results(results):
    """
    Visualize the prediction results
    """
    # Extract data for visualization
    product_types = [result['food_type'] for result in results]
    predictions = [result['prediction'] for result in results]
    co2_saved = [result['co2_saved'] for result in results]
    
    # Create a DataFrame for easier plotting
    df = pd.DataFrame({
        'Product Type': product_types,
        'Predicted Waste (kg)': predictions,
        'CO2 Saved (kg)': co2_saved
    })
    
    # Plot predictions by product type
    plt.figure(figsize=(12, 6))
    
    # Plot 1: Predicted waste by product type
    plt.subplot(1, 2, 1)
    bars = plt.bar(df['Product Type'], df['Predicted Waste (kg)'], color='skyblue')
    plt.title('Predicted Food Waste by Product Type')
    plt.xlabel('Product Type')
    plt.ylabel('Predicted Waste (kg)')
    plt.xticks(rotation=45)
    
    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 0.1,
                f'{height:.1f}', ha='center', va='bottom')
    
    # Plot 2: CO2 saved by product type
    plt.subplot(1, 2, 2)
    bars = plt.bar(df['Product Type'], df['CO2 Saved (kg)'], color='lightgreen')
    plt.title('CO2 Emissions Saved by Product Type')
    plt.xlabel('Product Type')
    plt.ylabel('CO2 Saved (kg)')
    plt.xticks(rotation=45)
    
    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 0.1,
                f'{height:.1f}', ha='center', va='bottom')
    
    plt.tight_layout()
    plt.savefig('api_test_results.png')
    print("\nVisualization saved as 'api_test_results.png'")

if __name__ == "__main__":
    test_prediction_api()
