from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routers import predict
from slowapi import Limiter
from slowapi.util import get_remote_address

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Food Waste Predictor", version="1.0")

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add rate limiter to app state
app.state.limiter = limiter

# Include routers
app.include_router(predict.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Food Waste Prediction API"}
