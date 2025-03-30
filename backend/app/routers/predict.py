from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import PredictionRequest, PredictionResponse
from app.utils.hf_integration import get_hf_recommendations
from app.utils.model_loader import predict_waste, map_product_type, generate_recommendations
from slowapi import Limiter
from slowapi.util import get_remote_address
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(tags=["Predictions"])

@router.post("/predict", response_model=PredictionResponse)
@limiter.limit("15/minute")
async def predict_waste_endpoint(prediction_request: PredictionRequest, request: Request):
    """
    Predict food waste based on input parameters using our optimized model
    """
    try:
        # Log the request
        logger.info(f"Received prediction request: {prediction_request.dict()}")
        
        # Prepare input data for the model
        input_data = {
            "Current_Temperature": prediction_request.temperature,
            "Current_Humidity": prediction_request.humidity if prediction_request.humidity is not None else 50,
            "Type of Food": map_product_type(prediction_request.product_type),
            "historical_sales": prediction_request.historical_sales
        }
        
        # Add optional fields if provided
        if prediction_request.number_of_guests is not None:
            input_data["Number of Guests"] = prediction_request.number_of_guests
        
        if prediction_request.quantity_of_food is not None:
            input_data["Quantity of Food"] = prediction_request.quantity_of_food
        
        if prediction_request.storage_conditions is not None:
            input_data["Storage Conditions"] = prediction_request.storage_conditions
        
        # Make prediction using our model
        prediction, co2_saved, utilization_rate = predict_waste(input_data)
        
        # Get food type for recommendations
        food_type = map_product_type(prediction_request.product_type)
        
        # Generate model-based recommendations
        model_recommendations = generate_recommendations(food_type, prediction)
        
        # Get additional recommendations from Hugging Face (if available)
        hf_recommendations = await get_hf_recommendations(prediction)
        
        # Combine recommendations, prioritizing model-based ones
        recommendations = model_recommendations
        
        # Add any unique HF recommendations
        for rec in hf_recommendations:
            if rec not in recommendations and len(recommendations) < 6:
                recommendations.append(rec)
        
        return PredictionResponse(
            prediction=prediction,
            recommendations=recommendations,
            co2_saved=co2_saved,
            food_type=food_type,
            utilization_rate=utilization_rate
        )
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}
