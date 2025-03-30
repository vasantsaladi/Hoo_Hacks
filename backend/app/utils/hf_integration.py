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
    if hf_token:
        client = InferenceClient(token=hf_token)
    else:
        logger.warning("HF_TOKEN environment variable not set. Using client without authentication.")
        client = InferenceClient()
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
    try:
        if client is None:
            # Fallback to mock recommendations if client initialization failed
            return generate_mock_recommendations(prediction)
            
        prompt = f"""Generate 3 actionable recommendations to reduce food waste for a predicted waste of {prediction}kg:
        1. Inventory adjustment: 
        2. Promotion strategy:
        3. Donation plan:"""
        
        response = client.text_generation(
            prompt=prompt,
            model="microsoft/phi-3-mini-128k-instruct",
            max_new_tokens=150
        )
        
        # Parse the response to extract the recommendations
        recommendations = parse_recommendations(response)
        return recommendations
    except Exception as e:
        logger.error(f"Error getting recommendations from Hugging Face: {str(e)}")
        # Fallback to mock recommendations
        return generate_mock_recommendations(prediction)

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
        
        # If we couldn't parse any recommendations, return mock ones
        if not recommendations:
            return generate_mock_recommendations(0)
            
        return recommendations
    except Exception as e:
        logger.error(f"Error parsing recommendations: {str(e)}")
        return generate_mock_recommendations(0)

def generate_mock_recommendations(prediction: float) -> List[str]:
    """
    Generate mock recommendations when Hugging Face is not available
    
    Args:
        prediction: Predicted food waste in kg
        
    Returns:
        List of mock recommendations
    """
    if prediction < 100:
        return [
            "1. Inventory adjustment: Implement just-in-time ordering for perishable items",
            "2. Promotion strategy: Create bundle offers for items approaching expiration date",
            "3. Donation plan: Partner with local food banks for regular small-scale donations"
        ]
    elif prediction < 500:
        return [
            "1. Inventory adjustment: Reduce order quantities by 15% for slow-moving items",
            "2. Promotion strategy: Implement dynamic pricing based on shelf life",
            "3. Donation plan: Set up a weekly donation schedule with multiple charitable organizations"
        ]
    else:
        return [
            "1. Inventory adjustment: Implement AI-driven inventory management to reduce overstocking",
            "2. Promotion strategy: Create a dedicated 'reduced to clear' section with significant discounts",
            "3. Donation plan: Establish a comprehensive food recovery program with multiple partners"
        ]
