import json

from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes
from cryptography.exceptions import InvalidSignature

from utils.rsa import loadPulicKeyPem

from schemas.requests import SignedTransaction


def verifySign(signedTransaction: SignedTransaction):
    signedData = signedTransaction.dict()

    transaction_hex = signedData["transaction"]
    sign_hex = signedData["sign"]

    transaction_bytes = bytes.fromhex(transaction_hex)
    sign_bytes = bytes.fromhex(sign_hex)

    transaction_str = transaction_bytes.decode("utf-8")
    transaction_dict = json.loads(transaction_str)

    senderCpf = transaction_dict["sender"]

    publicKeyPath = f"keys/public_{senderCpf}.pem"
    publicKey = loadPulicKeyPem(publicKeyPath)

    # Configuração do preenchimento PSS para verificação da assinatura digital.
    padding_config = padding.PSS(
        mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH
    )

    # Validando a assinatura
    try:
        # O método verify da chave pública é chamado para verificar a assinatura.
        publicKey.verify(
            sign_bytes,  # A assinatura a ser verificada
            transaction_bytes,  # A mensagem original que foi assinada
            padding_config,  # Configuração de preenchimento PSS
            hashes.SHA256(),  # A mesma função hash usada para assinar a mensagem
        )
        return True
    except InvalidSignature:
        return False
