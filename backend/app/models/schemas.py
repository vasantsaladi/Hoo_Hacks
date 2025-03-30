from pydantic import BaseModel, Field
from typing import List, Optional

class PredictionRequest(BaseModel):
    """
    Input schema for food waste prediction
    """
    temperature: float = Field(..., description="Current temperature in Celsius")
    humidity: Optional[float] = Field(None, description="Current humidity percentage")
    product_type: str = Field(..., description="Type of product (e.g., dairy, produce, bakery)")
    historical_sales: float = Field(..., description="Historical sales volume in kg")
    
    # Additional fields for enhanced prediction
    number_of_guests: Optional[int] = Field(None, description="Number of guests (for restaurants)")
    quantity_of_food: Optional[float] = Field(None, description="Quantity of food prepared in kg")
    storage_conditions: Optional[str] = Field(None, description="Storage conditions (e.g., Refrigerated, Room Temperature)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "temperature": 25,
                "humidity": 60,
                "product_type": "dairy",
                "historical_sales": 1000,
                "number_of_guests": 300,
                "quantity_of_food": 400,
                "storage_conditions": "Refrigerated"
            }
        }

class PredictionResponse(BaseModel):
    """
    Output schema for food waste prediction
    """
    prediction: float = Field(..., description="Predicted food waste in kg")
    recommendations: List[str] = Field(..., description="Recommended actions to reduce waste")
    co2_saved: float = Field(..., description="Estimated CO2 emissions saved in kg")
    food_type: str = Field(..., description="Standardized food type category")
    utilization_rate: Optional[float] = Field(None, description="Estimated food utilization rate (percentage)")
