# Segue algumas instruções para rodar o projeto

## 1. Execução do container docker

```
docker compose --env-file .env up -d
```

## 2. Execução das migrations

```
npx knex migrate:latest
```

## 3. Execução dos seeds

```
npx knex seed:run
```
## Derrubar o banco
```
docker compose down -v
```