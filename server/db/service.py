import os
import mysql.connector
from dotenv import load_dotenv


load_dotenv()

db_config = {
    "host": os.getenv("DB_HOST"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "database": os.getenv("DB_NAME"),
}


def getDbConnection():
    connection = mysql.connector.connect(**db_config)
    return connection


def initDb():
    connection = getDbConnection()
    cursor = connection.cursor()
    create_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        cpf VARCHAR(11) NOT NULL UNIQUE,
        hash_pass VARCHAR(255) NOT NULL,
        balance DECIMAL(15, 2) DEFAULT 1000 NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """
    cursor.execute(create_table_query)
    connection.commit()
    create_table_query = """
    CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cpf_sender VARCHAR(11) NOT NULL,
        cpf_recipient VARCHAR(11),
        amount DECIMAL(10, 2) NOT NULL,
        event_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('validada', 'saldo insuficiente', 'assinatura invalida', 'destinatario invalido', 'erro nao mapeado') NOT NULL,
        FOREIGN KEY (cpf_sender) REFERENCES users(cpf),
        FOREIGN KEY (cpf_recipient) REFERENCES users(cpf)
    );
    """
    cursor.execute(create_table_query)
    connection.commit()
    cursor.close()
    connection.close()
