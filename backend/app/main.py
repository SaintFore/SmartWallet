from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .models import ResponseModel, TransactionModel, AnalyzeRequest, AnalyzeResponse
from .database import get_session, create_db_and_tables
from .ai_analyze import analyze_text_with_graph
from sqlmodel import Session, select
from contextlib import asynccontextmanager
from fastapi import HTTPException


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
def create_transaction(
    transaction: TransactionModel, session: Session = Depends(get_session)
):
    session.add(transaction)
    session.commit()
    session.refresh(transaction)
    return transaction


@app.get("/api/transactions")
def get_transactions(session: Session = Depends(get_session)) -> list[TransactionModel]:
    statement = select(TransactionModel)
    transactions = list(session.exec(statement).all())
    return transactions


@app.delete("/api/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, session: Session = Depends(get_session)):
    transaction = session.get(TransactionModel, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    session.delete(transaction)
    session.commit()
    return {"ok": True}


@app.post("/api/analyze")
def analyze_transaction(request: AnalyzeRequest):
    data = analyze_text_with_graph(request.text)
    return AnalyzeResponse(result=data)
