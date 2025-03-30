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
        "food_type": "apple",
        "quantity": 1.5,
        "days_until_expiry": 7,
        "storage_condition": "refrigerated"
    }
    
    response = client.post("/api/v1/predict", json=test_data)
    assert response.status_code == 200
    
    # Check response structure
    data = response.json()
    assert "waste_probability" in data
    assert "recommended_actions" in data
    assert isinstance(data["waste_probability"], float)
    assert isinstance(data["recommended_actions"], list)
    
def test_predict_endpoint_invalid_data():
    """Test the prediction endpoint with invalid data"""
    # Missing required fields
    test_data = {
        "food_type": "apple"
    }
    
    response = client.post("/api/v1/predict", json=test_data)
    assert response.status_code == 422  # Validation error
