from pydantic import BaseModel


class InitSession(BaseModel):
    sessionId: str
    publicKey: str


class GetPublicKey(BaseModel):
    cpfSender: str
    publicKey: str


class SignedTransaction(BaseModel):
    transaction: str
    sign: str


class AuthRequest(BaseModel):
    data: str
    iv: str
    sessionId: str
