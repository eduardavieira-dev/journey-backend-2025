const usuariosRepository = require('../repositories/usuariosRepository');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');
const { registerSchema, loginSchema } = require('../utils/userValidations');
const { z } = require('zod');

const SECRET = process.env.JWT_SECRET || 'secret';

const login = async (req, res, next) => {
    try {
        const result = loginSchema.safeParse(req.body);
        if (!result.success) {
            throw new AppError(400, 'Dados inválidos', result.error.errors.map(e => e.message));
        }

        const { email, senha } = result.data;

        const usuario = await usuariosRepository.findUserByEmail(email);
        if (!usuario) {
            throw new AppError(401, 'Credenciais inválidas');
        }

        const senhaValida = await Bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            throw new AppError(401, 'Credenciais inválidas');
        }

        const token = jwt.sign({ id: usuario.id }, SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
            path: '/',
        });

        return res.status(200).json({
            access_token: token
        });

    } catch (error) {
        return next(error);
    }
};

const register = async (req, res, next) => {
    try {
        // Verifica se o corpo da requisição está vazio
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new AppError(400, 'Dados inválidos', ['Corpo da requisição não pode ser vazio']);
        }

        // Verifica campos extras
        const allowedFields = ['nome', 'email', 'senha'];
        const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
        if (extraFields.length > 0) {
            throw new AppError(400, 'Dados inválidos', [`Campos não permitidos: ${extraFields.join(', ')}`]);
        }

        // Verifica campos obrigatórios ausentes
        const camposObrigatorios = ['nome', 'email', 'senha'];
        const camposAusentes = camposObrigatorios.filter(campo => req.body[campo] === undefined);
        if (camposAusentes.length > 0) {
            throw new AppError(400, 'Dados inválidos', camposAusentes.map(campo => `${campo} é obrigatório`));
        }

        // Verifica campos vazios ou nulos
        for (const campo of camposObrigatorios) {
            if (req.body[campo] === null || req.body[campo] === '') {
                throw new AppError(400, 'Dados inválidos', [`${campo} não pode ser vazio ou nulo`]);
            }
        }

        const result = registerSchema.safeParse(req.body);
        if (!result.success) {
            throw new AppError(400, 'Dados inválidos', result.error.errors.map(e => e.message));
        }

        const { nome, email, senha } = result.data;

        const usuarioExistente = await usuariosRepository.findUserByEmail(email);
        if (usuarioExistente) {
            throw new AppError(400, 'Email já cadastrado');
        }

        const salt = await Bcrypt.genSalt(10);
        const senhaHash = await Bcrypt.hash(senha, salt);
        await usuariosRepository.createUser({ nome, email, senha: senhaHash });

        return res.status(201).json({
            message: "Usuario cadastrado com sucesso",
        });

    } catch (error) {
        return next(error);
    }
};

const me = async (req, res, next) => {
    try {
        const usuario = await usuariosRepository.findUserById(req.user.id);
        if (!usuario) {
            throw new AppError(404, 'Usuário não encontrado');
        }

        // Retorna apenas os dados públicos do usuário
        res.json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const usuario = await usuariosRepository.findUserById(id);
        if (!usuario) {
            throw new AppError(404, 'Usuario não encontrado');
        }

        const deleted = await usuariosRepository.deleteUser(id);
        if (!deleted) {
            throw new AppError(500, 'Erro ao deletar usuario');
        }

        return res.status(204).send();

    } catch (error) {
        return next(error);
    }
};


const logout = async (req, res, next) => {
    try {
        res.clearCookie('token', { path: '/' });
        return res.status(200).json({
            message: "Usuario deslogado com sucesso",
        });
    } catch (error) {
        return next(error);
    }
};

module.exports = {
    login,
    register,
    deleteUser,
    logout,
    me
};