from utils.aes import generateKey
from utils.rsa import encryptRsaPublicKey


def getSessionKey(sessionId):
    sessionKey = generateKey(32)
    storeSessionKey(sessionId, sessionKey.hex())
    publicKeypath = f"keys/session/public_{sessionId}.pem"
    encryptedSessionKey = encryptRsaPublicKey(sessionKey, publicKeypath)
    encryptedSessionKeyHex = encryptedSessionKey.hex()
    return encryptedSessionKeyHex


def storeSessionKey(sessionId, sessionKey):
    path = f"keys/session/{sessionId}.key"
    with open(path, "w") as file:
        file.write(sessionKey)


def loadSessionKey(sessionId):
    path = f"keys/session/{sessionId}.key"
    with open(path, "r") as file:
        sessionKey = file.read()
    return sessionKey
