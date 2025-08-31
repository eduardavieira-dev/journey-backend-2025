const { z } = require('zod');

const casoSchema = z.object({
    titulo: z.string({ 
        required_error: 'Título é obrigatório' 
    })
    .min(1, { message: 'Título deve ter pelo menos 1 caractere' })
    .max(200, { message: 'Título deve ter no máximo 200 caracteres' })
    .trim()
    .refine(titulo => titulo.length > 0, {
        message: 'Título não pode estar vazio'
    }),
    
    descricao: z.string({ 
        required_error: 'Descrição é obrigatória' 
    })
    .min(1, { message: 'Descrição deve ter pelo menos 1 caractere' })
    .max(1000, { message: 'Descrição deve ter no máximo 1000 caracteres' })
    .trim()
    .refine(descricao => descricao.length > 0, {
        message: 'Descrição não pode estar vazia'
    }),
    
    status: z.string()
    .optional()
    .default('aberto')
    .transform(status => status?.toLowerCase() || 'aberto')
    .refine(status => ['aberto', 'solucionado'].includes(status), {
        message: 'Status deve ser "aberto" ou "solucionado"'
    }),
    
    agente_id: z.string({ 
        required_error: 'ID do agente é obrigatório' 
    })
    .uuid({ message: 'ID do agente deve ser um UUID válido no formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
    .refine(id => id.length === 36, {
        message: 'ID do agente deve ter exatamente 36 caracteres no formato UUID'
    })
});

// Função para formatar erros do Zod de forma mais amigável
const formatZodError = (error) => {
    if (!error.errors || !Array.isArray(error.errors)) {
        return {
            status: 'error',
            statusCode: 400,
            message: 'Dados inválidos fornecidos',
            erros: [{
                campo: 'unknown',
                mensagem: error.message || 'Erro de validação',
                valorRecebido: 'N/A'
            }]
        };
    }

    const formattedErrors = error.errors.map(err => {
        const field = err.path ? err.path.join('.') : 'unknown';
        return {
            campo: field,
            mensagem: err.message || 'Erro de validação',
            valorRecebido: err.input || err.received || 'N/A'
        };
    });

    return {
        status: 'error',
        statusCode: 400,
        message: 'Dados inválidos fornecidos',
        erros: formattedErrors
    };
};

module.exports = { casoSchema, formatZodError };