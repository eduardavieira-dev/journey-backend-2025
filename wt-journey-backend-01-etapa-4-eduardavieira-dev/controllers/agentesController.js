const agentesRepository = require('../repositories/agentesRepository');
const casosRepository = require('../repositories/casosRepository');
const { AppError } = require('../utils/errorHandler');
const { isValidId } = require('../utils/validationUtils');

async function getAllAgentes(req, res) {
    const cargo = req.query.cargo;
    const sort = req.query.sort;
    const filter = {};

    if (cargo) {
        filter.cargo = cargo;
    }

    const orderByMapping = {
        dataDeIncorporacao: ['dataDeIncorporacao', 'asc'],
        '-dataDeIncorporacao': ['dataDeIncorporacao', 'desc'],
    };

    let orderBy = orderByMapping[sort];
    const agentes = await agentesRepository.findAll(filter, orderBy);

    res.json(agentes);
}

async function getAgenteById(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
        throw new AppError(404, 'ID inválido: deve ser um número inteiro positivo');
    }

    const idNum = Number(id);
    const agente = await agentesRepository.findById(idNum);
    if (!agente) {
        throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
    }

    res.json(agente);
}

async function createAgente(req, res) {
    const novoAgente = await agentesRepository.create(req.body);
    res.status(201).json(novoAgente);
}

async function updateAgente(req, res) {
    const { id } = req.params;
    const idNum = Number(id);

    if (!Number.isInteger(idNum) || idNum <= 0) {
        throw new AppError(404, 'ID inválido: deve ser um número inteiro positivo');
    }

    const agente = await agentesRepository.findById(idNum);
    if (!agente) {
        throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
    }

    const updatedAgente = await agentesRepository.update(idNum, req.body);
    res.status(200).json(updatedAgente);
}

async function updatePartialAgente(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
        throw new AppError(404, 'ID inválido: deve ser um número inteiro positivo');
    }

    const idNum = Number(id);
    const agente = await agentesRepository.findById(idNum);
    if (!agente) {
        throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
    }

    const updatedAgente = await agentesRepository.updatePartial(idNum, req.body);
    res.status(200).json(updatedAgente);
}

async function deleteAgente(req, res) {
    const { id } = req.params;
    const idNum = Number(id);

    if (!Number.isInteger(idNum) || idNum <= 0) {
        throw new AppError(404, 'ID inválido: deve ser um número inteiro positivo');
    }

    const agente = await agentesRepository.findById(idNum);
    if (!agente) {
        throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
    }

    const result = await agentesRepository.remove(idNum);
    if (!result) {
        throw new AppError(500, 'Erro ao remover o agente');
    }

    res.status(204).send();
}

async function getCasosByAgenteId(req, res) {
    const { id } = req.params;
    const idNum = Number(id);

    if (!Number.isInteger(idNum) || idNum <= 0) {
        throw new AppError(404, 'ID inválido: deve ser um número inteiro positivo');
    }

    const agente = await agentesRepository.findById(idNum);
    if (!agente) {
        throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
    }

    const casos = await casosRepository.findAll({ agente_id: idNum });
    res.json(casos);
}

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    updatePartialAgente,
    deleteAgente,
    getCasosByAgenteId,
};
