"""
Monitoring utilities for the food waste prediction API
"""
import logging
from datetime import datetime
from app.models.schemas import PredictionRequest

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("food_waste_api")

def log_prediction(input_data: PredictionRequest) -> None:
    """
    Log prediction request for monitoring
    
    Args:
        input_data: Input data for prediction
    """
    timestamp = datetime.now().isoformat()
    logger.info(
        f"Prediction request at {timestamp} - "
        f"Product: {input_data.product_type}, "
        f"Temperature: {input_data.temperature}°C, "
        f"Humidity: {input_data.humidity}%, "
        f"Historical Sales: {input_data.historical_sales}kg"
    )

def log_error(error_message: str, input_data: PredictionRequest = None) -> None:
    """
    Log error for monitoring
    
    Args:
        error_message: Error message
        input_data: Optional input data that caused the error
    """
    if input_data:
        logger.error(f"Error: {error_message} - Input: {input_data.model_dump()}")
    else:
        logger.error(f"Error: {error_message}")

def log_api_call(endpoint: str, method: str, status_code: int) -> None:
    """
    Log API call for monitoring
    
    Args:
        endpoint: API endpoint
        method: HTTP method
        status_code: HTTP status code
    """
    logger.info(f"API Call - Endpoint: {endpoint}, Method: {method}, Status: {status_code}")
