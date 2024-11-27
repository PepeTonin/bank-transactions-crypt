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


def getAllUserTransactions(cpf):
    connection = getDbConnection()
    cursor = connection.cursor()
    query = """
        SELECT 
            t.id, 
            t.cpf_sender, 
            u1.name AS name_sender, 
            t.cpf_recipient, 
            u2.name AS name_recipient, 
            t.amount, 
            t.event_datetime, 
            t.status
        FROM transactions t
        LEFT JOIN users u1 ON t.cpf_sender = u1.cpf
        LEFT JOIN users u2 ON t.cpf_recipient = u2.cpf
        WHERE t.cpf_sender = %s OR t.cpf_recipient = %s;
    """
    cursor.execute(query, (cpf, cpf))
    transactions = cursor.fetchall()
    cursor.close()
    connection.close()
    return transactions
