<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 5 créditos restantes para usar o sistema de feedback AI.

# Feedback para eduardavieira-dev:

Nota final: **74.9/100**

Olá, Eduarda! 🌟

Primeiramente, parabéns pelo empenho e pela estruturação do seu projeto! É muito legal ver como você organizou seu código seguindo a arquitetura MVC, com controllers, repositories, middlewares e rotas bem separadinhos. Isso é essencial para manter o código limpo, escalável e fácil de manter. 👏👏

Também quero destacar que você conseguiu implementar corretamente várias funcionalidades importantes, como o cadastro e login de usuários, geração de JWTs com expiração válida, logout, proteção das rotas de agentes e casos com middleware de autenticação, e até endpoints para criação, leitura, atualização e exclusão (CRUD) dos agentes e casos. Isso é um baita avanço! 🎉

Além disso, você conseguiu implementar os bônus que envolvem filtros complexos nas rotas de agentes e casos, busca por palavras-chave, e o endpoint `/usuarios/me` para retornar dados do usuário autenticado. Isso mostra que você foi além do básico e entregou funcionalidades que enriquecem muito a aplicação! Muito bom! 🚀✨

---

## Agora, vamos conversar sobre os testes que falharam e o que pode estar acontecendo para que eles não passem ainda. Lembre-se: entender a raiz do problema é o caminho para evoluir! 🕵️‍♀️🔍

### Lista dos testes que falharam (relacionados a usuários e IDs inválidos):

- USERS: Recebe erro 400 ao tentar criar um usuário com nome vazio  
- USERS: Recebe erro 400 ao tentar criar um usuário com nome nulo  
- USERS: Recebe erro 400 ao tentar criar um usuário com email vazio  
- USERS: Recebe erro 400 ao tentar criar um usuário com email nulo  
- USERS: Recebe erro 400 ao tentar criar um usuário com senha vazia  
- USERS: Recebe erro 400 ao tentar criar um usuário com senha curta demais  
- USERS: Recebe erro 400 ao tentar criar um usuário com senha sem números  
- USERS: Recebe erro 400 ao tentar criar um usuário com senha sem caractere especial  
- USERS: Recebe erro 400 ao tentar criar um usuário com senha sem letra maiúscula  
- USERS: Recebe erro 400 ao tentar criar um usuário com senha sem letras  
- USERS: Recebe erro 400 ao tentar criar um usuário com senha nula  
- USERS: Recebe erro 400 ao tentar criar um usuário com campo faltante  
- AGENTS: Recebe status code 404 ao tentar atualizar agente por completo com método PUT de agente de ID em formato incorreto  
- CASES: Recebe status code 404 ao tentar atualizar um caso por completo com método PUT de um caso com ID inválido  
- CASES: Recebe status code 404 ao tentar atualizar um caso parcialmente com método PATCH de um caso com ID inválido  

---

## Análise detalhada dos erros mais importantes

### 1. Validação dos dados de usuário no registro (vários testes USERS 400)

Você implementou uma validação usando o `zod` no `authController.js`, o que é ótimo! Porém, os testes indicam que algumas validações de campos obrigatórios e regras de senha não estão sendo capturadas corretamente, por exemplo:

- Nome vazio ou nulo não resulta no erro 400 esperado  
- Email vazio ou nulo idem  
- Senha com requisitos mínimos (mínimo 8 caracteres, pelo menos uma letra minúscula, uma maiúscula, número e caractere especial) não está sendo validada corretamente  

No seu `authController.js`, você faz:

```js
const result = registerSchema.safeParse(dados);
if (!result.success) {
    throw new AppError(400, 'Dados inválidos', result.error.errors.map(e => e.message));
}
```

Isso está correto, mas o problema provavelmente está no seu schema `registerSchema` no arquivo `utils/userValidations.js` (que não foi enviado aqui, mas podemos supor que é onde está a validação do `zod`).

**Possível causa raiz:**  
- O schema do `zod` pode não estar cobrindo todos os casos de validação da senha, ou o campo `nome` e `email` podem estar aceitando valores vazios (`""`) ou nulos (`null`) sem erro.  
- Além disso, no controller você faz um ajuste manual para preencher `null` se o campo estiver `undefined`, o que pode estar mascarando algum problema na validação.

**O que fazer:**  
- Certifique-se que o schema do `zod` está validando corretamente todos os requisitos, por exemplo, para a senha:

```js
senha: z.string()
  .min(8, "A senha deve ter no mínimo 8 caracteres")
  .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
  .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
  .regex(/[0-9]/, "A senha deve conter pelo menos um número")
  .regex(/[^a-zA-Z0-9]/, "A senha deve conter pelo menos um caractere especial")
```

- Para os campos `nome` e `email`, garanta que eles não aceitam strings vazias ou nulas:

```js
nome: z.string().min(1, "O nome é obrigatório"),
email: z.string().email("Email inválido").min(1, "O email é obrigatório"),
```

