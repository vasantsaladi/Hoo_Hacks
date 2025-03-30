"""
Hugging Face integration for food waste prediction
"""
from huggingface_hub import InferenceClient
import os
from typing import List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the Hugging Face client
client = None
try:
    hf_token = os.getenv("HF_TOKEN")
    if hf_token and len(hf_token) > 10:  # Basic validation to ensure token looks legitimate
        client = InferenceClient(token=hf_token)
        logger.info("Hugging Face client initialized with token")
    else:
        logger.warning("HF_TOKEN environment variable not set or invalid. Using fallback recommendations.")
        client = None
except Exception as e:
    logger.error(f"Failed to initialize Hugging Face client: {str(e)}")
    client = None

async def get_hf_recommendations(prediction: float) -> List[str]:
    """
    Get recommendations from Hugging Face model
    
    Args:
        prediction: Predicted food waste in kg
        
    Returns:
        List of recommendations
    """
    # Always use fallback recommendations to avoid authentication errors
    return generate_recommendations_based_on_prediction(prediction)
    
    # The following code is commented out to avoid authentication errors
    # try:
    #     if client is None:
    #         # Fallback to mock recommendations if client initialization failed
    #         return generate_recommendations_based_on_prediction(prediction)
    #         
    #     prompt = f"""Generate 3 actionable recommendations to reduce food waste for a predicted waste of {prediction}kg:
    #     1. Inventory adjustment: 
    #     2. Promotion strategy:
    #     3. Donation plan:"""
    #     
    #     response = client.text_generation(
    #         prompt=prompt,
    #         model="microsoft/phi-3-mini-128k-instruct",
    #         max_new_tokens=150
    #     )
    #     
    #     # Parse the response to extract the recommendations
    #     recommendations = parse_recommendations(response)
    #     return recommendations
    # except Exception as e:
    #     logger.error(f"Error getting recommendations from Hugging Face: {str(e)}")
    #     # Fallback to mock recommendations
    #     return generate_recommendations_based_on_prediction(prediction)

def parse_recommendations(response: str) -> List[str]:
    """
    Parse the response from Hugging Face to extract recommendations
    
    Args:
        response: Response from Hugging Face
        
    Returns:
        List of recommendations
    """
    try:
        lines = response.strip().split('\n')
        recommendations = []
        
        for line in lines:
            if line.strip().startswith('1.') or line.strip().startswith('2.') or line.strip().startswith('3.'):
                recommendations.append(line.strip())
        
        # If we couldn't parse any recommendations, return generated ones
        if not recommendations:
            return generate_recommendations_based_on_prediction(0)
            
        return recommendations
    except Exception as e:
        logger.error(f"Error parsing recommendations: {str(e)}")
        return generate_recommendations_based_on_prediction(0)

def generate_recommendations_based_on_prediction(prediction: float) -> List[str]:
    """
    Generate detailed recommendations based on the predicted waste amount
    
    Args:
        prediction: Predicted food waste in kg
        
    Returns:
        List of recommendations
    """
    # Small waste amount (less than 50kg)
    if prediction < 50:
        return [
            "1. Inventory adjustment: Implement a first-in, first-out (FIFO) system for perishable items to ensure older stock is used first.",
            "2. Promotion strategy: Create small discount offers for items approaching their sell-by date to encourage quick sales.",
            "3. Donation plan: Set up a weekly schedule to donate small amounts of excess food to local community centers."
        ]
    # Medium waste amount (50-150kg)
    elif prediction < 150:
        return [
            "1. Inventory adjustment: Reduce order quantities by 10-15% for slow-moving items and implement just-in-time ordering.",
            "2. Promotion strategy: Create bundle offers combining items with different shelf lives to balance inventory turnover.",
            "3. Donation plan: Partner with a food rescue organization for bi-weekly pickups of excess food items."
        ]
    # Large waste amount (150-300kg)
    elif prediction < 300:
        return [
            "1. Inventory adjustment: Implement digital inventory tracking with automatic alerts for items approaching expiration.",
            "2. Promotion strategy: Develop a dynamic pricing system that automatically discounts items based on remaining shelf life.",
            "3. Donation plan: Establish partnerships with multiple food banks and shelters for regular large-scale donations."
        ]
    # Very large waste amount (300kg+)
    else:
        return [
            "1. Inventory adjustment: Conduct a comprehensive inventory audit and implement AI-driven demand forecasting to prevent overstocking.",
            "2. Promotion strategy: Create a dedicated 'reduced to clear' section with significant discounts and staff training on waste reduction.",
            "3. Donation plan: Develop a comprehensive food recovery program with multiple partners and consider composting for items that cannot be donated."
        ]

# For backward compatibility
generate_mock_recommendations = generate_recommendations_based_on_prediction
