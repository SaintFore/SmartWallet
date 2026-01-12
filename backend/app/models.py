from pydantic import BaseModel

class ResponseModel(BaseModel):
    status: str
    version: str
