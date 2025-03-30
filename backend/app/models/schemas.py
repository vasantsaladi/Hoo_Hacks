from pydantic import BaseModel, Field
from typing import List, Optional

class PredictionRequest(BaseModel):
    """
    Input schema for food waste prediction
    """
    temperature: float = Field(..., description="Current temperature in Celsius")
    humidity: float = Field(..., description="Current humidity percentage")
    product_type: str = Field(..., description="Type of product (e.g., dairy, produce, bakery)")
    historical_sales: float = Field(..., description="Historical sales volume in kg")
    
    class Config:
        json_schema_extra = {
            "example": {
                "temperature": 25,
                "humidity": 60,
                "product_type": "dairy",
                "historical_sales": 1000
            }
        }

class PredictionResponse(BaseModel):
    """
    Output schema for food waste prediction
    """
    prediction: float = Field(..., description="Predicted food waste in kg")
    recommendations: List[str] = Field(..., description="Recommended actions to reduce waste")
    co2_saved: float = Field(..., description="Estimated CO2 emissions saved in kg")
