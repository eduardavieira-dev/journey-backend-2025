const express = require('express');
const router = express.Router();
const agentesController = require('../controllers/agentesController');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    newAgenteValidation,
    updateAgenteValidation,
    partialUpdateAgenteValidation,
} = require('../utils/agentesValidations');

// Protege todas as rotas de agentes
router.use(authMiddleware);

/**
 * @openapi
 * components:
 *   schemas:
 *     Agente:
 *       type: object
 *       required:
 *         - nome
 *         - dataDeIncorporacao
 *         - cargo
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do agente (gerado automaticamente)
 *         nome:
 *           type: string
 *           minLength: 2
 *           description: Nome completo do agente
 *         dataDeIncorporacao:
 *           type: string
 *           format: date
 *           description: Data de incorporação do agente
 *         cargo:
 *           type: string
 *           minLength: 2
 *           description: Cargo do agente
 *       example:
 *         id: 1
 *         nome: "João Silva"
 *         dataDeIncorporacao: "2022-01-15"
 *         cargo: "Investigador"
 *     NovoAgente:
 *       type: object
 *       required:
 *         - nome
 *         - dataDeIncorporacao
 *         - cargo
 *       properties:
 *         nome:
 *           type: string
 *           minLength: 2
 *           description: Nome completo do agente
 *         dataDeIncorporacao:
 *           type: string
 *           format: date
 *           description: Data de incorporação do agente
 *         cargo:
 *           type: string
 *           minLength: 2
 *           description: Cargo do agente
 *       example:
 *         nome: "João Silva"
 *         dataDeIncorporacao: "2022-01-15"
 *         cargo: "Investigador"
 *     Caso:
 *       type: object
 *       required:
 *         - titulo
 *         - descricao
 *         - status
 *         - agente_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único do caso (gerado automaticamente)
 *         titulo:
 *           type: string
 *           minLength: 1
 *           description: Título do caso
 *         descricao:
 *           type: string
 *           minLength: 1
 *           description: Descrição detalhada do caso
 *         status:
 *           type: string
 *           enum: [aberto, solucionado]
 *           description: Status atual do caso
 *         agente_id:
 *           type: integer
 *           description: ID do agente responsável pelo caso
 *       example:
 *         id: 1
 *         titulo: "Furto de veículo"
 *         descricao: "Veículo furtado no estacionamento do shopping"
 *         status: "aberto"
 *         agente_id: 1
 */

/**
 * @openapi
 * tags:
 *   name: Agentes
 *   description: Gerenciamento de agentes do departamento de polícia
 */

/**
 * @openapi
 * /agentes:
 *   get:
 *     summary: Listar todos os agentes
 *     tags: [Agentes]
 *     parameters:
 *       - in: query
 *         name: cargo
 *         schema:
 *           type: string
 *         description: Filtrar agentes por cargo
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [dataDeIncorporacao, -dataDeIncorporacao]
 *         description: Ordenar agentes por data de incorporação (dataDeIncorporacao = crescente, -dataDeIncorporacao = decrescente)
 *     responses:
 *       200:
 *         description: Lista de agentes retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Agente'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', agentesController.getAllAgentes);

/**
 * @openapi
 * /agentes/{id}/casos:
 *   get:
 *     summary: Listar casos de um agente específico
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agente
 *     responses:
 *       200:
 *         description: Lista de casos do agente retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Agente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Nenhum agente encontrado para o id especificado
 *                 errors:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id/casos', agentesController.getCasosByAgenteId);

/**
 * @openapi
 * /agentes/{id}:
 *   get:
 *     summary: Buscar agente por ID
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agente
 *     responses:
 *       200:
 *         description: Agente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Agente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Nenhum agente encontrado para o id especificado
 *                 errors:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', agentesController.getAgenteById);

/**
 * @openapi
 * /agentes:
 *   post:
 *     summary: Criar um novo agente
 *     tags: [Agentes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoAgente'
 *     responses:
 *       201:
 *         description: Agente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Parâmetros inválidos
 *                 errors:
 *                   type: array
 *                   example:
 *                     - O cargo é obrigatório
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', newAgenteValidation, agentesController.createAgente);

/**
 * @openapi
 * /agentes/{id}:
 *   put:
 *     summary: Atualizar agente completo
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoAgente'
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Parâmetros inválidos
 *                 errors:
 *                   type: array
 *                   example:
 *                     - O cargo é obrigatório
 *       404:
 *         description: Agente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Nenhum agente encontrado para o id especificado
 *                 errors:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', updateAgenteValidation, agentesController.updateAgente);

/**
 * @openapi
 * /agentes/{id}:
 *   patch:
 *     summary: Atualizar agente parcialmente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 minLength: 2
 *               dataDeIncorporacao:
 *                 type: string
 *                 format: date
 *               cargo:
 *                 type: string
 *                 minLength: 2
 *             example:
 *               cargo: "Delegado"
 *     responses:
 *       200:
 *         description: Agente atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Parâmetros inválidos
 *                 errors:
 *                   type: array
 *                   example:
 *                     - O nome não pode ser vazio
 *       404:
 *         description: Agente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Nenhum agente encontrado para o id especificado
 *                 errors:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/:id', partialUpdateAgenteValidation, agentesController.updatePartialAgente);

/**
 * @openapi
 * /agentes/{id}:
 *   delete:
 *     summary: Deletar um agente
 *     tags: [Agentes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do agente
 *     responses:
 *       204:
 *         description: Agente deletado com sucesso
 *       404:
 *         description: Agente não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: Nenhum agente encontrado para o id especificado
 *                 errors:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', agentesController.deleteAgente);

// Exporta o router para ser usado no servidor principal
module.exports = router;
