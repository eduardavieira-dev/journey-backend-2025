const db = require('../db/db');
const { AppError } = require('../utils/errorHandler');

async function findAll(filter = {}) {
    try {
        let query = db('casos').select('*');
        
        // Aplica filtros apenas se existirem
        if (Object.keys(filter).length > 0) {
            query = query.where(filter);
        }
        
        const result = await query;
        return result;
    } catch (error) {
        throw new AppError(500, 'Erro ao buscar casos', [error.message]);
    }
}

async function findById(id) {
    try {
        const result = await db('casos').select('*').where({ id }).first();
        return result;
    } catch (error) {
        throw new AppError(500, 'Erro ao buscar caso', [error.message]);
    }
}

async function create(caso) {
    try {
        const [newCaso] = await db('casos').insert(caso).returning('*');
        return newCaso;
    } catch (error) {
        throw new AppError(500, 'Erro ao criar caso', [error.message]);
    }
}

async function update(id, updatedCaso) {
    try {
        const [caso] = await db('casos').update(updatedCaso).where({ id }).returning('*');
        return caso;
    } catch (error) {
        throw new AppError(500, 'Erro ao atualizar caso', [error.message]);
    }
}

async function updatePartial(id, partialCaso) {
    try {
        const [caso] = await db('casos').update(partialCaso).where({ id }).returning('*');
        return caso;
    } catch (error) {
        throw new AppError(500, 'Erro ao atualizar caso', [error.message]);
    }
}

async function remove(id) {
    try {
        const rows = await db('casos').del().where({ id });
        return !!rows;
    } catch (error) {
        throw new AppError(500, 'Erro ao excluir caso', [error.message]);
    }
}

async function filter(term) {
    try {
        // Valida se o termo de busca foi fornecido
        if (!term || term.trim() === '') {
            return [];
        }
        
        const result = await db('casos')
            .select('*')
            .where('titulo', 'ilike', `%${term}%`)
            .orWhere('descricao', 'ilike', `%${term}%`);
        return result;
    } catch (error) {
        throw new AppError(500, 'Erro ao buscar casos', [error.message]);
    }
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    updatePartial,
    remove,
    filter,
};
