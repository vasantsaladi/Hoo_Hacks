from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import PredictionRequest, PredictionResponse
from app.utils.hf_integration import get_hf_recommendations
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(tags=["Predictions"])

@router.post("/predict", response_model=PredictionResponse)
@limiter.limit("15/minute")
async def predict_waste(request: PredictionRequest, req: Request):
    """
    Predict food waste based on input parameters
    """
    try:
        # Temporary prediction formula (replace with actual model)
        base_prediction = 0.2 * request.historical_sales
        
        recommendations = await get_hf_recommendations(base_prediction)
        
        return PredictionResponse(
            prediction=round(base_prediction, 2),
            recommendations=recommendations,
            co2_saved=round(base_prediction * 2.5, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {"status": "healthy"}
