from pydantic import BaseModel


class Transaction(BaseModel):
    sender: str
    recipient: str
    amount: float
    date: str
