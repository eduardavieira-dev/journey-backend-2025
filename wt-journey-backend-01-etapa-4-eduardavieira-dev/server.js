const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const swagger = require('./docs/swagger');
const agentesRouter = require('./routes/agentesRoutes');
const casosRouter = require('./routes/casosRoutes');
const authRouter = require('./routes/authRoutes');
const { errorHandler } = require('./utils/errorHandler');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// Configurar Swagger ANTES das rotas
swagger(app);

// Registrar as rotas com seus prefixos corretos
app.use('/auth', authRouter);
app.use('/agentes', agentesRouter);
app.use('/casos', casosRouter);

// Middleware de tratamento de erros deve vir por último
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
    console.log(`API do Departamento de Polícia rodando em http://localhost:${PORT}/api-docs`);
});