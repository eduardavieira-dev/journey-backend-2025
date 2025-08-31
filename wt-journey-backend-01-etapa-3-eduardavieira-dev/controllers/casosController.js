const casosRepository = require('../repositories/casosRepository');
const agentesRepository = require('../repositories/agentesRepository');
const { AppError } = require('../utils/errorHandler');

async function getAllCasos(req, res) {
    const agenteId = req.query.agente_id;
    const status = req.query.status;
    const filter = {};

    if (agenteId) {
        filter.agente_id = agenteId;
    }

    if (status) {
        filter.status = status;
    }

    const casos = await casosRepository.findAll(filter);

    res.json(casos);
}

async function getCasosById(req, res) {
    const id = Number(req.params.id);

    if (!id || !Number.isInteger(id)) {
        throw new AppError(404, 'Id inválido');
    }

    const caso = await casosRepository.findById(id);

    if (!caso) {
        throw new AppError(404, 'Nenhum caso encontrado para o id especificado');
    }

    res.json(caso);
}

async function createCaso(req, res) {
    const agenteId = req.body.agente_id;

    if (agenteId) {
        const agente = await agentesRepository.findById(agenteId);

        if (!agente) {
            throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
        }
    } else {
        throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
    }

    const novoCaso = await casosRepository.create(req.body);

    res.status(201).json(novoCaso);
}

async function updateCaso(req, res) {
    const id = req.params.id;
    const agenteId = req.body.agente_id;

    if (agenteId) {
        const agente = await agentesRepository.findById(agenteId);

        if (!agente) {
            throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
        }
    } else {
        throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
    }

    const caso = await casosRepository.findById(id);

    if (!caso) {
        throw new AppError(404, 'Nenhum caso encontrado para o id especificado');
    }

    const updatedCaso = await casosRepository.update(id, req.body);

    res.status(200).json(updatedCaso);
}

async function updatePartialCaso(req, res) {
    const id = req.params.id;

    if (req.body.id) {
        throw new AppError(400, 'Parâmetros inválidos', ['O id não pode ser atualizado']);
    }

    const agenteId = req.body.agente_id;

    if (agenteId) {
        const agente = await agentesRepository.findById(agenteId);

        if (!agente) {
            throw new AppError(404, 'Nenhum agente encontrado para o id especificado');
        }
    }

    const caso = await casosRepository.findById(id);

    if (!caso) {
        throw new AppError(404, 'Nenhum caso encontrado para o id especificado');
    }

    const updatedCaso = await casosRepository.updatePartial(id, req.body);

    res.status(200).json(updatedCaso);
}

async function deleteCaso(req, res) {
    const id = req.params.id;
    const caso = await casosRepository.findById(id);

    if (!caso) {
        throw new AppError(404, 'Nenhum caso encontrado para o id especificado');
    }

    const result = await casosRepository.remove(id);

    if (!result) {
        throw new AppError(500, 'Erro ao remover o agente');
    }

    res.status(204).send();
}

async function getAgenteByCasoId(req, res) {
    const casoId = req.params.caso_id;
    const caso = await casosRepository.findById(casoId);

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
