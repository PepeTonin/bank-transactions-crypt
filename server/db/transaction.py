from db.service import getDbConnection


def addTransaction(cpfSender, cpfRecipient, amount, status):
    connection = getDbConnection()
    cursor = connection.cursor()
    query = """
        INSERT INTO transactions (cpf_sender, cpf_recipient, amount, status)
        VALUES (%s, %s, %s, %s);
        """
    valores = (cpfSender, cpfRecipient, amount, status)
    cursor.execute(query, valores)
    connection.commit()

    idTransaction = cursor.lastrowid
    cursor.close()
    connection.close()
    return idTransaction
