# Sistema de Estudo sobre Criptografia Moderna

## Descrição do Projeto

Este projeto foi desenvolvido para aprofundar os conhecimentos em criptografia moderna, abrangendo conceitos como criptografia simétrica, assimétrica, hash, derivação de chave e assinatura digital. 

O sistema permite o envio de dinheiro para outros usuários utilizando o CPF do destinatário. Ele conta com as seguintes funcionalidades principais:

- **Cadastro e login de usuários**.
- **Realização de transações entre usuários**.
- **Histórico de movimentações**.

### Funcionamento da Criptografia

1. **Início da Conexão**:
   - No lado do cliente, é gerado um par de chaves (pública e privada).
   - A chave pública é enviada ao servidor.
   - O servidor gera uma chave AES de 32 bytes (256 bits) e a envia ao cliente.
   - O cliente descriptografa a chave AES com sua chave privada, estabelecendo uma chave simétrica compartilhada para comunicação segura.

2. **Transmissão de Credenciais**:
   - As credenciais de login e cadastro são criptografadas pelo cliente usando a chave AES e enviadas ao servidor.
   - O servidor descriptografa os dados recebidos com a mesma chave AES.

3. **Armazenamento Seguro de Senhas**:
   - As senhas são armazenadas no banco de dados utilizando o algoritmo Argon2.

4. **Autenticação e Assinatura de Transações**:
   - Quando um usuário acessa sua conta, é gerado um novo par de chaves para assinatura de transações.
   - A chave pública do cliente é enviada ao servidor, que valida as assinaturas digitais das transações, garantindo autenticidade.

## Tecnologias Utilizadas

### Criptografia
- **Criptografia Simétrica**: AES256
- **Criptografia Assimétrica**: RSA
- **Hash para Assinatura Digital**: SHA256
- **Algoritmo Derivador de Chave**: Argon2

### Back-end
- **Linguagem**: Python
- **Framework**: FastAPI
- **Bibliotecas**:
  - Segurança e criptografia: [pyca/cryptography](https://cryptography.io/en/latest/)
  - Armazenamento seguro de senhas: [argon2-cffi](https://pypi.org/project/argon2-cffi/)

### Front-end
- **Linguagem**: TypeScript
- **Framework**: Next.js (React)
- **Bibliotecas**:
  - Segurança e criptografia: [crypto-js](https://www.npmjs.com/package/crypto-js)
  - RSA: [node-rsa](https://www.npmjs.com/package/node-rsa)

## Como Rodar o Projeto

### Back-end (Server):
1. Instale as dependências listadas no arquivo `requirements.txt`:
   ```bash
   pip install -r requirements.txt
   ```
2. Configure o banco de dados MySQL na sua máquina e crie o banco de dados. Não é necessário criar tabelas.
3. Configure o arquivo `.env` com as seguintes variáveis:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
4. Execute o servidor com o comando:
   ```bash
   fastapi dev main.py
   ```

### Front-end (View):
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Execute o projeto:
   ```bash
   npx next dev
   ```
