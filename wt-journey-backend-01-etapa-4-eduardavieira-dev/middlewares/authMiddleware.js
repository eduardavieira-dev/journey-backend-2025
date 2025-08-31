const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');
const usuariosRepository = require('../repositories/usuariosRepository');

const SECRET = process.env.JWT_SECRET || 'secret';

const authMiddleware = async (req, res, next) => {
    try {
        const cookieToken = req.cookies?.token;
        const authHeader = req.headers['authorization'];
        const headerToken = authHeader && authHeader.split(' ')[1];

        const token = cookieToken || headerToken;

        if (!token) {
            throw new AppError(401, 'Token não fornecido');
        }

        try {
            const decoded = jwt.verify(token, SECRET);
            const usuario = await usuariosRepository.findUserById(decoded.id);

            if (!usuario) {
                throw new AppError(401, 'Usuário não encontrado');
            }

            // Adiciona os dados do usuário à requisição (exceto a senha)
            req.user = {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            };

            next();
        } catch (err) {
            if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
                throw new AppError(401, 'Token inválido');
            }
            throw err;
        }
    } catch (error) {
        next(error);
    }
};

module.exports = authMiddleware;