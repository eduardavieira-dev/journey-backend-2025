const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { casoSchema, formatZodError } = require('../utils/casosValidation');
const { ZodError } = require('zod');

class ApiError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
    }
}

const getCasos = (req, res, next) => {
    try {
        const { agente_id, status, q } = req.query;
        let casos = casosRepository.findAll();
        
        if (agente_id) {
            casos = casos.filter(caso => caso.agente_id === agente_id);
            if (casos.length === 0) {
                throw new ApiError(`Casos com agente_id "${agente_id}" não encontrados.`, 404);
            }
        }
        
        if (status) {
            casos = casos.filter(caso => 
                caso.status.toLowerCase() === status.toLowerCase()
            );
            if (casos.length === 0) {
                throw new ApiError(`Casos com status "${status}" não encontrados.`, 404);
            }
        }
        
        // Buscar por termo se fornecido
        if (q) {
            const searchTerm = q.trim().toLowerCase();
            if (searchTerm.length > 0) { 
                const casosFiltrados = casos.filter(caso => {
                    const tituloLower = caso.titulo ? caso.titulo.toLowerCase() : '';
                    const descricaoLower = caso.descricao ? caso.descricao.toLowerCase() : '';
                    const termos = searchTerm.split(' ');
                    
                    return termos.every(termo => 
                        tituloLower.includes(termo) || descricaoLower.includes(termo)
                    );
                });
                
                if (casosFiltrados.length === 0) {
                    throw new ApiError(`Nenhum caso encontrado com o termo "${q}".`, 404);
                }
                casos = casosFiltrados;
            }
        }
        
        res.status(200).json(casos);
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao buscar casos', 500));
    }
};

const getCasoById = (req, res, next) => {
    const { id } = req.params;
    try {
        const caso = casosRepository.findById(id);
        if (!caso) {
            throw new ApiError('Caso não encontrado', 404);
        }
        res.status(200).json(caso);
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao buscar caso', 500));
    }
};

const createCaso = (req, res, next) => {
    try {
        const { titulo, descricao, status, agente_id } = req.body;

        const dadosRecebidos = {
            titulo,
            descricao,
            status: status || 'aberto',
            agente_id
        };

        // Validar primeiro com Zod
        const data = casoSchema.parse(dadosRecebidos);
        
        // Depois verificar se o agente existe
        const agenteExiste = agentesRepository.findById(data.agente_id);
        if (!agenteExiste) {
            throw new ApiError('Agente não encontrado. Verifique se o agente_id é válido.', 404);
        }

        const novoCaso = casosRepository.create(data);
        res.status(201).json(novoCaso);
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedError = formatZodError(error);
            return res.status(400).json(formattedError);
        }
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao criar caso', 500));
    }
};
const updateCaso = (req, res, next) => {
    const { id } = req.params;
    try {
        // Rejeitar se payload contém id
        if ('id' in req.body) {
            return res.status(400).json({ message: 'Não é permitido alterar o campo id' });
        }

        const { titulo, descricao, status, agente_id } = req.body;

        const dadosRecebidos = {
            titulo,
            descricao,
            status,
            agente_id
        };

        // Validar primeiro com Zod
        const data = casoSchema.parse(dadosRecebidos);
        
        // Verificar se o agente existe se agente_id foi fornecido
        if (data.agente_id) {
            const agenteExiste = agentesRepository.findById(data.agente_id);
            if (!agenteExiste) {
                throw new ApiError('Agente não encontrado. Verifique se o agente_id é válido.', 404);
            }
        }

        const casoAtualizado = casosRepository.update(id, data);

        if (!casoAtualizado) {
            throw new ApiError('Caso não encontrado', 404);
        }
        res.status(200).json({
            message: 'Caso atualizado com sucesso',
            data: casoAtualizado
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const formattedError = formatZodError(error);
            return res.status(400).json(formattedError);
        }
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao atualizar caso', 500));
    }
};

const partialUpdateCaso = (req, res, next) => {
    const { id } = req.params;
    try {
        // Rejeitar se payload contém id
        if ('id' in req.body) {
            return res.status(400).json({ message: 'Não é permitido alterar o campo id' });
        }

        const { titulo, descricao, status, agente_id } = req.body;

        const dadosRecebidos = {};
        if (titulo !== undefined) dadosRecebidos.titulo = titulo;
        if (descricao !== undefined) dadosRecebidos.descricao = descricao;
        if (status !== undefined) dadosRecebidos.status = status;
        if (agente_id !== undefined) dadosRecebidos.agente_id = agente_id;

        // Validar primeiro com Zod
        const data = casoSchema.partial().parse(dadosRecebidos);

        // Verificar se o agente existe se agente_id foi fornecido
        if (data.agente_id) {
            const agenteExiste = agentesRepository.findById(data.agente_id);
            if (!agenteExiste) {
                throw new ApiError('Agente não encontrado. Verifique se o agente_id é válido.', 404);
            }
        }

        const casoAtualizado = casosRepository.update(id, data);

        if (!casoAtualizado) {
            return next(new ApiError('Caso não encontrado', 404));
        }

        res.status(200).json({
            message: 'Caso atualizado com sucesso',
            data: casoAtualizado
        });

    } catch (error) {
        if (error instanceof ZodError) {
            const formattedError = formatZodError(error);
            return res.status(400).json(formattedError);
        }
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao atualizar caso', 500));
    }
};


const deleteCaso = (req, res, next) => {
    const { id } = req.params;
    try {
        const casoDeletado = casosRepository.remove(id);
        if (!casoDeletado) {
            throw new ApiError('Caso não encontrado', 404);
        }
        res.status(204).send();
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao deletar caso', 500));
    }
};

const getAgenteDoCaso = (req, res, next) => {
    const { id } = req.params;
    try {
        const caso = casosRepository.findById(id);
        if (!caso) {
            throw new ApiError(`Caso com ID ${id} não encontrado`, 404);
        }
        
        const agente = agentesRepository.findById(caso.agente_id);
        if (!agente) {
            throw new ApiError(`Agente com ID ${caso.agente_id} não encontrado para o caso ${id}`, 404);
        }
        
        res.status(200).json(agente);
    } catch (error) {
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError('Erro ao buscar agente do caso', 500));
    }
};

module.exports = {
    getCasos,
    getCasoById,
    createCaso,
    updateCaso,
    partialUpdateCaso,
    deleteCaso,
    getAgenteDoCaso
};