- Evite passar `null` para o `zod` para campos obrigatórios, deixe o próprio schema cuidar disso.

---

### 2. Validação de IDs inválidos em agentes e casos (testes com status 404)

Os testes indicam que ao atualizar agentes ou casos com IDs inválidos (ex: strings não numéricas, números negativos ou zero), o sistema deve retornar 404.

No seu código, por exemplo em `controllers/agentesController.js`, a função `updateAgente` faz:

```js
const idNum = Number(id);

if (!Number.isInteger(idNum) || idNum <= 0) {
    throw new AppError(404, 'ID inválido: deve ser um número inteiro positivo');
}
```

Isso está correto e deve funcionar. Porém, no `updatePartialCaso` do `casosController.js`, você faz:

```js
if (!id || !/^\d+$/.test(id)) {
    throw new AppError(404, 'ID inválido');
}
```

Aqui você está validando o ID parcialmente com regex, mas depois usa o ID sem converter para número e sem verificar se é maior que zero. Isso pode gerar inconsistência.

Além disso, no método `getAgenteByCasoId` do `casosController.js`, você usa `req.params.caso_id`, mas na rota `routes/casosRoutes.js` o parâmetro é `:id`:

```js
const casoId = req.params.caso_id;
```

Isso pode gerar `undefined` e falhas, já que o parâmetro correto é `id`.

**O que fazer:**  
- Padronize a validação do ID para converter para número e verificar se é inteiro positivo em todos os controllers. Exemplo:

```js
const idNum = Number(id);
if (!Number.isInteger(idNum) || idNum <= 0) {
    throw new AppError(404, 'ID inválido: deve ser um número inteiro positivo');
}
```

- Verifique se o nome do parâmetro na rota e no controller batem exatamente (ex: `id` vs `caso_id`). Corrija para usar `req.params.id` no método `getAgenteByCasoId`.

---

### 3. Validação da senha no schema e no controller

No `authController.js`, você faz uma validação manual para campos extras e corpo vazio, o que é ótimo para segurança. Porém, o fato de o teste falhar para vários casos de senha indica que o schema pode estar incompleto ou que o tratamento no controller está mascarando erros.

**Dica:** Você pode melhorar o tratamento no controller para não substituir `undefined` por `null`, e deixar o `zod` validar exatamente o que está chegando.

---

### 4. Estrutura dos diretórios

Sua estrutura está muito bem organizada e segue exatamente o que foi pedido no desafio. Parabéns por isso! Isso facilita muito a manutenção e a escalabilidade do projeto. 👍

---

## Recomendações de aprendizado para você:

- Para aprimorar as validações com `zod`, recomendo fortemente este vídeo, feito pelos meus criadores, que explica muito bem como usar schemas para validar dados no backend e garantir a segurança da API:  
https://www.youtube.com/watch?v=Q4LQOfYwujk

- Para entender melhor como usar JWT e bcrypt de forma segura e correta, este vídeo é excelente:  
https://www.youtube.com/watch?v=L04Ln97AwoY

- Se quiser reforçar a organização do seu projeto com arquitetura MVC e boas práticas, este vídeo é uma ótima referência:  
https://www.youtube.com/watch?v=bGN_xNc4A1k&t=3s

---

## Exemplo prático para corrigir o schema do usuário (em `utils/userValidations.js`):

```js
const { z } = require('zod');

const registerSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[^a-zA-Z0-9]/, "A senha deve conter pelo menos um caractere especial"),
});
```

E no controller, você pode simplificar para:

```js
const result = registerSchema.safeParse(req.body);
if (!result.success) {
    throw new AppError(400, 'Dados inválidos', result.error.errors.map(e => e.message));
}
const { nome, email, senha } = result.data;
```

Assim, o `zod` se encarrega de validar tudo, inclusive campos ausentes ou vazios.

---

## Resumo rápido do que focar para melhorar:

- [ ] Revisar e corrigir o schema de validação dos usuários para garantir que campos obrigatórios e regras de senha sejam corretamente validados (sem aceitar valores vazios ou nulos).  
- [ ] Padronizar a validação de IDs em todos os controllers, convertendo para número, verificando se é inteiro positivo e tratando erros com status 404.  
- [ ] Corrigir inconsistência no uso dos parâmetros das rotas (ex: `caso_id` vs `id`) para evitar `undefined` e erros na busca.  
- [ ] Simplificar o tratamento no controller para deixar o `zod` validar diretamente o corpo da requisição, evitando manipulações que possam mascarar erros.  
- [ ] Continuar usando o middleware de autenticação e proteção de rotas como está, pois está bem implementado!  

---

Eduarda, você está no caminho certo! 💪 A segurança e validação são pontos que exigem atenção especial, e com esses ajustes seu projeto vai ficar ainda mais robusto e profissional. Continue firme, aprendendo e aprimorando seu código! 🚀

Se precisar, volte a estudar os vídeos que recomendei e qualquer dúvida, estou aqui para ajudar! 😉

Um abraço e sucesso! 🌟✨

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>