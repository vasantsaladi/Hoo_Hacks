"""
Test script for AI-powered recommendations in the Food Waste Predictor API
"""
import requests
import json

# API endpoint
API_URL = "http://localhost:8001/api/v1/predict"

def test_ai_recommendations():
    """
    Test the AI-powered recommendations feature
    """
    print("Testing AI-powered recommendations...")
    
    # Test case: Restaurant with vegetables
    payload = {
        "temperature": 25,
        "humidity": 60,
        "product_type": "vegetables",
        "historical_sales": 1000,
        "number_of_guests": 300,
        "quantity_of_food": 400,
        "storage_conditions": "Refrigerated"
    }
    
    try:
        # Send POST request to the API
        response = requests.post(API_URL, json=payload)
        
        # Check if request was successful
        if response.status_code == 200:
            result = response.json()
            
            # Print prediction results
            print(f"\nPrediction Results:")
            print(f"Predicted Waste: {result['prediction']} kg")
            print(f"Food Type: {result['food_type']}")
            print(f"CO2 Saved: {result['co2_saved']} kg")
            print(f"Utilization Rate: {result['utilization_rate'] * 100:.1f}%")
            
            # Print AI-powered recommendations
            print("\nAI-Powered Recommendations:")
            for i, recommendation in enumerate(result['recommendations'], 1):
                print(f"{i}. {recommendation}")
                
            return True
        else:
            print(f"Error: {response.status_code} - {response.text}")
            return False
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

if __name__ == "__main__":
    test_ai_recommendations()
