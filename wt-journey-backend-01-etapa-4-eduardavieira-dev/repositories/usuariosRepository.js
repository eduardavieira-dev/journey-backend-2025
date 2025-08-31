const db = require('../db/db');
const { AppError } = require('../utils/errorHandler');

async function findUserByEmail(email) {
    try {
        const user = await db('usuarios').where({ email }).first();
        return user;
    } catch (error) {
        throw new AppError(500, 'Erro ao buscar usuario por email', [error.message]);
    }
}

async function findUserById(id) {
    try {
        const user = await db('usuarios').where({ id }).first();
        return user;
    } catch (error) {
        throw new AppError(500, 'Erro ao buscar usuario por ID', [error.message]);
    }
}

async function createUser(userData) {
    try {
        const [user] = await db('usuarios').insert(userData).returning('*');
        return user;
    } catch (error) {
        throw new AppError(500, 'Erro ao criar usuario', [error.message]);
    }
}

async function deleteUser(id){
    try {
        return await db('usuarios').where({id}).del();
    } catch (error) {
        throw new AppError(500, 'Erro ao deletar usuario', [error.message]);
    }
}

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    deleteUser
};
