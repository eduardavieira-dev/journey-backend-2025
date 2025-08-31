const express = require('express');
const router = express.Router();
const casosController = require('../controllers/casosController');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    newCasoValidation,
    updateCasoValidation,
    partialUpdateCasoValidation,
} = require('../utils/casosValidations');

// Protege todas as rotas de casos
router.use(authMiddleware);

/**
 * @openapi
 * components:
 *   schemas:
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
 *     NovoCaso:
 *       type: object
 *       required:
 *         - titulo
 *         - descricao
 *         - agente_id
 *       properties:
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
 *           default: aberto
 *           description: Status atual do caso
 *         agente_id:
 *           type: integer
 *           description: ID do agente responsável pelo caso
 *       example:
 *         titulo: "Roubo de celular"
 *         descricao: "Celular roubado na região central"
 *         status: "aberto"
 *         agente_id: 1
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
 */

/**
 * @openapi
 * tags:
 *   name: Casos
 *   description: Gerenciamento de casos policiais
 */

/**
 * @openapi
 * /casos:
 *   get:
 *     summary: Listar todos os casos
 *     tags: [Casos]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aberto, solucionado]
 *         description: Filtrar casos por status
 *       - in: query
 *         name: agente_id
 *         schema:
 *           type: integer
 *         description: Filtrar casos por ID do agente responsável
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Buscar casos por termo no título ou descrição
 *     responses:
 *       200:
 *         description: Lista de casos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', casosController.getAllCasos);

/**
 * @openapi
 * /casos/search:
 *   get:
 *     summary: Buscar casos por termo
 *     description: Retorna uma lista de casos com base no termo de pesquisa no título ou descrição
 *     tags: [Casos]
 *     parameters:
 *       - name: q
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: Roubo no banco
 *     responses:
 *       200:
 *         description: Lista de casos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Nenhum caso encontrado para o termo pesquisado
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
 *                   example: Nenhum caso encontrado para a busca especificada
 *                 errors:
 *                   type: array
 *                   example: []
 */
router.get('/search', casosController.filter);

/**
 * @openapi
 * /casos/{id}/agente:
 *   get:
 *     summary: Buscar agente responsável por um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Agente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Agente'
 *       404:
 *         description: Caso não encontrado ou agente não encontrado
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
 *                   example: Nenhum caso encontrado para o id especificado
 *                 errors:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id/agente', casosController.getAgenteByCasoId);

/**
 * @openapi
 * /casos/{id}:
 *   get:
 *     summary: Buscar caso por ID
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do caso
 *     responses:
 *       200:
 *         description: Caso encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
 *       404:
 *         description: Caso não encontrado
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
 *                   example: Nenhum caso encontrado para o id especificado
 *                 errors:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', casosController.getCasosById);

/**
 * @openapi
 * /casos:
 *   post:
 *     summary: Criar um novo caso
 *     tags: [Casos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoCaso'
 *     responses:
 *       201:
 *         description: Caso criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
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
 *                     - O status é obrigatório
 *                     - O status deve ser "aberto" ou "solucionado"
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
router.post('/', newCasoValidation, casosController.createCaso);

/**
 * @openapi
 * /casos/{id}:
 *   put:
 *     summary: Atualizar caso completo
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do caso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoCaso'
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
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
 *                     - O status é obrigatório
 *                     - O status deve ser "aberto" ou "solucionado"
 *       404:
 *         description: Caso não encontrado ou agente não encontrado
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
 *                   example: Nenhum agente encontrado para o agente_id especificado
 *                 errors:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', updateCasoValidation, casosController.updateCaso);

/**
 * @openapi
 * /casos/{id}:
 *   patch:
 *     summary: Atualizar caso parcialmente
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do caso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 minLength: 1
 *               descricao:
 *                 type: string
 *                 minLength: 1
 *               status:
 *                 type: string
 *                 enum: [aberto, solucionado]
 *               agente_id:
 *                 type: integer
 *             example:
 *               status: "solucionado"
 *     responses:
 *       200:
 *         description: Caso atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Caso'
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
 *                     - O status deve ser "aberto" ou "solucionado"
 *       404:
 *         description: Caso não encontrado ou agente não encontrado
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
 *                   example: Nenhum agente encontrado para o agente_id especificado
 *                 errors:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/:id', partialUpdateCasoValidation, casosController.updatePartialCaso);

/**
 * @openapi
 * /casos/{id}:
 *   delete:
 *     summary: Deletar um caso
 *     tags: [Casos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do caso
 *     responses:
 *       204:
 *         description: Caso deletado com sucesso
 *       404:
 *         description: Caso não encontrado
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
 *                   example: Nenhum caso encontrado para o id especificado
 *                 errors:
 *                   type: array
 *                   example: []
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', casosController.deleteCaso);

// Exporta o router para ser usado no servidor principal
module.exports = router;
