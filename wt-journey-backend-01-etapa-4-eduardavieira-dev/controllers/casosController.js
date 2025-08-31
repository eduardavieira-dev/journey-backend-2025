const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { AppError } = require('../utils/errorHandler');
const { isValidId } = require('../utils/validationUtils');

async function getAllCasos(req, res) {
    const agenteId = req.query.agente_id;
    const status = req.query.status;
    const filter = {};

    if (agenteId) {
        if (!isValidId(agenteId)) {
            throw new AppError(404, 'ID do agente inválido: deve ser um número inteiro positivo');
        }
        filter.agente_id = Number(agenteId);
    }

    if (status) {
        filter.status = status;
    }

    const casos = await casosRepository.findAll(filter);
    res.json(casos);
}

async function getCasosById(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
        throw new AppError(404, 'ID inválido: deve ser um número inteiro positivo');
    }

    const idNum = Number(id);
    const caso = await casosRepository.findById(idNum);

    if (!caso) {
        throw new AppError(404, 'Nenhum caso encontrado para o id especificado');
    }

    res.json(caso);
}

async function createCaso(req, res) {
    const { agente_id: agenteId } = req.body;

    if (!isValidId(agenteId)) {
        throw new AppError(404, 'ID do agente inválido: deve ser um número inteiro positivo');
    }

    const idNum = Number(agenteId);
    const agente = await agentesRepository.findById(idNum);

    if (!agente) {
        throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
    }


    const novoCaso = await casosRepository.create({ ...req.body, agente_id: idNum });
    res.status(201).json(novoCaso);
}

async function updateCaso(req, res) {
    const { id } = req.params;
    const { agente_id: agenteId } = req.body;

    if (!isValidId(id)) {
        throw new AppError(404, 'ID inválido: deve ser um número inteiro positivo');
    }

    if (!isValidId(agenteId)) {
        throw new AppError(404, 'ID do agente inválido: deve ser um número inteiro positivo');
    }

    const idNum = Number(id);
    const agenteIdNum = Number(agenteId);

    const agente = await agentesRepository.findById(agenteIdNum);
    if (!agente) {
        throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
    }

    const caso = await casosRepository.findById(idNum);
    if (!caso) {
        throw new AppError(404, 'Nenhum caso encontrado para o id especificado');
    }

    const updatedCaso = await casosRepository.update(idNum, { ...req.body, agente_id: agenteIdNum });
    res.status(200).json(updatedCaso);
}

async function updatePartialCaso(req, res) {
    const id = req.params.id;
    const agenteId = req.body.agente_id;

    // Validação do ID do caso
    if (!isValidId(id)) {
        throw new AppError(404, 'ID inválido: deve ser um número inteiro positivo');
    }

    if (req.body.id) {
        throw new AppError(400, 'Parâmetros inválidos', ['O id não pode ser atualizado']);
    }

    // If agente_id is provided, validate it
    if (agenteId) {
        if (!isValidId(agenteId)) {
            throw new AppError(404, 'ID do agente inválido: deve ser um número inteiro positivo');
        }

        const agente = await agentesRepository.findById(agenteId);
        if (!agente) {
            throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
        }
    }

    const idNum = Number(id);
    const caso = await casosRepository.findById(idNum);
    if (!caso) {
        throw new AppError(404, 'Nenhum caso encontrado para o id especificado');
    }

    const updatedCaso = await casosRepository.updatePartial(idNum, req.body);
    res.status(200).json(updatedCaso);
}

async function deleteCaso(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
        throw new AppError(404, 'ID inválido: deve ser um número inteiro positivo');
    }

    const idNum = Number(id);
    const caso = await casosRepository.findById(idNum);

    if (!caso) {
        throw new AppError(404, 'Nenhum caso encontrado para o id especificado');
    }

    const result = await casosRepository.remove(idNum);
    if (!result) {
        throw new AppError(500, 'Erro ao remover o caso');
    }

    res.status(204).send();
}
async function getAgenteByCasoId(req, res) {
    const casoId = req.params.id;  // Corrigido para usar o parâmetro correto da rota

    // Validação do ID do caso
    if (!isValidId(casoId)) {
        throw new AppError(404, 'ID do caso inválido: deve ser um número inteiro positivo');
    }

    const idNum = Number(casoId);
    const caso = await casosRepository.findById(idNum);
    if (!caso) {
        throw new AppError(404, 'Nenhum caso encontrado para o id especificado');
    }

    const agenteId = caso.agente_id;
    const agente = await agentesRepository.findById(agenteId);
    if (!agente) {
        throw new AppError(404, 'Nenhum agente encontrado para o agente_id especificado');
    }

    res.status(200).json(agente);
}

async function filter(req, res) {
    const term = req.query.q;
    const casos = await casosRepository.filter(term);

    if (casos.length === 0) {
        throw new AppError(404, 'Nenhum caso encontrado para a busca especificada');
    }

    res.json(casos);
}

module.exports = {
    getAllCasos,
    getCasosById,
    createCaso,
    updateCaso,
    updatePartialCaso,
    deleteCaso,
    getAgenteByCasoId,
    filter,
};
