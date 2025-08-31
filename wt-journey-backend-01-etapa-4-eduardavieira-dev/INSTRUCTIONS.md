# Guia de Instalação e Uso - API Departamento de Polícia

Este guia vai te ajudar a configurar e usar a API do Departamento de Polícia.

## Requisitos

- Node.js v20 ou superior
- npm (Node Package Manager)
- Docker e Docker Compose
- Postman (para testes)

## Instalação

1. Clone o repositório:

```bash

git clone https://github.com/wt-journey-backend-01/wt-journey-backend-01-etapa-4-eduardavieira-dev.git

cd wt-journey-backend-01-etapa-4-eduardavieira-dev
```

2. Instale as dependências:

```bash
npm install
```

3. Instale as dependências específicas para autenticação:

```bash
npm install jsonwebtoken bcrypt cookie-parser
```

4. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
JWT_SECRET=sua_chave_secreta_aqui

PORT=3000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=policia_db
NODE_ENV=development
```

## Iniciando o Projeto

1. Inicie o banco de dados:

```bash
docker compose --env-file .env up -d
```

2. Execute as migrações:

```bash
npx knex migrate:latest
```

3. Execute os seeds:

```bash
npx knex seed:run
```

Ou simplesmente use o comando que faz tudo isso:

```bash
npm run db:reset
```

4. Inicie o servidor:

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## Testando com Postman

1. **Criar nova requisição para Registro**:

   - Método: POST
   - URL: http://localhost:3000/auth/register
   - Headers: Content-Type: application/json
   - Body (raw JSON):
     ```json
     {
       "nome": "Eduarda",
       "email": "eduarda@gmail.com",
       "senha": "Dudinha@1234"
     }
     ```

2. **Criar nova requisição para Login**:
   - Método: POST
   - URL: http://localhost:3000/auth/login
   - Headers: Content-Type: application/json
   - Body (raw JSON):
     ```json
     {
       "email": "eduarda@gmail.com",
       "senha": "Dudinha@1234"
     }
     ```
   - Após o login, você receberá um token JWT na resposta

3. **Acessar rotas protegidas**:

   - Para qualquer rota de agentes ou casos, adicione o header:
   - Authorization: Bearer `<token-recebido-no-login>`

4. **Acessando Rotas Protegidas**:
   Agora você pode acessar todas as rotas protegidas:
   - GET /agentes - Lista todos os agentes
   - GET /casos - Lista todos os casos
   - POST /casos - Cria um novo caso
   - etc.

## Estrutura das Rotas

### Autenticação

- POST /auth/register - Registra novo usuário
- POST /auth/login - Faz login e retorna token
- POST /auth/logout - Faz logout
- DELETE /users/:id - Remove um usuário

### Agentes (Requer Autenticação)

- GET /agentes - Lista todos os agentes
- GET /agentes/:id - Detalhes de um agente
- POST /agentes - Cria novo agente
- PUT /agentes/:id - Atualiza um agente
- DELETE /agentes/:id - Remove um agente

### Casos (Requer Autenticação)

- GET /casos - Lista todos os casos
- GET /casos/:id - Detalhes de um caso
- POST /casos - Cria novo caso
- PUT /casos/:id - Atualiza um caso
- DELETE /casos/:id - Remove um caso

## Documentação API

A documentação completa da API está disponível em:

- Swagger UI: http://localhost:3000/api-docs

## Dicas e Solução de Problemas

1. **Erro de Autenticação (401)**:

   - Verifique se o token está configurado corretamente no Postman
   - Certifique-se de que o token não expirou (validade de 1 hora)

2. **Erro no Banco de Dados**:

   - Execute `npm run db:reset` para resetar o banco
   - Verifique se o Docker está rodando

3. **Token Expirado**:
   - Faça login novamente para obter um novo token
   - Atualize o token na variável da coleção do Postman

## Derrubar o Banco de Dados

Se precisar derrubar o banco:

```bash
docker compose down -v
```
