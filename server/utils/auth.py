import json

from db.auth import getUserByEmail, addUser, getUserById
from db.account import getUserByCpf

from utils.hash import hashPasswordArgon2, verifyPasswordArgon2


def tryUserLogin(jsonData: str):
    userInput = json.loads(jsonData)
    userDb = getUserByEmail(userInput["email"])
    if userDb is None:
        return None
    if not verifyPasswordArgon2(userDb["hash_pass"], userInput["password"]):
        return None
    return {
        "id": userDb["id"],
        "name": userDb["name"],
        "cpf": userDb["cpf"],
        "email": userDb["email"],
        "balance": userDb["balance"],
    }


def tryUserSignup(jsonData: str):
    userInput = json.loads(jsonData)
    userDb = getUserByEmail(userInput["email"])
    if userDb is not None:
        return None
    userDb = getUserByCpf(userInput["cpf"])
    if userDb is not None:
        return None
    hashedPassword = hashPasswordArgon2(userInput["password"])
    userToInsert = {
        "name": userInput["name"],
        "cpf": userInput["cpf"],
        "email": userInput["email"],
        "hash_pass": hashedPassword,
    }
    newUserId = addUser(userToInsert)
    newUser = getUserById(newUserId)
    return newUser
