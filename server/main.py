from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from db.service import initDb

from schemas.requests import GetPublicKey, SignedTransaction, InitSession, LoginRequest

from utils.rsa import storeUserPublicKeyPem, storeSessionPublicKeyPem
from utils.aes import useDecryptAes
from utils.session import getSessionKey, storeSessionKey, loadSessionKey
from utils.transaction import executeTransaction

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
def doLogin(request: LoginRequest):
    data = request.data
    iv = request.iv
    sessionId = request.sessionId
    sessionKey = loadSessionKey(sessionId)
    decryptedData = useDecryptAes(data, iv, sessionKey)
    return JSONResponse(
        content={
            "name": "teste",
            "cpf": "12345678901",
            "email": "email@email.com",
            "balance": 0,
        },
        status_code=200,
    )


@app.post("/signup")
def doSignup():
    return JSONResponse(content={"message": "signup"}, status_code=200)