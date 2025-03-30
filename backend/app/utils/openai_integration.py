"""
OpenAI integration for generating food waste recommendations
"""
import os
import logging
from typing import List, Dict, Any
from openai import OpenAI
from fastapi import HTTPException

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_openai_client():
    """
    Creates and returns an OpenAI client with proper API key configuration
    """
    # Get API key from environment variable
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.warning("OPENAI_API_KEY not found in environment variables. Using development key.")
        # This is just a placeholder - will be replaced by actual env var in production
        api_key = "placeholder-key-will-be-replaced-by-env-var"
    
    try:
        client = OpenAI(api_key=api_key)
        return client
    except Exception as e:
        logger.error(f"Error initializing OpenAI client: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to initialize AI service")

# Initialize the OpenAI client
client = get_openai_client()
if client is not None:
    logger.info("OpenAI client initialized successfully")

async def generate_ai_recommendations(
    food_type: str, 
    predicted_waste: float, 
    co2_saved: float, 
    utilization_rate: float,
    input_data: Dict[str, Any]
) -> List[str]:
    """
    Generate personalized recommendations using OpenAI based on prediction results
    
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
        if client is None:
            logger.warning("OpenAI client not initialized. Using fallback recommendations.")
            return generate_fallback_recommendations(food_type, predicted_waste)
        
        # Extract additional context from input data
        temperature = input_data.get('Current_Temperature', 'unknown')
        humidity = input_data.get('Current_Humidity', 'unknown')
        storage_conditions = input_data.get('Storage Conditions', 'unknown')
        number_of_guests = input_data.get('Number of Guests', 'unknown')
        quantity_of_food = input_data.get('Quantity of Food', 'unknown')
        
        # Create a detailed prompt for the AI
        prompt = f"""
        You are a food waste management expert. Based on the following data from a restaurant or food service operation, 
        provide 6 specific, actionable recommendations to reduce food waste.
        
        DATA:
        - Food Type: {food_type}
        - Predicted Food Waste: {predicted_waste:.2f} kg
        - CO2 Emissions Saved if Waste is Reduced: {co2_saved:.2f} kg
        - Current Food Utilization Rate: {utilization_rate * 100:.1f}%
        - Storage Conditions: {storage_conditions}
        - Current Temperature: {temperature}°C
        - Current Humidity: {humidity}%
        - Number of Guests: {number_of_guests}
        - Quantity of Food: {quantity_of_food} kg
        
        INSTRUCTIONS:
        1. Provide exactly 6 specific, actionable recommendations
        2. Each recommendation should be 1-2 sentences and directly address the food waste issue
        3. Focus on practical solutions that can be implemented immediately or in the short term
        4. Tailor recommendations to the specific food type and waste amount
        5. Include quantitative targets where possible (e.g., "Reduce purchase quantity by 25%")
        6. DO NOT include any explanations, introductions, or conclusions
        7. Format each recommendation as a single paragraph without numbering
        
        RECOMMENDATIONS:
        """
        
        # Call the OpenAI API
        try:
            response = client.chat.completions.create(
                model="o3-mini", 
                messages=[
                    {"role": "system", "content": "You are a food waste management expert providing concise, actionable recommendations."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=400
            )
            
            # Extract and process the recommendations
            if response.choices and response.choices[0].message.content:
                raw_recommendations = response.choices[0].message.content.strip().split('\n')
                # Filter out empty lines and limit to 6 recommendations
                recommendations = [rec.strip() for rec in raw_recommendations if rec.strip()][:6]
                
                # If we got fewer than 3 recommendations, add some fallback ones
                if len(recommendations) < 3:
                    fallback = generate_fallback_recommendations(food_type, predicted_waste)
                    recommendations.extend(fallback[:(3 - len(recommendations))])
                
                logger.info(f"Generated {len(recommendations)} AI recommendations")
                return recommendations
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {str(e)}")
            # Fall back to model-based recommendations
            return generate_fallback_recommendations(food_type, predicted_waste)
            
        # If we get here, something went wrong with the API call
        logger.warning("Empty response from OpenAI API. Using fallback recommendations.")
        return generate_fallback_recommendations(food_type, predicted_waste)
            
    except Exception as e:
        logger.error(f"Error generating AI recommendations: {str(e)}")
        return generate_fallback_recommendations(food_type, predicted_waste)

def generate_fallback_recommendations(food_type: str, predicted_waste: float) -> List[str]:
    """
    Generate fallback recommendations if OpenAI API fails
    
    Args:
        food_type: Type of food
        predicted_waste: Predicted waste amount in kg
        
    Returns:
        List of recommendations
    """
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
            f"Train kitchen staff on proper preparation techniques to minimize trim waste",
            f"Conduct weekly inventory audits to identify slow-moving {food_type} items"
        ]
    else:
        return [
            f"Continue current ordering patterns for {food_type} with regular monitoring",
            f"Consider creative uses for {food_type} trimmings in stocks, sauces, or garnishes",
            f"Educate staff about the environmental impact of food waste",
            f"Implement a weekly waste audit to maintain awareness",
            f"Consider composting any unavoidable {food_type} waste",
            f"Develop staff training on proper portioning for {food_type} items"
        ]
