from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .models import ResponseModel, Transactions
from .database import get_session, create_db_and_tables
from sqlmodel import Session
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)

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

@app.post("/api/transactions")
def create_transaction(transaction: Transactions, session: Session = Depends(get_session)):
    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    return transaction
