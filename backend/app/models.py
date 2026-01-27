from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from typing import Optional, TypedDict


class ResponseModel(BaseModel):
    status: str
    version: str


class TransactionModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    amount: float
    category: str
    description: Optional[str] = None
    date: str  # ISO format date string


class TransactionInfo(BaseModel):
    amount: float = Field(description="交易金额必须是数字")
    category: str = Field(description="交易类别例如 食品、交通等")
    description: str = Field(description="交易描述")
    date: str = Field(description="交易日期，格式为YYYY-MM-DD")


class AnalyzeRequest(BaseModel):
    text: str


class AnalyzeResponse(BaseModel):
    result: Optional[TransactionInfo] = None


class AgentState(BaseModel):
    input_text: str
    parsed_result: TransactionInfo | None = None
