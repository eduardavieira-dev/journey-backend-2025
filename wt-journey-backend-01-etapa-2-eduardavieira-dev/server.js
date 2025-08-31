const express = require('express')
const setUpSwagger = require('./docs/swagger');
const errorHandler = require('./utils/errorHandler');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const agentesRoutes = require('./routes/agentesRoutes');
const casosRoutes = require('./routes/casosRoutes');

app.use('/agentes', agentesRoutes);
app.use('/casos', casosRoutes);

setUpSwagger(app);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
    console.log(`API do Departamento de Polícia rodando em http://localhost:${PORT}/api-docs`);
});