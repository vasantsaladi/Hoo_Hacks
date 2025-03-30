"""
AI-powered recommendations for food waste reduction
"""
import os
import logging
import requests
import json
import re
from typing import List, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get API key from environment variable
API_KEY = os.getenv("OPENAI_API_KEY")
if not API_KEY:
    logger.warning("OPENAI_API_KEY not found in environment variables. Using development key.")
    # This is just a placeholder - will be replaced by actual env var in production
    API_KEY = "placeholder-key-will-be-replaced-by-env-var"

async def generate_ai_recommendations(
    food_type: str, 
    predicted_waste: float, 
    co2_saved: float, 
    utilization_rate: float,
    input_data: Dict[str, Any]
) -> List[str]:
    """
    Generate personalized recommendations using OpenAI API based on prediction results
    
    Args:
        food_type: Type of food (e.g., Dairy Products, Meat, Vegetables)
        predicted_waste: Predicted waste amount in kg
        co2_saved: CO2 emissions saved in kg
        utilization_rate: Food utilization rate (0-1)
        input_data: Original input data used for prediction
        
    Returns:
        List of recommendations
    """
    try:
        # Extract additional context from input data
        temperature = input_data.get('Current_Temperature', 'unknown')
        humidity = input_data.get('Current_Humidity', 'unknown')
        storage_conditions = input_data.get('Storage Conditions', 'unknown')
        number_of_guests = input_data.get('Number of Guests', 'unknown')
        quantity_of_food = input_data.get('Quantity of Food', 'unknown')
        historical_sales = input_data.get('historical_sales', 'unknown')
        
        # Calculate target waste reduction (30% less)
        target_waste = predicted_waste * 0.7
        waste_to_reduce = predicted_waste * 0.3
        
        # Calculate potential financial savings (assuming $5 per kg of food)
        potential_savings = waste_to_reduce * 5
        
        # Create a detailed prompt for the AI with specific metrics
        prompt = f"""
        You are a data-driven food waste management expert. Based on the following precise metrics from a restaurant or food service operation, 
        provide 6 specific, actionable recommendations to reduce food waste. Include exact numbers and percentages in each recommendation.
        
        PRECISE METRICS:
        - Food Type: {food_type}
        - Predicted Food Waste: {predicted_waste:.1f} kg
        - Target Waste Reduction: {waste_to_reduce:.1f} kg (to reach {target_waste:.1f} kg)
        - CO2 Emissions Saved if Target Reached: {co2_saved:.1f} kg
        - Current Food Utilization Rate: {utilization_rate * 100:.1f}%
        - Target Utilization Rate: {min(utilization_rate * 1.3, 0.95) * 100:.1f}%
        - Storage Conditions: {storage_conditions}
        - Current Temperature: {temperature}°C
        - Current Humidity: {humidity}%
        - Number of Guests: {number_of_guests}
        - Quantity of Food: {quantity_of_food} kg
        - Historical Sales: {historical_sales} kg
        - Potential Financial Savings: ${potential_savings:.2f} (at $5/kg)
        
        INSTRUCTIONS:
        1. Provide exactly 6 specific, actionable recommendations
        2. Each recommendation MUST include specific numbers (kg, %, $) directly related to the data provided
        3. Focus on practical solutions that can be implemented immediately or in the short term
        4. Tailor recommendations specifically to {food_type} and the exact waste amount of {predicted_waste:.1f} kg
        5. Include quantitative targets (e.g., "Reduce {food_type} purchase quantity by 15.2% to save exactly 17.3 kg waste")
        6. Format each recommendation as a separate paragraph
        7. Do not number your recommendations
        8. Do not include any explanations, introductions, or conclusions
        
        RECOMMENDATIONS:
        """
        
        # Call the OpenAI API directly using requests
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {API_KEY}"
            }
            
            # Using gpt-3.5-turbo since o3-mini might not be available with the provided key
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "You are a data-driven food waste management expert providing concise, actionable recommendations with specific numbers and metrics."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.7,
                "max_tokens": 600
            }
            
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload
            )
            
            logger.info(f"OpenAI API response status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                if "choices" in result and result["choices"] and "message" in result["choices"][0]:
                    content = result["choices"][0]["message"]["content"].strip()
                    
                    # Split content by double newlines or bullet points to separate recommendations
                    raw_recommendations = re.split(r'\n\s*\n|\n\s*[-•*]\s*', content)
                    if len(raw_recommendations) < 3:  # If not enough splits by paragraphs, try single newlines
                        raw_recommendations = content.split('\n')
                    
                    # Process each recommendation
                    clean_recommendations = []
                    for rec in raw_recommendations:
                        if not rec.strip():
                            continue
                            
                        # Remove bullet points, numbering, and other formatting
                        clean_rec = rec.strip()
                        clean_rec = re.sub(r'^\s*[-•*]\s*', '', clean_rec)  # Remove bullet points
                        clean_rec = re.sub(r'^\s*\d+[\.\)\]]\s*', '', clean_rec)  # Remove numbering
                        clean_rec = re.sub(r'^\s*(Step|Recommendation|Point|Item)\s*\d+[:\.\)]\s*', '', clean_rec)  # Remove labeled numbering
                        
                        if clean_rec:
                            clean_recommendations.append(clean_rec)
                    
                    # Ensure we have distinct recommendations (not just line breaks in the same recommendation)
                    distinct_recommendations = []
                    current_recommendation = ""
                    
                    for rec in clean_recommendations:
                        # If this recommendation is very short, it might be part of the previous one
                        if len(rec) < 20 and current_recommendation:
                            current_recommendation += " " + rec
                        else:
                            if current_recommendation:
                                distinct_recommendations.append(current_recommendation)
                            current_recommendation = rec
                    
                    if current_recommendation:  # Add the last recommendation
                        distinct_recommendations.append(current_recommendation)
                    
                    # Limit to 6 recommendations
                    recommendations = distinct_recommendations[:6]
                    
                    # If we got fewer than 3 recommendations, add some fallback ones
                    if len(recommendations) < 3:
                        fallback = generate_fallback_recommendations(food_type, predicted_waste, waste_to_reduce, potential_savings)
                        recommendations.extend(fallback[:(3 - len(recommendations))])
                    
                    logger.info(f"Generated {len(recommendations)} AI recommendations")
                    return recommendations
                else:
                    logger.warning("Unexpected response format from OpenAI API")
            else:
                logger.error(f"OpenAI API error: {response.status_code} - {response.text}")
        
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {str(e)}")
        
        # If we get here, something went wrong with the API call
        logger.warning("Falling back to pre-defined recommendations")
        return generate_fallback_recommendations(food_type, predicted_waste, waste_to_reduce, potential_savings)
            
    except Exception as e:
        logger.error(f"Error generating AI recommendations: {str(e)}")
        return generate_fallback_recommendations(food_type, predicted_waste, waste_to_reduce, potential_savings)

def generate_fallback_recommendations(food_type: str, predicted_waste: float, waste_to_reduce: float, potential_savings: float) -> List[str]:
    """
    Generate fallback recommendations if OpenAI API fails
    
    Args:
        food_type: Type of food
        predicted_waste: Predicted waste amount in kg
        waste_to_reduce: Target amount of waste to reduce (kg)
        potential_savings: Potential financial savings ($)
        
    Returns:
        List of recommendations
    """
    # Restaurant-specific recommendations based on the food waste prediction model with concrete numbers
    if predicted_waste > 30:
        return [
            f"Reduce {food_type} purchase quantity by exactly 30% to save {waste_to_reduce:.1f} kg waste, resulting in ${potential_savings:.2f} cost savings per cycle.",
            f"Implement a 'daily special' using {food_type} items approaching expiration to utilize at least 15% ({(predicted_waste * 0.15):.1f} kg) of potential waste.",
            f"Partner with food rescue organizations to donate excess {food_type}, potentially saving up to {(predicted_waste * 0.2):.1f} kg of waste and {(predicted_waste * 0.2 * 2.5):.1f} kg of CO2 emissions.",
            f"Train staff on proper storage techniques for {food_type} to extend shelf life by 2-3 days, reducing spoilage by approximately {(predicted_waste * 0.12):.1f} kg.",
            f"Use smaller serving plates to reduce portion sizes by 15%, minimizing plate waste by an estimated {(predicted_waste * 0.15):.1f} kg.",
            f"Track waste daily with a digital log to identify patterns and reduce {food_type} waste by at least {(predicted_waste * 0.1):.1f} kg through targeted interventions."
        ]
    elif predicted_waste > 15:
        return [
            f"Reduce {food_type} purchase quantity by exactly 15% to save {waste_to_reduce:.1f} kg waste, resulting in ${potential_savings:.2f} cost savings per cycle.",
            f"Create a 'happy hour' menu to use up excess {food_type} inventory, potentially utilizing {(predicted_waste * 0.18):.1f} kg of product that would otherwise be wasted.",
            f"Implement a first-in, first-out (FIFO) inventory system for {food_type}, reducing spoilage by approximately {(predicted_waste * 0.12):.1f} kg.",
            f"Review portion sizes and adjust recipes to reduce {food_type} waste by {(predicted_waste * 0.15):.1f} kg, saving {(predicted_waste * 0.15 * 2.5):.1f} kg of CO2 emissions.",
            f"Train kitchen staff on proper preparation techniques to minimize trim waste, saving up to {(predicted_waste * 0.1):.1f} kg of {food_type}.",
            f"Conduct weekly inventory audits to identify slow-moving {food_type} items and reduce overstock by {(predicted_waste * 0.2):.1f} kg."
        ]
    else:
        return [
            f"Continue current ordering patterns for {food_type} with regular monitoring, but reduce order quantities by 10% to save {waste_to_reduce:.1f} kg waste.",
            f"Repurpose {food_type} trimmings in stocks, sauces, or garnishes to utilize approximately {(predicted_waste * 0.15):.1f} kg of potential waste.",
            f"Educate staff about the environmental impact of food waste, highlighting that reducing current waste by {waste_to_reduce:.1f} kg would save {(waste_to_reduce * 2.5):.1f} kg of CO2 emissions.",
            f"Implement a weekly waste audit to maintain awareness and identify opportunities to save up to ${potential_savings:.2f} in food costs.",
            f"Compost any unavoidable {food_type} waste, potentially diverting {predicted_waste:.1f} kg from landfills and reducing methane emissions by {(predicted_waste * 0.3):.1f} kg.",
            f"Develop staff training on proper portioning for {food_type} items to save approximately {(predicted_waste * 0.12):.1f} kg of product per cycle."
        ]
