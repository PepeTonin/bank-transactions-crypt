from argon2 import PasswordHasher


def hashPasswordArgon2(password: str) -> str:
    ph = PasswordHasher()
    return ph.hash(password)


def verifyPasswordArgon2(hashedPass: str, planPass: str) -> bool:
    ph = PasswordHasher()
    try:
        ph.verify(hashedPass, planPass)
        return True
    except:
        return False
