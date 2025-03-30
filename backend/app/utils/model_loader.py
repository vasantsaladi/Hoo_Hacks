"""
Food waste prediction model loader
"""
import os
import logging
import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def predict_waste(input_data: Dict[str, Any]) -> Tuple[float, float, float]:
    """
    Predict food waste based on input data using a simplified model
    
    Args:
        input_data: Dictionary containing input features
        
    Returns:
        Tuple of (predicted waste in kg, CO2 emissions saved in kg, utilization rate)
    """
    try:
        # Prepare input data
        processed_data = prepare_input_data(input_data)
        
        # Extract key features
        food_type = processed_data.get('Type of Food', 'Other')
        quantity = processed_data.get('Quantity of Food', 400)
        guests = processed_data.get('Number of Guests', 300)
        temperature = processed_data.get('Current_Temperature', 25)
        storage = processed_data.get('Storage Conditions', 'Refrigerated')
        
        # Calculate food per guest ratio
        food_per_guest = quantity / guests if guests > 0 else 1.33
        
        # Calculate utilization rate based on key factors
        # Based on the model's feature importance: Utilization Rate (78%), Quantity of Food (8%), Number of Guests (5%)
        base_utilization = 0.85  # Start with 85% utilization
        
        # Adjust for food type
        food_type_factor = {
            'Dairy Products': 0.05,
            'Meat': 0.03,
            'Vegetables': -0.08,
            'Fruits': -0.05,
            'Baked Goods': -0.10,
            'Seafood': -0.12,  # Added seafood which has high waste potential
            'Other': 0.0
        }
        
        # Adjust for storage conditions
        storage_factor = {
            'Refrigerated': 0.0,
            'Frozen': 0.05,
            'Room Temperature': -0.10,
            'Heated': -0.15
        }
        
        # Adjust for temperature
        temp_factor = 0.0
        if temperature > 30:
            temp_factor = -0.10
        elif temperature > 25:
            temp_factor = -0.05
        elif temperature < 5:
            temp_factor = 0.05
        
        # Adjust for food per guest ratio
        if food_per_guest > 2.0:
            food_guest_factor = -0.15
        elif food_per_guest > 1.5:
            food_guest_factor = -0.10
        elif food_per_guest > 1.0:
            food_guest_factor = -0.05
        else:
            food_guest_factor = 0.0
            
        # Restaurant-specific adjustments
        # Historical data shows that restaurants with higher guest counts tend to have better utilization
        guest_size_factor = 0.0
        if guests > 500:
            guest_size_factor = 0.05
        elif guests > 300:
            guest_size_factor = 0.03
        elif guests < 100:
            guest_size_factor = -0.05
        
        # Calculate adjusted utilization rate
        utilization_rate = base_utilization + food_type_factor.get(food_type, 0.0) + \
                          storage_factor.get(storage, 0.0) + temp_factor + \
                          food_guest_factor + guest_size_factor
        
        # Ensure utilization rate is between 0 and 1
        utilization_rate = max(0.0, min(1.0, utilization_rate))
        
        # Calculate waste
        waste = quantity * (1 - utilization_rate)
        
        # Calculate CO2 emissions saved (2.5kg CO2 per kg food waste)
        co2_saved = waste * 2.5
        
        logger.info(f"Predicted waste: {waste:.2f}kg, CO2 saved: {co2_saved:.2f}kg, Utilization rate: {utilization_rate:.2f}")
        
        return round(waste, 2), round(co2_saved, 2), round(utilization_rate, 2)
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        return 0.0, 0.0, 0.0

