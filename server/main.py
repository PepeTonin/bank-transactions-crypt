from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from db.service import initDb
from db.account import getUserBalance

from schemas.requests import (
    GetPublicKey,
    SignedTransaction,
    InitSession,
    AuthRequest,
)

from utils.rsa import storeUserPublicKeyPem, storeSessionPublicKeyPem
from utils.aes import useDecryptAes
from utils.session import getSessionKey, loadSessionKey
from utils.transaction import executeTransaction, executeGetUserTransactions
from utils.auth import tryUserLogin, tryUserSignup

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    initDb()


@app.post("/session")
def createSession(request: InitSession):
    sessionId = request.sessionId
    publicKey = request.publicKey
    storeSessionPublicKeyPem(sessionId, publicKey)
    sessionKey = getSessionKey(sessionId)
    return JSONResponse(
        content={"sessionId": sessionId, "sessionKey": sessionKey},
        status_code=200,
    )


@app.post("/publickey")
def getUserPublicKey(request: GetPublicKey):
    ownerCpf = request.cpfSender
    publicKey = request.publicKey
    storeUserPublicKeyPem(ownerCpf, publicKey)
    return JSONResponse(content={"message": "public key stored"}, status_code=200)


@app.post("/transaction")
def doTransaction(request: SignedTransaction):
    message, statusCode = executeTransaction(request)
    return JSONResponse(content={"message": message}, status_code=statusCode)


@app.post("/login")
def doLogin(request: AuthRequest):
    data = request.data
    iv = request.iv
    sessionId = request.sessionId
    sessionKey = loadSessionKey(sessionId)
    decryptedData = useDecryptAes(data, iv, sessionKey)
    user = tryUserLogin(decryptedData)
    if user is None:
        return JSONResponse(content={"message": "unauthorized"}, status_code=401)
    else:
        return JSONResponse(
            content=user,
            status_code=200,
        )


@app.post("/signup")
def doSignup(request: AuthRequest):
    data = request.data
    iv = request.iv
    sessionId = request.sessionId
    sessionKey = loadSessionKey(sessionId)
    decryptedData = useDecryptAes(data, iv, sessionKey)
    newUser = tryUserSignup(decryptedData)
    if newUser is None:
        return JSONResponse(
            content={"message": "credentials already in use"}, status_code=409
        )
    else:
        return JSONResponse(content=newUser, status_code=200)


@app.get("/transactions/{cpf}")
def getTransactions(cpf: str):
    transactions = executeGetUserTransactions(cpf)
    return JSONResponse(content=transactions, status_code=200)


@app.get("/balance/{cpf}")
def getBalance(cpf: str):
    balance = float(getUserBalance(cpf))
    return JSONResponse(content={"balance": balance}, status_code=200)
