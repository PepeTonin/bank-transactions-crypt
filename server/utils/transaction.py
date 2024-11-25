import json

from utils.sign import verifySign

from db.account import getUserBalance, getUserByCpf, updateUserBalance
from db.transaction import addTransaction


def executeTransaction(request):
    message = "transaction executed"
    statusCode = 200
    transactionStatus = "validada"

    # verificar se a assinatura é válida
    if not verifySign(request):
        message = "invalid sign"
        statusCode = 401
        transactionStatus = "assinatura invalida"

    transaction_hex = request.transaction
    transaction_bytes = bytes.fromhex(transaction_hex)
    transaction_str = transaction_bytes.decode("utf-8")
    transaction_dict = json.loads(transaction_str)

    # verificar saldo do sender
    senderBalance = getUserBalance(transaction_dict["sender"])
    if senderBalance < transaction_dict["amount"]:
        message = "insufficient balance"
        statusCode = 400
        transactionStatus = "saldo insuficiente"

    # verificar se o recipient existe
    recipient = getUserByCpf(transaction_dict["recipient"])
    if not recipient:
        message = "recipient not found"
        statusCode = 404
        transactionStatus = "destinatario invalido"

    # atualizar saldo do sender e do recipient
    if statusCode == 200:
        updateUserBalance(transaction_dict["sender"], -transaction_dict["amount"])
        updateUserBalance(transaction_dict["recipient"], transaction_dict["amount"])

    # salvar transacao no banco
    addTransaction(
        transaction_dict["sender"],
        transaction_dict["recipient"],
        transaction_dict["amount"],
        transactionStatus,
    )

    return message, statusCode
