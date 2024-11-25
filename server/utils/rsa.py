import os
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization


def storeSessionPublicKeyPem(sessionId: str, publicKey: str):
    path = f"keys/session/public_{sessionId}.pem"
    if os.path.exists(path):
        return
    with open(path, "w") as f:
        f.write(publicKey)


def storeUserPublicKeyPem(ownerCpf: str, publicKey: str):
    path = f"keys/users/public_{ownerCpf}.pem"
    if os.path.exists(path):
        return
    with open(path, "w") as f:
        f.write(publicKey)


def loadPulicKeyPem(path: str):
    with open(path, "r") as f:
        loadedPublicKey = serialization.load_pem_public_key(
            f.read().encode("utf-8"), backend=default_backend()
        )
    return loadedPublicKey


def encryptRsaPublicKey(message: bytes, publicKeyPath):

    loadedPublicKey = loadPulicKeyPem(publicKeyPath)

    padding_config = padding.PKCS1v15()

    cipherMessage = loadedPublicKey.encrypt(
        plaintext=message,
        padding=padding_config,
    )
    return cipherMessage
