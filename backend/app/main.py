from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import ResponseModel

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    )

@app.get("/api/health", response_model=ResponseModel)
def get_health() -> ResponseModel:
    return ResponseModel(status="OK", version="v1.0")
