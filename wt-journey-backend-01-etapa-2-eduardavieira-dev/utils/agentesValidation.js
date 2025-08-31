const { z } = require('zod');

const agenteSchema = z.object({
    nome: z.string({ 
        required_error: 'Nome é obrigatório' 
    })
    .min(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' })
    .trim()
    .refine(nome => nome.length > 0, {
        message: 'Nome não pode estar vazio'
    }),
    
    dataDeIncorporacao: z.string({ 
        required_error: 'Data de incorporação é obrigatória' 
    })
    .refine(data => {
        const date = new Date(data);
        return !isNaN(date.getTime());
    }, {
        message: 'Data de incorporação deve estar em formato válido (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss.sssZ)'
    })
    .refine(data => {
        const date = new Date(data);
        const now = new Date();
        return date <= now;
    }, {
        message: 'Data de incorporação não pode ser futura'
    }),
    
    cargo: z.string({ 
        required_error: 'Cargo é obrigatório' 
    })
    .min(2, { message: 'Cargo deve ter pelo menos 2 caracteres' })
    .max(50, { message: 'Cargo deve ter no máximo 50 caracteres' })
    .trim()
    .refine(cargo => cargo.length > 0, {
        message: 'Cargo não pode estar vazio'
    })
    .transform(cargo => cargo.toLowerCase())
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

module.exports = { agenteSchema, formatZodError };