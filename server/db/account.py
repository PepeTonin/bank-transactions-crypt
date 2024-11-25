from db.service import getDbConnection


def getUserBalance(cpf: str):
    connection = getDbConnection()
    cursor = connection.cursor()
    cursor.execute("SELECT balance FROM users WHERE cpf = %s", (cpf,))
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    return result[0] if result else None


def getUserByCpf(cpf: str):
    connection = getDbConnection()
    cursor = connection.cursor()
    cursor.execute(
        "SELECT id, name, email, cpf, balance FROM users WHERE cpf = %s", (cpf,)
    )
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    if result:
        return {
            "id": result[0],
            "name": result[1],
            "email": result[2],
            "cpf": result[3],
            "balance": result[4],
        }


def updateUserBalance(cpf: str, amount: float):
    connection = getDbConnection()
    cursor = connection.cursor()
    cursor.execute(
        "UPDATE users SET balance = balance + %s WHERE cpf = %s", (amount, cpf)
    )
    connection.commit()
    cursor.close()
    connection.close()


if __name__ == "__main__":
    print(getUserByCpf("45678901234"))
    updateUserBalance("45678901234", 100)
    print(getUserByCpf("45678901234"))
    updateUserBalance("45678901234", -100)
    print(getUserByCpf("45678901234"))