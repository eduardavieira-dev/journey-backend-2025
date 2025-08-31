const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Rotas públicas
router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

// Rotas protegidas
router.delete('/users/:id', authMiddleware, authController.deleteUser);

router.get('/me', authMiddleware, authController.me);

module.exports = router;
