from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from typing import Optional

class ResponseModel(BaseModel):
    status: str
    version: str

class TransactionModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float
    category: str
    description: Optional[str] = None
    date: str  # ISO format date string
