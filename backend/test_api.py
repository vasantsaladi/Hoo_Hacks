"""
Test cases for the Food Waste Prediction API
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Food Waste Prediction API"}

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_predict_endpoint():
    """Test the prediction endpoint with valid data"""
    test_data = {
        "temperature": 25,
        "humidity": 60,
        "product_type": "dairy",
        "historical_sales": 1000,
        "number_of_guests": 300,
        "quantity_of_food": 400,
        "storage_conditions": "Refrigerated"
    }
    
    response = client.post("/api/v1/predict", json=test_data)
    assert response.status_code == 200
    
    # Check response structure
    data = response.json()
    assert "prediction" in data
    assert "recommendations" in data
    assert "co2_saved" in data
    assert "food_type" in data
    assert isinstance(data["prediction"], float)
    assert isinstance(data["recommendations"], list)
    
def test_predict_endpoint_invalid_data():
    """Test the prediction endpoint with invalid data"""
    # Missing required fields
    test_data = {
        "product_type": "dairy"
    }
    
    response = client.post("/api/v1/predict", json=test_data)
    assert response.status_code == 422  # Validation error
