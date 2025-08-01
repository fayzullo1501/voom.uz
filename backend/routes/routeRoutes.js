const express = require('express');
const router = express.Router();
const { searchRoutes, createRoute } = require('../controllers/routeController');
const auth = require('../middleware/authMiddleware');


// 🔍 Поиск подходящих маршрутов
router.post('/search', searchRoutes);

// 🆕 Создание маршрута водителем
router.post('/', auth, createRoute);

module.exports = router;