def prepare_input_data(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Prepare input data for the model
    
    Args:
        input_data: Dictionary containing input features
        
    Returns:
        Dictionary with properly formatted input data
    """
    # Create a copy of the input data
    processed_data = input_data.copy()
    
    # Map product type to standardized food category if needed
    if 'product_type' in processed_data and 'Type of Food' not in processed_data:
        processed_data['Type of Food'] = map_product_type(processed_data.pop('product_type'))
    
    # Map temperature if needed
    if 'temperature' in processed_data and 'Current_Temperature' not in processed_data:
        processed_data['Current_Temperature'] = processed_data.pop('temperature')
    
    # Calculate derived features
    if 'Number of Guests' in processed_data and 'Quantity of Food' in processed_data:
        processed_data['Food_Per_Guest'] = processed_data['Quantity of Food'] / processed_data['Number of Guests']
    
    # Add default values for missing required features
    required_features = ['Type of Food', 'Number of Guests', 'Quantity of Food', 
                         'Storage Conditions', 'Current_Temperature', 'Food_Per_Guest']
    
    for feature in required_features:
        if feature not in processed_data:
            if feature == 'Type of Food':
                processed_data[feature] = 'Other'
            elif feature == 'Storage Conditions':
                processed_data[feature] = 'Refrigerated'
            elif feature == 'Number of Guests':
                # Estimate guests based on historical sales if available
                if 'historical_sales' in processed_data:
                    processed_data[feature] = int(processed_data['historical_sales'] / 3)  # Rough estimate
                else:
                    processed_data[feature] = 300  # Default value
            elif feature == 'Quantity of Food':
                # Use historical sales if available
                if 'historical_sales' in processed_data:
                    processed_data[feature] = processed_data['historical_sales']
                else:
                    processed_data[feature] = 400  # Default value
            elif feature == 'Food_Per_Guest':
                if 'Number of Guests' in processed_data and 'Quantity of Food' in processed_data:
                    processed_data[feature] = processed_data['Quantity of Food'] / processed_data['Number of Guests']
                else:
                    processed_data[feature] = 1.33  # Default value
    
    return processed_data

def map_product_type(product_type: str) -> str:
    """
    Map product type to standardized food category
    
    Args:
        product_type: Product type string
        
    Returns:
        Standardized food category
    """
    product_type = product_type.lower()
    
    if any(dairy in product_type for dairy in ['dairy', 'milk', 'cheese', 'yogurt', 'cream']):
        return "Dairy Products"
    elif any(meat in product_type for meat in ['meat', 'beef', 'chicken', 'pork', 'lamb']):
        return "Meat"
    elif any(veg in product_type for veg in ['vegetable', 'produce', 'veg']):
        return "Vegetables"
    elif any(fruit in product_type for fruit in ['fruit', 'apple', 'berry']):
        return "Fruits"
    elif any(grain in product_type for grain in ['bakery', 'bread', 'grain', 'pasta']):
        return "Baked Goods"
    elif any(seafood in product_type for seafood in ['seafood', 'fish', 'shrimp', 'shellfish']):
        return "Seafood"
    else:
        return "Other"

def generate_recommendations(food_type: str, predicted_waste: float) -> list:
    """
    Generate recommendations based on predicted food waste
    
    Args:
        food_type: Type of food
        predicted_waste: Predicted waste amount in kg
        
    Returns:
        List of recommendations
    """
    co2_emissions = predicted_waste * 2.5
    
    # Restaurant-specific recommendations
    if predicted_waste > 30:
        return [
            f"Reduce {food_type} purchase quantity by 30% to save approximately {predicted_waste:.2f}kg waste",
            f"Implement a 'daily special' using {food_type} items approaching expiration",
            f"Partner with food rescue organizations like 'Too Good To Go' to sell excess food at discounted prices",
            f"Train staff on proper storage techniques for {food_type} to extend shelf life",
            f"Use smaller serving plates to reduce portion sizes and minimize plate waste",
            f"Track waste daily with a simple log to identify patterns and problem areas"
        ]
    elif predicted_waste > 15:
        return [
            f"Reduce {food_type} purchase quantity by 15% to save approximately {predicted_waste:.2f}kg waste",
            f"Create a 'happy hour' menu to use up excess {food_type} inventory",
            f"Implement a first-in, first-out (FIFO) inventory system for {food_type}",
            f"Review portion sizes and adjust recipes to reduce {food_type} waste",
            f"Train kitchen staff on proper preparation techniques to minimize trim waste"
        ]
    else:
        return [
            f"Continue current ordering patterns for {food_type} with regular monitoring",
            f"Consider creative uses for {food_type} trimmings in stocks, sauces, or garnishes",
            f"Educate staff about the environmental impact of food waste",
            f"Implement a weekly waste audit to maintain awareness",
            f"Consider composting any unavoidable {food_type} waste"
        ]
