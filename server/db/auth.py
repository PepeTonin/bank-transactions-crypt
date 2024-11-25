from db.service import getDbConnection


def getUserByEmail(email: str):
    connection = getDbConnection()
    cursor = connection.cursor()
    query = (
        "SELECT id, name, cpf, email, balance, hash_pass FROM users WHERE email = %s"
    )
    cursor.execute(query, (email,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    if user:
        return {
            "id": user[0],
            "name": user[1],
            "cpf": user[2],
            "email": user[3],
            "balance": float(user[4]),
            "hash_pass": user[5],
        }
    else:
        return None


def addUser(user: dict):
    connection = getDbConnection()
    cursor = connection.cursor()
    query = "INSERT INTO users (name, cpf, email, hash_pass) VALUES (%s, %s, %s, %s)"
    values = (
        user["name"],
        user["cpf"],
        user["email"],
        user["hash_pass"],
    )
    cursor.execute(query, values)
    connection.commit()
    newUserId = cursor.lastrowid
    cursor.close()
    connection.close()
    return newUserId


def getUserById(id: int):
    connection = getDbConnection()
    cursor = connection.cursor()
    cursor.execute(
        "SELECT id, name, email, cpf, balance FROM users WHERE id = %s", (id,)
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
            "balance": float(result[4]),
        }
