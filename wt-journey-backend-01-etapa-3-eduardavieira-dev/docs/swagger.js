const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API do Departamento de Polícia',
            version: '1.0.0',
            description: 'Documentação da API do Departamento de Polícia com backend em Node.js e banco de dados PostgreSQL configurado com Docker. Utiliza IDs sequenciais (SERIAL) para identificação única dos registros.',
            contact: {
                name: 'Eduarda Vieira',
                email: 'eduarda.vieira.goncalves7@gmail.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor local de desenvolvimento',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;